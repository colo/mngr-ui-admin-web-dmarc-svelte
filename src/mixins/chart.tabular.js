'use strict'
const Moo = require('mootools')

import * as Debug from 'debug'
const debug = Debug('mixins:chart.tabular')
debug.log = console.log.bind(console) // don't forget to bind to console!

import graph from '@mixins/graph'

export default new Class({
	Extends: graph,

  // name: 'chartTabular',

  // charts: {},

  // _chart_tabular_component_defaults: {
	//
  // },
	type: 'tabular',

	initialize: function(options){
		debug('initialize', options)
		this.parent(options)
	},
	//vue methods
	// create () {
	// 	debug('create', this.options.id)
	// 	if (!this['charts'][this.options.id]) {
	// 		this['charts'][this.options.id] = {}
	// 	}
	//
	// 	this['charts'][this.options.id] = Object.merge(this['charts'][this.options.id], Object.clone(this._chart_tabular_component_defaults))
	// },

	__update_data: function (data) {
		debug('__update_data %s %o', this.options.id, data, this.options.dataset, this.chart_initialized)

		if (data) {
			let inmediate = false
			if (this.chart_initialized === false) {
				// this.__process_dataset(this.chart, this.options.id, val)
				this.options.config = this.__process_chart(this.options.config, this.options.id, JSON.parse(JSON.stringify(data)))
				inmediate = true
			}

			let current = []
			if (!Array.isArray(data)) data = [data]

			// debug('__update_data2 %s %o', this.options.id, data)

			Array.each(data, function (row) {
				let insert_value = []

				insert_value = [row.timestamp, row.value]

				// if you are not using buffer, you are managing your data, you are in charge of fixing values
				if (this.options.buffer === true && this.options.dataset.numeric === true) {
					// fix for incorrect values like "" (empty)
					if (Array.isArray(insert_value)) {
						Array.each(insert_value, function (value, index) {
							value = (value) ? value * 1 : 0 // int cast
							insert_value[index] = value
							// if (!value || isNaN(value)) { row.value[index] = 0 } // or should be undefined?
						})
					}
				}

				current.push(insert_value)
			}.bind(this))

			// debug('__create_watcher->generic_data_watcher',this.options.id, current, inmediate)
			debug('__update_data3 %s %o %o %o', this.options.id, data, current, this.chart_initialized, this.options.buffer, inmediate)

			this.update_chart_dataset(this.options.id, current, inmediate)
		}
	},
	__process_chart (config, name, dataset) {
		debug('__process_chart', this.options.id)
		/// /console.log('__process_chart', this.options.dataset_data, name, dataset)

		if (config.init && typeof config.init === 'function') {
			config.init(this, config, name, dataset, 'chart-tabular')
			// this.$set(this, 'chart_initialized', true)
		}
		// else {
		// this.$set(this, 'chart_initialized', true)
		this.chart_initialized = true
		// }

		// this.__create_watcher(name, config)
		return config
	}

})
