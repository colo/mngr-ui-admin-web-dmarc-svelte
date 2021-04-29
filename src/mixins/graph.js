// <template>
//
//   <component
//     v-if="chart_initialized === true"
//     v-observe-visibility="(chart_initialized === true) ? {
//       callback: visibilityChanged,
//       intersection: {
//         rootMargin: '40px',
//         threshold: 0,
//       },
//       throttle: 100,
//       throttleOptions: {
//         leading: 'visible',
//       },
//     } : false"
//     :is="wrapper.type"
//     :id="id"
//     :ref="id"
//     :EventBus="EventBus"
//     v-bind="bindProps"
//   >
//   </component>
//
// </template>
//
// <script>

'use strict'
const Moo = require('mootools')

import * as Debug from 'debug'
const debug = Debug('mixins:graph')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import { frameDebounce } from 'quasar'
import debounce from 'frame-debounce'

import {roundMilliseconds} from '@libs/time/round'
import { v4 as uuidv4 } from 'uuid'

import dataset from '@mixins/dataset'

export default new Class({
  Extends: dataset,

  // computed: {
  //   bindProps: function () {
  //     return Object.merge(
  //       this.options.wrapper.props,
  //       {
  //         config: this.options.config,
  //         'datasets': this.tabular.data,
  //         'length': (this.options.config.interval) ? this.options.dataset.length * this.options.config.interval : undefined
  //       }
  //     )
  //   }
  // },

  // _graph_mixin_defaults: {
  //   tabular: {
  //     lastupdate: 0,
  //     data: []
  //   },
  //   focus: true,
	//
  //   firt_update: false,
	//
  //   __skiped: 0,
  //   __data_unwatcher: undefined,
  //   // __chart_init: false,
	//
  //   visible: false
  // },
	focus: true,
	firt_update: false,
	__skiped: 0,
	// __data_unwatcher: undefined,
	visible: false,

  options: {
    EventBus: undefined,
    config: {
			interval: 1,
		},
    reactive: false,
    id: uuidv4(),
    wrapper: {
			// type: 'dygraph',
			type: undefined,
			props: {}
		},
    always_update: false,

  },

	tabular: { lastupdate: 0, 'data': [] },
	chart_initialized: false,


	initialize: function(options){
		this.parent(options)
		debug('initialize', this.options.id, this.options, this.chart_data)
		if(!window.charts) window.charts = {}

    if (window.charts[this.options.id] && typeof window.charts[this.options.id].create === 'function') { window.charts[this.options.id].create() }


    if (this.options.config && (!this.options.config.interval || this.options.config.interval === undefined)) { this.options.config.interval = 1 }

    /**
    * maybe set an app option to allow user to choose if its want to  NOT update graphs
    * when window.blur (loose focus it may be visible but not as primary window)
    * right now updates graphs if "appVisible" (even on not primary windows)
    **/
    // window.addEventListener('blur', function () {
    //   debug('$appVisible blur')
    //   this.focus = false
    // }.bind(this), false)
    //
    // window.addEventListener('focus', function () {
    //   debug('$appVisible focus')
    //   this.focus = true
    // }.bind(this), false)

    // this.create()
	},
	bindProps: function () {
		debug('bindProps', Object.merge(
      this.options.wrapper.props,
      {
        config: this.options.config,
        'datasets': this.tabular.data,
        'length': (this.options.config.interval) ? this.options.dataset.length * this.options.config.interval : undefined
      }
    ))

    return Object.merge(
      this.options.wrapper.props,
      {
        config: this.options.config,
        'datasets': this.tabular.data,
        'length': (this.options.config.interval) ? this.options.dataset.length * this.options.config.interval : undefined
      }
    )
  },

  // destroyed () {
  //   this.destroy()
	//
  //   if (this['charts'][this.options.id]) {
  //     // this['charts'][this.options.id] = Object.merge(this['charts'][this.options.id], Object.clone(this._graph_mixin_defaults))
  //     delete this['charts'][this.options.id]
  //   }
	//
  //   this.$off()
  // },
	// vue methods
	reset: function () {
		this.destroy()
		this.create()
	},

	destroy: function () {
		/// ///////console.log('config.vue mixing destroy', this.options.id)
		// if (this['charts'][this.options.id]) {
			// if (this.__data_unwatcher) { this.__data_unwatcher() }

			this.tabular.data = []

			// this.__chart_init = false
		// }
		// this.$set(this.tabular, 'data', [])

		if (window.charts[this.options.id] && typeof window.charts[this.options.id].destroy === 'function') { window.charts[this.options.id].destroy() }
	},
	// __create_watcher: function (name, chart) {},
	update_chart_dataset: function (name, data, inmediate) {
		debug('update_chart_dataset', this.options.id, name, data, inmediate, this.tabular.data)

		inmediate = (inmediate !== undefined) ? inmediate : (this.firt_update === false)
		this.firt_update = true

		// if you are not using buffer, you are managing your data, you are in charge splicing/sorting
		if (this.options.buffer === true) {
			if (data.length === 1) {
				this.tabular.data.shift()
				this.tabular.data.push(data[0])
			} else if (data.length > 0) {
				// let splice = data.length
				// let length = data.length
				// let splice = (this.options.dataset.length || this.tabular.data.length) * this.options.config.interval
				this.tabular.data = data

				// this.tabular.data.splice(
				//   (splice * -1) + 1,
				//   length - splice
				// )
				//
				// debug('update_chart_dataset %s %d %d %d %o', this.options.id, this.options.dataset.length, splice, length, this.tabular.data)
			}

			this.tabular.data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
		} else {
			this.tabular.data = data
		}

		if (
			this.options.config.skip &&
			this.options.config.skip > 0
		// && inmediate !== true
		) {
			// this.options.config.interval = this.options.config.skip
			let new_data = []

			debug('update_chart_dataset2', this.options.id, this.tabular.data)
			Array.each(this.tabular.data, function (row, index) {
				let timestamp = roundMilliseconds(row[0])
				// if(index % this.options.config.skip === 0) new_data.push(row)
				// if (index === 0 || timestamp + (this.options.config.skip * 1000) >= this.__skiped) {

				// data has to be in ascending order
				if (index === 0 || timestamp >= (this.options.config.skip * 1000) + this.__skiped) {
					debug('NOT SKIPED %s %s %d', this.options.id, timestamp, this.options.config.skip)
					new_data.push(row)
					this.__skiped = timestamp
				} else {
					debug('SKIPED %s %s %d', this.options.id, new Date(timestamp), this.options.config.skip)
				}
			}.bind(this))

			this.tabular.data = new_data
			// this.tabular.data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
		}

		/**
			* @config: this should be config options
			* this.focus
			* this.visible
			*/

		// if(this.visible === true){
		debug('update_chart_dataset inmediate %s %o %o', this.options.id, inmediate, this.visible, this.options.always_update)

		if (
			this.options.always_update === true ||
			(inmediate && inmediate === true) ||
				(
					(this.focus === true && this.visible === true) &&
					(
						!this.options.config.interval ||
						// (Date.now() - ((this.options.config.interval * 1000) - 200) >= this.tabular.lastupdate) ||
						(Date.now() - (this.options.config.interval * 500) >= this.tabular.lastupdate) ||
						this.tabular.lastupdate === 0
					)
				)

		) {
			/**
			* used to be in components/chart
			* @todo : reimplement all logic that was defined about 'match' & 'watch' etc...
			**/
			let update_data = []

			// remove timestamp
			Array.each(this.tabular.data, function (row) {
				update_data.push(row[1])
			})

			// if (this.options.config.watch && this.options.config.watch.transform) {
			//   debug('updating %s - always %o - inmediate %o - focus %o - visible %o - interval %o - data %o',
			//     this.options.id,
			//     this.options.always_update,
			//     inmediate,
			//     this.focus,
			//     this.visible,
			//     this.options.config.interval,
			//     this.tabular.data,
			//     this.options.config
			//   )
			//
			//   // update_data = this.options.config.watch.transform(this.tabular.data, this, this.options.config)
			//   update_data = this.options.config.watch.transform(update_data, this, this.options.config)
			// }
			// else {
			//   // update_data = Array.clone(this.tabular.data)
			//   update_data = this.tabular.data
			// }

			debug('update_chart_dataset UPDATE DATA', this.options.id, name, window.charts[name])

			if (window.charts[name]) {
				let clear_data = true

				if (window.charts[name] && typeof window.charts[name].update === 'function' && update_data.length > 0) {
					if (inmediate === true) {
						clear_data = window.charts[name].update(update_data)
					} else {
						// frameDebounce(window.charts[name].update(update_data))
						debounce(window.charts[name].update(update_data))
					}
				} else if (this.reactive === true) {
					if (inmediate === true) {
						this.$set(this, 'tabular', update_data)
					} else {
						// frameDebounce(this.$set(this, 'tabular', update_data))
						debounce(this.$set(this, 'tabular', update_data))
					}
				}
				// debug('graph update_chart_dataset updating %s %o %d %d', name, this.$refs, this.tabular.data.length, this.tabular.data.length)

				if (clear_data === true) { this.tabular.data = [] }

				if (inmediate === true) {
					this.tabular.lastupdate = 0
				} else {
					this.tabular.lastupdate = Date.now()
				}
			} else {
				debug('no element', this.options.id, update_data)
			}

			// //console.log('graph.vue update', this.options.id, this.options.config.interval, new Date(this.tabular.lastupdate), inmediate)
		}

		// }
	},
	/**
	* UI related
	**/
	visibilityChanged (isVisible, event) {
		debug('visibilityChanged', this.options.id, isVisible)

		if (window.charts[this.options.id]) {
			debug('visibilityChanged', this.options.id, isVisible, this.visible, JSON.parse(JSON.stringify(this.tabular.data)))

			/**
			* update with current data is visibility changed from "unvisible" to visible
			**/
			let __visible = this.visible
			this.visible = isVisible
			let data = JSON.parse(JSON.stringify(this.tabular.data))

			debug('visibilityChanged', this.options.id, __visible, isVisible, data)
			if (
				(!__visible || __visible === false) &&
				isVisible === true &&
				data.length > 0
			) {
				// this.options.buffer === false &&
				// (this.options.dataset.numeric === false || (this.options.dataset.numeric === true && data[0][0]))
				this.update_chart_dataset(this.options.id, data, true)
			}
		}
	}
})
// </script>
//
// <style scoped>
// #reset-this-parent {
//   all: initial;
//   * {
//     all: unset;
//   }
// }
// </style>
