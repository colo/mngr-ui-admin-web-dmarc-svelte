'use strict'

import * as Debug from 'debug'
const debug = Debug('js:dataSources')
debug.log = console.log.bind(console) // don't forget to bind to console!

const Moo = require('mootools')
// import EventBus from 'svelte-eventbus'
import { global as EventBus } from  '../libs/eventbus'

let qs = require('qs')

export default new Class({
  Implements: [Options, Events],

  pipelines: {},
  __pipelines_cfg: {},
  unwatch_store: undefined,

  _components_req: {},
  _components_req_events: [],

  ON_PIPELINE_READY: 'onPipelineReady',

  pipeline_id: undefined,
  id: undefined,

  options: {
    store: false,
  },
  initialize: function(options){
    debug('initialize', options)
    if (this.options.store && this.options.store === true) this.__register_store_module(this.id, sourceStore)
    // this.__bind_components_to_sources(this.components)
    Object.each(this._components_req, function (_components_req, pipeline_id) {
      this.__bind_components_to_sources(_components_req)
    }.bind(this))

    this.create_pipelines()

  },
  destroy: function () {
    debug('lifecycle destroyed', this.id, this._uid)

    let pipeline_id = []
    if (!Array.isArray(this.pipeline_id)) {
      pipeline_id = [this.pipeline_id]
    } else {
      pipeline_id = this.pipeline_id
    }
    Array.each(pipeline_id, function (id) {
      // EventBus.off(id + '.' + this.path, this.__process_input_data)
      delete this._components_req[pipeline_id]
    }.bind(this))

    debug('lifecycle destroyed off EventBUS.EVENTS %o', this._components_req_events)

    Array.each(this._components_req_events, function (event) {
      EventBus.off(event, this.__process_input_data)
      debug('lifecycle destroyed off EventBUS.EVENTS %o %s', EventBus.events, event)
    }.bind(this))

    this.destroy_pipelines()
  },
  __bind_components_to_sources: function (_components) {
      for (const prop in _components) {
        let components = _components[prop]

        if (!Array.isArray(components)) {
          components = [components]
        }

        for (const index in components) {
          // if (components[index].source && components[index].source.requests) {
          if (components[index].source) {
            let _sources = components[index].source
            let reqs
            for (const req_type in _sources) {
              if (req_type === 'requests') {
                reqs = []
                Object.each(_sources.requests, function (_req, type) {
                  if (_req) { reqs.combine(_req) }
                })
                // reqs = Array.combine(_sources.requests.once, _sources.requests.periodical)
              } else {
                reqs = _sources[req_type]
              }

              if (!Array.isArray(reqs)) { reqs = [reqs] }

              for (let j = 0; j < reqs.length; j++) {
                // let key = reqs[j].params
                // let source = reqs[j].params
                // let callback = reqs[j].callback

                // debug('__components_sources_to_requests', j, reqs, typeof (source))

                // debug('__components_sources_to_requests', req_type, key)
                // debug('__bind_components_to_sources TYPE', typeof (reqs[j].params), reqs)

                if (reqs[j] && reqs[j].params && typeof reqs[j].params === 'function') {
                  reqs[j].params = reqs[j].params.bind(components[index])
                  // source.bind(components[index])
                }
                // if (typeof callback === 'function') {
                //   // reqs[j].params = callback.bind(components[index])
                // }
                // debug('__components_sources_to_requests', req_type, key)
                //
                // if (!sources[req_type]) sources[req_type] = {}
                //
                // sources[req_type][key] = source
              }
            }
          }
        }
      }
    },
    // __find_in_children: function (name, vm) {
    //   let children = []
    //   try {
    //     const vq = VueQuery(vm)
    //     children = vq.children(name)
    //
    //     if (children.length === 0) {
    //       Array.each(vq.children(), function (child) {
    //         children.combine(this.__find_in_children(name, child))
    //       }.bind(this))
    //     }
    //
    //     debug('__find_in_children', name, vm, children)
    //
    //     return children
    //   } catch (e) {
    //     debug('__find_in_children ERROR', name, vm, children, e)
    //     return children
    //   }
    // },
    __update_component_data: function (component, key, type, payload) {
      debug('__update_component_data', this._uid, component, key, type, Object.clone(payload))

      let callback = this.__get_source_callback_from_key(component.source, key, type)

      if (callback && typeof callback === 'function') {
        callback.attempt([payload.data, payload.metadata, key, this], component)
        // callback(data)
      } else if (component.component && component.component.name) {
        const vq = VueQuery(this)
        let _components = vq.find(component.component.name)
        debug('__update_component_data', this, component.component.name, component, key, _components)
        let instance
        if (_components.length > 1) { // try to match by id
          for (let i = 0; i < _components.length; i++) {
            if (component.id === _components[i].vm.id) {
              instance = _components[i].vm
              // break loop
              i = _components.length
            }
          }
        } else if (_components.length === 1) { // try to match by id
          instance = _components[0].vm
        }

        debug('__update_component_data INSTACE', component, callback, instance)
        if (instance === undefined) instance = this

        if (instance[callback] && typeof instance[callback] === 'function') {
          debug('__update_component_data INSTACE run', component, callback, instance)
          instance[callback](payload.data, payload.metadata, key, this)
        } else if (instance[callback]) {
          instance[callback] = {
            data: payload.data,
            metadata: payload.metadata,
            key: key
          }
        }
      }
      // else if (component.component && component.component.methods && component.component.methods[callback] && typeof component.component.methods[callback] === 'function') {
      //   // component.component.methods[callback].attempt([payload.data, payload.metadata, key, this], component)
      // } else {
      //   component.component[callback] = {
      //     data: payload.data,
      //     metadata: payload.metadata,
      //     key: key
      //   }
      // }
    },
    __get_source_callback_from_key: function (source, key, input) {
      input = input || 'requests'
      let callback

      for (const type in source) {
        if (type === input) {
          if (type === 'store') {
            let reqs = source[type]
            if (!Array.isArray(reqs)) reqs = [reqs]

            for (let i = 0; i < reqs.length; i++) {
              if (reqs[i] && reqs[i].params) {
                let _key = this.__query_to_key(reqs[i].params)
                if (_key === key || (Array.isArray(_key) && _key.indexOf(key) > -1)) {
                  debug('__get_source_callback_from_key', reqs[i])
                  callback = reqs[i].callback
                }
              }
            }
          } else {
            for (const req_type in source[type]) {
              let reqs = source[type][req_type]
              if (!Array.isArray(reqs)) reqs = [reqs]

              for (let i = 0; i < reqs.length; i++) {
                if (reqs[i] && reqs[i].params) {
                  let _key = this.__query_to_key(reqs[i].params)
                  // if(Array.isArray(_key) && _key.indexOf(key) > -1 ){
                  //   let index = _key.indexOf(key)
                  // }
                  // else
                  if (_key === key || (Array.isArray(_key) && _key.indexOf(key) > -1)) {
                    debug('__get_source_callback_from_key', reqs[i], this._uid)
                    callback = reqs[i].callback
                  }
                }
              }
            }
          }
        }
      }

      return callback
    },
    __source_to_keys: function (source, input) {
      debug('__source_to_keys -> %o %s', source, input, this._uid)
      input = input || 'requests'
      let keys = []
      for (const type in source) {
        if (type === input) {
          if (type === 'store') {
            let reqs = source[type]
            if (!Array.isArray(reqs)) reqs = [reqs]

            debug('__source_to_keys STORE %o', reqs)

            for (let i = 0; i < reqs.length; i++) {
              if (reqs[i] && reqs[i].params) {
                let key = this.__query_to_key(reqs[i].params)
                if (Array.isArray(key)) {
                  Array.each(key, function (_key) {
                    keys.push(_key)
                  })
                } else {
                  keys.push(key)
                }
              }
            }
          } else {
            for (const req_type in source[type]) {
              let reqs = source[type][req_type]
              if (!Array.isArray(reqs)) reqs = [reqs]

              debug('__source_to_keys REQUEST %o', reqs)

              for (let i = 0; i < reqs.length; i++) {
                if (reqs[i] && reqs[i].params) {
                  let key = this.__query_to_key(reqs[i].params)
                  if (Array.isArray(key)) {
                    Array.each(key, function (_key) {
                      keys.push(_key)
                    })
                  } else {
                    keys.push(key)
                  }
                }
              }
            }
          }
        }
      }

      debug('__source_to_keys KEYS', keys, input)
      return keys
    },
    __query_to_key: function (query) {
      if (typeof query === 'function') {
        let _result = query.attempt([undefined, this])
        debug('__query_to_key', _result, query, this)
        return _result.key
      } else if (typeof query === 'string') {
        return query
      } else {
        let _query = Object.merge(query.query, query.body)
        debug('__query_to_string', query.path + '?' + qs.stringify(_query))
        return query.path + '?' + qs.stringify(_query)
      }
    },

    __register_store_module: function (id, module) {
      debug('__register_store_module', id)

      // if (!process.env.DEV) { if (old && this.$store.state['data_sources_' + old]) { this.$store.unregisterModule('data_sources_' + old) } }
      // if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }

      if (id && !this.$store.state[id + '_sources']) {
        this.$store.registerModule(id + '_sources', Object.clone(module))

        // this.$store.commit(this.id + '_sources/add', { id: 'periodical?register=periodical&transformation=limit%3A30000', data: { range: [] } })

        // this.$store.watch((state) => state[this.id + '_sources']['periodical?register=periodical&transformation=limit%3A30000'], (val, oldVal) => {
        this.unwatch_store = this.$store.watch((state) => state[id + '_sources'], (val, oldVal) => {
          debug('$store watch %o', val)
          Object.each(val, function (payload, id) {
            this.__process_data(payload, 'store')
          }.bind(this))
          //   // if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000']) { this.$set(this.components_data, 'periodical?register=periodical&transformation=limit%3A30000', {}) }
          //
          //   debug('watcher', val)
          //   if (val['range']) {
          //     for (const index in val['range']) {
          //       this.$set(this.components['6'][0].options.range, index, val['range'][index])
          //     }
          //   }
          //   // for (const key in val) {
          //   //   if (Array.isArray(val[key])) {
          //   //     // if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key]) this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, null)
          //   //     for (const i in val[key]) {
          //   //       if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key]) this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, [])
          //   //       this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key], i, val[key][i])
          //   //     }
          //   //   } else {
          //   //     this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, val[key])
          //   //   }
          //   // }
          //   // this.$set(this.components_data, 'periodical?register=periodical&transformation=limit%3A30000', val)
          //   // this.$set(this.MyRange, 0, val.range[0])
          //   // this.$set(this.MyRange, 1, val.range[1])
        }, {
          deep: true
        })
      }
    },
    __unregister_store_module: function (id) {
      debug('__unregister_store_module', id)

      if (!process.env.DEV) {
        if (id && this.$store.state[id + '_sources']) {
          if (this.unwatch_store) {
            this.unwatch_store()
          }
          this.$store.unregisterModule(id + '_sources')
        }
      }
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
    },
    __process_input_data: function (e, payload) {
      debug('__process_input_data', payload)

      EventBus.emit('received:' + payload.input + '[' + payload.id + ']', this, payload)

      // for (const key in payload.data) {
      //   this.$store.commit(this.id + '_sources/append', { id: payload.id, key: key, data: payload.data[key] })
      // }
      if (this.store === true) {
        this.$store.commit(this.id + '_sources/add', payload)
      }
      // else {
      this.__process_data(payload, 'requests')
      // }
    },
    __process_data: function (payload, type) {
      type = type || 'requests'
      let key = payload.id
      debug('__process_data', this._components_req, payload.id, payload.input)

      // Object.each(this._components_req, function (_components_req, pipeline_id) {
      let _components_req = this._components_req[payload.input]
      for (const prop in _components_req) {
        let components = _components_req[prop]
        // if (!Array.isArray(components)) components = [components]

        if (Array.isArray(components)) {
          for (let index = 0; index < components.length; index++) {
            if (
              components[index].source &&
                this.__source_to_keys(components[index].source, type).contains(key)
            ) {
              this.__update_component_data(components[index], key, type, payload)
            }
          }
        } else {
          if (components.source && this.__source_to_keys(components.source, type).contains(key)) {
            this.__update_component_data(components, key, type, payload)
          }
        }
      }
      // }.bind(this))
    },
    __components_sources_to_requests_merge: function (original_components, new_components) {
      debug('__components_sources_to_requests_merge', original_components, new_components)
      Object.each(new_components, function (data, name) {
        if (!original_components[name]) {
          original_components[name] = data
        } else {
          if (Array.isArray(original_components[name])) {
            if (!Array.isArray(data)) data = [data]
            original_components[name].combine(data)
          } else {
            let old = original_components[name]
            original_components[name] = [old]

            if (!Array.isArray(data)) data = [data]
            original_components[name].combine(data)
          }
        }
      })

      return original_components
    },
    components_to_keys: function (components) {
      let keys = []
      Object.each(components, function (component, name) {
        keys.combine(this.component_to_keys(component))
      }.bind(this))
      debug('components_to_keys', components, keys)
      return keys
    },
    component_to_keys: function (component) {
      if (!Array.isArray(component)) component = [component]

      let keys = []
      Array.each(component, function (row) {
        if (row.source) {
          Object.each(row.source, function (source, type) {
            keys.combine(this.__source_to_keys(row.source, type))
          }.bind(this))
        }
      }.bind(this))

      debug('component_to_keys', component, keys)

      return keys
    },
    __components_sources_to_requests: function (_components, pipeline_id) {
      pipeline_id = pipeline_id || this.pipeline_id
      let requests = {}
      let sources = {}

      debug('__components_sources_to_requests ->', pipeline_id, this._components_req)

      if (this._components_req[pipeline_id]) {
        // debug('__components_sources_to_requests MERGE', this._components_req[pipeline_id], _components)
        // this._components_req[pipeline_id] = Object.merge(this._components_req[pipeline_id], _components)
        this._components_req[pipeline_id] = this.__components_sources_to_requests_merge(this._components_req[pipeline_id], _components)
      } else {
        this._components_req[pipeline_id] = _components
      }
      // let _components = JSON.parse(JSON.stringify(this.components))
      debug('__components_sources_to_requests', _components)
      for (const prop in _components) {
        let components = _components[prop]

        if (!Array.isArray(components)) {
          components = [components]
        }

        for (const index in components) {
          if (components[index].source && components[index].source.requests) {
            let _requests = components[index].source.requests

            for (const req_type in _requests) {
              let reqs = _requests[req_type]
              if (!Array.isArray(reqs)) { reqs = [reqs] }

              for (let j = 0; j < reqs.length; j++) {
                if (reqs[j] && reqs[j].params) {
                  let key = reqs[j].params
                  let source = reqs[j].params

                  // debug('__components_sources_to_requests', j, reqs, typeof (source))

                  // debug('__components_sources_to_requests', req_type, key)
                  debug('__components_sources_to_requests TYPE', typeof (source), reqs)

                  if (typeof source === 'string') {
                    source = { path: source.substring(0, source.indexOf('?')), query: qs.parse(source.substring(source.indexOf('?') + 1)) }
                  } else if (typeof source === 'function') {
                    // source = source.bind(components[index])
                    // let _result = source.attempt(undefined, components[index])
                    let _result = source.attempt([undefined, this])
                    debug('__components_sources_to_requests RESULT', _result, components[index], this._uid)
                    key = _result.key
                    // source = { bind: components[index], function: source }
                    // source = _result.source
                  } else {
                    key = key.path + '?' + qs.stringify(Object.merge(key.query, key.body))
                  }

                  if (!sources[req_type]) sources[req_type] = {}

                  if (Array.isArray(key)) {
                    Array.each(key, function (_key, index) {
                      debug('__components_sources_to_requests', req_type, _key)
                      sources[req_type][_key] = source// always the same source...function
                    })
                  } else {
                    sources[req_type][key] = source
                  }
                }
              }
            }
          }
        }
      }

      debug('__components_sources_to_requests', sources)
      let self = this
      for (const req_type in sources) {
        if (!requests[req_type]) requests[req_type] = []

        for (const key in sources[req_type]) {
          let query = sources[req_type][key]

          requests[req_type].push({
            init: function (req, next, app) {
              let _query = query
              // if (typeof query === 'function') { _query = query.pass(key)().source }
              if (typeof query === 'function') { _query = query.attempt([key, self]).source }// don't use "this" as is the pipeline.input context

              debug('INIT %s %o', key, _query, self._uid)
              // if (query.bind && query.function) { _query = query.function.attempt(key, query.bind).source }

              if (_query !== undefined) {
                if (!Array.isArray(_query)) {
                  _query = [Object.clone(_query)]
                } else {
                  _query = Array.clone(_query)
                }

                for (let i = 0; i < _query.length; i++) {
                  let emit_query = Object.clone(_query[i])

                  let stringified = qs.stringify(Object.merge(emit_query.query, emit_query.body))
                  stringified = emit_query.path + '?' + stringified

                  if (!emit_query.params) emit_query.params = {}
                  emit_query.params.id = (emit_query.params.id) ? pipeline_id + '[' + emit_query.params.id + ']' : pipeline_id + '[' + stringified + ']'

                  debug('io EMIT', _query[i], emit_query)

                  // Array.each(pipeline_id, function (id) {
                  debug('__components_sources_to_requests EventBUS.EVENTS %o %s', EventBus.events, emit_query.params.id)
                  // if (EventBus && !EventBus.events[pipeline_id + '.' + this.path])
                  if (
                    EventBus &&
                    (
                      !EventBus.events[emit_query.params.id] ||
                      (EventBus.events[emit_query.params.id] && EventBus.events[emit_query.params.id].length === 0)
                      // (EventBus.events[pipeline_id + '.' + this.path] && !EventBus.events[pipeline_id + '.' + this.path].contains(this.__process_input_data))
                    )
                  ) {
                    // EventBus.on(emit_query.params.id, function (payload) {
                    //   try {
                    //     self.__process_input_data(payload)
                    //     EventBus.emit('received:' + emit_query.params.id, payload)
                    //   } catch (e) {
                    //     debug('EventBus.on', e)
                    //   }
                    // })
                    EventBus.on(emit_query.params.id, self.__process_input_data, self)

                    self._components_req_events = self._components_req_events.combine([emit_query.params.id])
                  }
                  // EventBus.on(pipeline_id + '.' + this.path, function (data) { debug('EventBus.on', pipeline_id + '.' + this.path, data) })
                  // }.bind(self))

                  // EventBus.emit('sent:' + emit_query.params.id, self, emit_query)

                  app.io.emit('/', emit_query)
                  debug('FUNC EMIT', emit_query.params.id)

                }
              }

              // debug('FUNC EMIT', _query)

              // next()
            }
          })
        }

        // for (const key in sources[req_type]) {
        //   let query = Object.clone({ query: sources[req_type][key].query })
        //   requests[req_type].push(query)
        // }

        // let fun = {}
        // fun[req_type] = function (req, next, app) {
        //   for (const key in sources[req_type]) {
        //     let query = Object.clone({ query: sources[req_type][key].query })
        //
        //     // app.io.emit('/', query)
        //     app.io.emit(['/', query])
        //     debug('FUNC EMIT', query, app.)
        //
        //     // requests[req_type].push({
        //     //   init: function (req, next, app) {
        //     //   // debug('INIT', app)
        //     //     app.io.emit('/', query)
        //     //     debug('FUNC EMIT', query)
        //     //   }
        //     // })
        //   }
        // }

        // requests[req_type].push(fun)
      }

      debug('__components_sources_to_requests REQUEST', requests)
      return requests
      // template.input[0].poll.conn[0].requests.once.push({
      //   init: function (req, next, app) {
      //     debug('INIT', app)
      //     app.io.emit('/', {
      //       query: { register: 'periodical' },
      //       body: {
      //         'transformation': 'limit:30000'
      //
      //       }
      //     })
      //   }
      // })
    },
    __merge_requests: function (pipeline_id, new_requests) {
      let components_requests = {}

      Array.each(this.pipelines[pipeline_id].inputs, function (input, input_index) {
        Array.each(this.pipelines[pipeline_id].inputs[input_index].options.conn, function (conn, conn_index) {
          let _old_requests = this.pipelines[pipeline_id].inputs[input_index].options.conn[conn_index].requests
          /**
          * Debe 'mergear' once, periodical, range y dentro de esas 'combinar' los arrays
          **/

          Array.each(['range', 'periodical', 'once'], function (req_type) {
            if (!Array.isArray(components_requests[req_type])) { components_requests[req_type] = [] }

            if (_old_requests[req_type]) { components_requests[req_type] = components_requests[req_type].combine(_old_requests[req_type]) }

            if (new_requests[req_type]) { components_requests[req_type] = components_requests[req_type].combine(new_requests[req_type]) }
          })
          // components_requests = Object.merge(
          //   components_requests,
          //   this.pipelines[pipeline_id].inputs[input_index].options.conn[conn_index].requests,
          //   this.__components_sources_to_requests(this.components, pipeline_id),
          // )
        }.bind(this))
      }.bind(this))

      return components_requests
    },
    suspend_pipelines: function (suspend_id) {
      debug('suspend_pipelines %s', this.pipeline_id)

      let pipeline_id = []
      if (!Array.isArray(this.pipeline_id)) {
        pipeline_id = [this.pipeline_id]
      } else {
        pipeline_id = this.pipeline_id
      }

      Array.each(pipeline_id, function (id) {
        if (!suspend_id || suspend_id === undefined || suspend_id === id) {
          let pipe = this.pipelines[id]
          if (pipe) {
            pipe.fireEvent('onSuspend')

            debug('suspended_pipelines', id)
          }
        }
      }.bind(this))

      // Object.each(this.pipelines, function (pipe, id) { // destroy old ones
      //   if ((Array.isArray(this.pipeline_id) && this.pipeline_id.contains(id)) || id === this.pipeline_id) {
      //     pipe.fireEvent('onSuspend')
      //     // pipe.fireEvent('onExit')
      //     // pipe.removeEvents()
      //     //
      //     // delete this.pipelines[id]
      //   }
      // }.bind(this))

      debug('suspend_pipelines', this.pipelines)
    },
    resume_pipelines: function (resume_id) {
      debug('resume_pipelines %s', resume_id, this.pipeline_id)

      let pipeline_id = []
      if (!Array.isArray(this.pipeline_id)) {
        pipeline_id = [this.pipeline_id]
      } else {
        pipeline_id = this.pipeline_id
      }

      Array.each(pipeline_id, function (id) {
        if (!resume_id || resume_id === undefined || resume_id === id) {
          let pipe = this.pipelines[id]
          if (pipe) {
            pipe.fireEvent('onResume')
            pipe.fireEvent('onOnce')

            debug('resumed_pipelines', id)
          }
        }
      }.bind(this))

      // Object.each(this.pipelines, function (pipe, id) { // destroy old ones
      //   if (
      //     ((Array.isArray(this.pipeline_id) && this.pipeline_id.contains(id)) || id === this.pipeline_id) &&
      //     (!resume_id || resume_id === undefined || resume_id === id)
      //   ) {
      //     pipe.fireEvent('onResume')
      //     pipe.fireEvent('onOnce')
      //     // pipe.fireEvent('onExit')
      //     // pipe.removeEvents()
      //     //
      //     // delete this.pipelines[id]
      //     debug('resumed_pipelines', id)
      //   }
      // }.bind(this))

      debug('resume_pipelines', this.pipelines)
    },
    destroy_pipelines: function (destroy_id) {
      debug('destroy_pipelines %s', destroy_id, this.pipeline_id)
      let pipeline_id = []
      if (!Array.isArray(this.pipeline_id)) {
        pipeline_id = [this.pipeline_id]
      } else {
        pipeline_id = this.pipeline_id
      }

      Array.each(pipeline_id, function (id) {
        if (!destroy_id || destroy_id === undefined || destroy_id === id) {
          let pipe = this.pipelines[id]
          if (pipe) {
            pipe.fireEvent('onSuspend')
            pipe.fireEvent('onExit')
            pipe.removeEvents()

            delete this.pipelines[id]
          }
        }
      }.bind(this))

      // Object.each(this.pipelines, function (pipe, id) { // destroy old ones
      //   if (!destroy_id || destroy_id === undefined || destroy_id === id) {
      //     pipe.fireEvent('onSuspend')
      //     pipe.fireEvent('onExit')
      //     pipe.removeEvents()
      //
      //     delete this.pipelines[id]
      //   }
      // }.bind(this))

      debug('destroy_pipelines', this.pipelines)
    },
    __after_connect_inputs: function (pipeline, cfg, cb) {
      let _client_connect = function (index) {
        debug('__after_connect_inputs %o %d', cfg.connected, index)

        // cfg.connected.push(true)
        cfg.connected[index] = true
        if (cfg.connected.every(function (input) { return input }) && pipeline.inputs.length === cfg.connected.length && cb && typeof cb === 'function') {
          cb()
        }

        pipeline.inputs[index].removeEvent('onClientConnect', _client_connect)
      }

      Array.each(pipeline.inputs, function (input, index) {
        debug('__after_connect_inputs INPUT', input.conn_pollers)
        if (Object.getLength(input.conn_pollers) > 0 && Object.every(input.conn_pollers, function (poller, key) { return poller.connected })) {
          debug('__after_connect_inputs ALREADY CONNECTED', index)
          _client_connect(index)
        } else {
          input.addEvent('onClientConnect', _client_connect.pass(index))
        }
      })
    },
    /**
    * use event === false on get_pipeline, so it won't fire the event
    **/
    __resume_pipeline: function (pipeline, cfg, id, cb, event) {
      debug('__resume_pipeline', pipeline, cfg, id)

      if (id) {
        if (!cfg.ids.contains(id)) { cfg.ids.push(id) }

        if (cfg.suspended === true) {
          debug('__resume_pipeline this.pipeline.connected', cfg.connected)

          if (cfg.connected.every(function (item) { return item === true })) {
            cfg.suspended = false
            pipeline.fireEvent('onResume')
          } else {
            let __resume = []
            Array.each(pipeline.inputs, function (input, index) {
              if (cfg.connected[index] !== true) {
                __resume[index] = function () {
                  this.__resume_pipeline(pipeline, cfg, id)
                  input.conn_pollers[0].removeEvent('onConnect', __resume[index])
                }
                input.conn_pollers[0].addEvent('onConnect', () => __resume[index])
              }
            })
          }
        }
      }

      // this.chain(cb, this.fireEvent('ON_PIPELINE_READY', pipeline));

      if (cb) {
        // if (event === false) {
        cb()
        // } else {
        //   let _chain = new Chain()
        //   _chain.chain(
        //     cb,
        //     this.fireEvent.pass([this.ON_PIPELINE_READY, pipeline], this)
        //   )
        //
        //   while (_chain.callChain() !== false) {}
        // }
      } else {
        this.fireEvent(this.ON_PIPELINE_READY, pipeline)
      }
    }

    /**
    * @end pipelines
    **/

})
