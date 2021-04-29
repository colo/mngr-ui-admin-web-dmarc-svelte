<script>

import * as Debug from 'debug'
const debug = Debug('js:AppDataSources')
debug.log = console.log.bind(console) // don't forget to bind to console!

import dataSource from '@mixins/dataSources.js'

import JSPipeline from '../../modules/js-pipeline'

// import Pipeline from '@apps/hosts/pipelines/periodical'
import Pipeline from '../libs/pipelines'

import InputIO from '../libs/pipelines/input/graphql.io'
// import IO from '@libs/pipelines/default.io'
import IO from '../libs/pipelines/default.graphql.io'
import DocIDFilter from '../libs/pipelines/filters/doc_id'
import OutputEventbus from '../libs/pipelines/output/eventbus'


import { global as EventBus } from '../libs/eventbus'

import { requests, store } from '../sources/index'

import {SECOND, MINUTE, HOUR, DAY, WEEK} from '../libs/time/const'

let hosts = []
const DS = new Class({
  Extends: dataSource,

  // store: true,
  pipeline_id: ['input.dmarc.periodical'],

	id: 'input.dmarc.periodical',
  path: 'all',
  // refresh: SECOND,

  hosts: [],


  components: {
    'all': [
      {
        // some_data: {
        //   hosts: true
        // },
        source: {
          requests: requests,
          store: store
        }
      }

    ]
  },

  // initialize: function(options, component){
  //   debug('initialize %o', component)
  //   this.parent(options)
  // },

  // create_pipelines: function (create_id, next) {
  //   debug('create_pipelines %o', JSON.parse(JSON.stringify(this.pipelines)), create_id, this.components)
	//
  //   let template = Object.clone(Pipeline)
  //   template.input[0].poll.id = this.id
  //   template.input[0].poll.requests.periodical = this.refresh
	//
  //   // let pipeline_id = template.input[0].poll.id
  //   // let pipeline_id = this.id
	//
  //   if (!create_id || create_id === undefined || create_id === this.id) {
  //     // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[this.id], this.id)
  //     let components_requests = {}
	//
  //     if (this.pipelines[this.id]) {
  //       components_requests = this.__merge_requests(this.id, this.__components_sources_to_requests(this.components, this.id))
	//
  //       this.destroy_pipelines(this.id)
  //     } else {
  //       components_requests = this.__components_sources_to_requests(this.components, this.id)
  //     }
	//
  //     let keys = this.components_to_keys(this.components)
	//
  //     debug('create_pipelines REQUESTS %o', components_requests, keys, EventBus)
	//
  //     Array.each(keys, function (key) {
  //       if (
  //         EventBus &&
  //         (
  //           !EventBus.events['sent:' + this.id + '[' + key + ']'] ||
  //           (EventBus.events['sent:' + this.id + '[' + key + ']'] && EventBus.events['sent:' + this.id + '[' + key + ']'].length === 0)
  //           // (EventBus.events[pipeline_id + '.' + this.path] && !EventBus.events[pipeline_id + '.' + this.path].contains(this.__process_input_data))
  //         )
  //       ) {
  //         EventBus.on('sent:' + this.id + '[' + key + ']', function (emit_query) {
  //           debug('start loader for', emit_query.params.id, emit_query)
  //         })
  //         EventBus.on('received:' + this.id + '[' + key + ']', function (payload) {
  //           debug('stop loader for', payload)
  //         })
  //       }
  //     }.bind(this))
	//
  //     Array.each(template.input[0].poll.conn, function (conn, index) {
  //       template.input[0].poll.conn[index].requests = components_requests
  //     })
	//
  //     let pipe = new JSPipeline(template)
	//
  //     this.__pipelines_cfg[this.id] = {
  //       ids: [],
  //       connected: [],
  //       suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
  //     }
	//
  //     this.pipelines[this.id] = pipe
  //   }
  //   debug('create_pipelines %o', this.pipelines)
	//
  //   if (next) { next() }
  // },
	create_pipelines: function (create_id, next) {
    debug('create_pipelines %o', JSON.parse(JSON.stringify(this.pipelines)), create_id, this.components)

    if (!create_id || create_id === undefined || create_id === this.id) {
      // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[this.id], this.id)
      let components_requests = {}

      if (this.pipelines[this.id]) {
        components_requests = this.__merge_requests(this.id, this.__components_sources_to_requests(this.components, this.id))

        this.destroy_pipelines(this.id)
      } else {
        components_requests = this.__components_sources_to_requests(this.components, this.id)
      }

      let keys = this.components_to_keys(this.components)

      debug('create_pipelines REQUESTS %o', components_requests, keys)

			Array.each(keys, function (key) {
        if (
          EventBus &&
          (
            !EventBus.events['sent:' + this.id + '[' + key + ']'] ||
            (EventBus.events['sent:' + this.id + '[' + key + ']'] && EventBus.events['sent:' + this.id + '[' + key + ']'].length === 0)
            // (EventBus.events[pipeline_id + '.' + this.path] && !EventBus.events[pipeline_id + '.' + this.path].contains(this.__process_input_data))
          )
        ) {
          EventBus.on('sent:' + this.id + '[' + key + ']', function (emit_query) {
            debug('start loader for', emit_query.params.id, emit_query)
          })
          EventBus.on('received:' + this.id + '[' + key + ']', function (payload) {
            debug('stop loader for', payload)
          })
        }
      }.bind(this))

      let clients = []
      Array.each(IO(), function (io, index) {
        clients.push(
          new InputIO({
            requests: components_requests,
            // id: 'input.default' + index,
            id: this.id + index,
            index: index
          })
        )
      }.bind(this))

      let template = Pipeline({
        input: {
          // id: 'input.dmarc',
          id: this.id,

          clients: clients,
          // clients: new InputIO({
          //   requests: components_requests,
          //   id: this.id + 0,
          //   index: 0
          // }),

          // type: 'minute', // second || minute || hour || day || once
          requests: {
            periodical: SECOND * 5,
            // periodical: function (dispatch) {
            //   // return cron.schedule('14,29,44,59 * * * * *', dispatch);//every 15 secs
            //   return cron.schedule('*/10 * * * * *', dispatch)// every 20 secs
            // },
          },
          suspended: false,
        },

        filters: [DocIDFilter],

        output: [OutputEventbus],

      })
      // debug('TEMPLATE', template)
      //
      // Array.each(template.input[0].clients, function (conn, index) {
      //   template.input[0].clients[index].requests = components_requests
      // })

      debug('TEMPLATE REQs', template)
      let pipe = new JSPipeline(template)

      this.__pipelines_cfg[this.id] = {
        ids: [],
        connected: [],
        suspended: pipe.inputs.every(function (input) {
          debug('input', input)
          return input.options.suspended
        }, this)
      }

      this.pipelines[this.id] = pipe
    }
    debug('create_pipelines %o', this.pipelines)

    if (next) { next() }
  },
  setHosts: function(h){
		debug('setHosts %o', h)
		if(h && h.length > 0)
    	hosts = h
  }
})

let ds = new DS()



</script>

<ul >
	{#each hosts as { data, metadata }, i}
		<li>
			{i + 1}: {metadata.domain} : {metadata.host}
		</li>
	{/each}
</ul>
