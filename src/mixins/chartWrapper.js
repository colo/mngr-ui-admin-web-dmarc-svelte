'use strict'
const Moo = require('mootools')

import * as Debug from 'debug'
const debug = Debug('mixins:chartWrapper')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { v4 as uuidv4 } from 'uuid'

export default new Class({
  Implements: [Options],

  // charts: {},

  // _chart_mixin_defaults: {
	//
  // },
	graph: undefined,
	freezed: false,

	// __unwatcher: undefined,
	visible: false,

	buffer: [],

  options: {
    /**
     * Enable dark mode
     *
     * `true,false`
     */
    dark: false,
    /**
     * Color Scheme Name
     * App may define multiple color schemes for different charts
     * and use this prop to specify which colorScheme to use
     * default: "default" - refers to default dashblocks colorScheme which is always defined
     */
    colorScheme: 'default',
    EventBus: undefined,
		id: uuidv4(),
    options: {},
    config: {},
    datasets: [],
    length: undefined,
    freezed: false,
    // visible: {
    //   type: [Boolean],
    //   default: () => (true)
    // },
  },

	initialize: function(options) {
		if(!window.charts) window.charts = {}
		
		debug('initialize', options)
		this.setOptions(options)
    this.create()
  },
  // created: function () {
  //   // if (!this.$options.charts[this.id]) { this.$options.charts[this.id] = {} }
	// 	//
  //   // this.$options.charts[this.id] = Object.merge(this.$options.charts[this.id], Object.clone(this.$options._chart_mixin_defaults))
  // },
  // updated () {
  //   this.create()
  // },
  // destroyed () {
  //   /this.$options.charts[this.id] = Object.merge(this.$options.charts[this.id], Object.clone(this.$options._chart_mixin_defaults))
  //   // this.$options['charts'][this.id].graph = undefined
  //   // this.$options['charts'][this.id].freezed = false
  //   //
  //   // this.$options['charts'][this.id].__unwatcher = undefined
  //   // this.$options['charts'][this.id].visible = false
  //   //
  //   // this.$options['charts'][this.id].buffer = []
	//
  //   this.destroy()
  //   // if(this.$options['charts'][this.id].graph && typeof this.$options['charts'][this.id].graph.destroy == 'function'){
  //   //   // //////////console.log('destroying ...', this.id)
  //   //   this.$options['charts'][this.id].graph.destroy()
  //   //
  //   // }
  //   //
  //   // this.$options['charts'][this.id].graph = undefined
  //   // this.$off()
  // },
  //vue methods
	reset: function () {
		/// /console.log('dygraph reset')
		this.destroy()
		this.create()
	},
	destroy: function () {
		// if (this.$options['charts'][this.id]) {
		// 	this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._chart_mixin_defaults))
		// }
	},
	create: function () {
		// if (!this.$options['charts'][this.id]) {
		// 	this.$options['charts'][this.id] = {}
		// }
		//
		// this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._chart_mixin_defaults))
		// // this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(this.config.options)
	},
	// get_data: function (data) {
	//   // data = data || Array.clone(this.chart_data)
	//   data = data || this.chart_data
	//   return data
	// },
	get_data: function (data) {
		debug('get_data', data, this.datasets, this.buffer)
		data = (data && data.length > 0) ? data : (this.datasets && this.datasets.length > 0) ? this.datasets : this.buffer
		data = JSON.parse(JSON.stringify(data))
		debug('get_data return', data)
		return data
	},
	update (data) {
		data = this.get_data(data)
	}
})
