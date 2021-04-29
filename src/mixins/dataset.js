'use strict'
const Moo = require('mootools')

import * as Debug from 'debug'
const debug = Debug('mixins:dataset')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { v4 as uuidv4 } from 'uuid'

export default new Class({
  Implements: [Options],

  // components: {
  // },

  // _dataset_mixin_defaults: {
	//
  // },
	__dataset_unwatcher: undefined,
	__buffer_data: [], // array to save individual datasets until we fill in with ranges
	dataset_data: [],

  options: {
    dataset: {
			// range: [],
			length: undefined,
			// interval: 1, // in seconds
			// merged: false,
			data: [],
			numeric: true,
			// sources: undefined
		},
    /**
    * if you send the complete data set on each update, set this to true,
    * else it appends data to a buffer
    **/
    buffer: true
  },

  dataset_lastupdate: 0,

	initialize: function(options){
		debug('initialize', options)
		this.setOptions(options)
		// debug('create', this.options.id)
    // if (!this['charts'][this.options.id]) {
    //   this['charts'][this.options.id] = {}
    // }
		//
    // this['charts'][this.options.id] = Object.merge(this['charts'][this.options.id], Object.clone(this._dataset_mixin_defaults))
		//
    // debug('dataset.vue data', this.options.id, this.options.dataset.data, this.options.dataset.range, this.options.dataset.length)
		//
    // this.__dataset_unwatcher = this.$watch('dataset.data', this.update_dataset_data.bind(this)) // { deep: true }
    this.update_dataset_data(this.options.dataset.data)
	},


  // beforeDestroy () {
	//
  // },
  // destroyed () {
  //   if (this['charts'][this.options.id]) {
  //     // this['charts'][this.options.id] = Object.merge(this['charts'][this.options.id], Object.clone(this._graph_mixin_defaults))
  //     delete this['charts'][this.options.id]
  //   }
  //   this.$off()
  // },
	//vue methods
	update_dataset_data: function (val, old) {
		debug('update_dataset_data %s', this.options.id, val)

		if (val && val !== undefined) {
			try {
				val = JSON.parse(JSON.stringify(val))
				if (val && val.length > 0) { this.__add_datasets(val) }
			} catch (e) {}
		}
	},
	__add_datasets: function (dataset) {
		debug('__add_datasets', this.options.id, dataset, this['charts'])

		let data = []
		if (this.type === 'tabular') {
			if (Array.isArray(dataset[0])) { // array of array, range data
				// let result = []
				Array.each(dataset, function (value) {
					data.push({
						timestamp: value[0],
						value: value
					})
				})

			} else {
				data = [{
					timestamp: Date.now(),
					value: dataset
				}]
			}
		} else { // not tabular data -> check this
			data = [{
				timestamp: Date.now(),
				value: dataset
			}]
		}

		this.__set_dataset_data(data)
	},
	__set_dataset_data: function (data) {
		debug('__set_dataset_data %s %o', this.options.id, data)

		/**
		* @config: this should be config options
		* this.focus
		* this.visible
		*/

		if (this.options.buffer === true) {
			if (!Array.isArray(data)) data = [data]

			// this.__range_init = true

			this.__buffer_data = this.__buffer_data.append(JSON.parse(JSON.stringify(data)))

			debug('buffer === true', this.__buffer_data, this.dataset_data)

			// Array.each(Array.clone(this.__buffer_data), function (val) {
			Array.each(this.__buffer_data, function (val) {
				let found = false
				Array.each(this.dataset_data, function (dataset) {
					if (dataset.timestamp === val.timestamp) { found = true }
				})

				if (found === false) { this.dataset_data.push(val) }
			}.bind(this))

			// this.dataset_data.sort(function (a, b) {
			//   return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)
			// })

			this.__buffer_data = []
			// }
		} else { // no_buffer
			this.dataset_data = data
			// this.__range_init = true
		}

		// if (this.__buffer_data.length > 10) { this.__range_init = true }
		debug('__set_dataset_data2', this.options.id, this.dataset_data)

		// if (this.__range_init === true) {
		// if you are not using buffer, you are managing your data, you are in charge of sorting
		if (this.options.buffer === true) {
			this.dataset_data.sort(function (a, b) {
				return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0)
			})

			debug('__set_dataset_data3', this.options.id, JSON.parse(JSON.stringify(this.dataset_data))) //

			// let length = this.dataset_data.length
			let slice = (!this.config.interval || this.config.interval === undefined)
				? (!this.options.dataset.length || this.options.dataset.length === undefined)
					? data.length
					: this.options.dataset.length
				: (!this.options.dataset.length || this.options.dataset.length === undefined)
					? data.length * this.config.interval
					: this.options.dataset.length * this.config.interval

			if (!isNaN(slice)) { this.dataset_data = this.dataset_data.slice(0, slice) }

			debug('__set_dataset_data4', this.options.id, JSON.parse(JSON.stringify(this.dataset_data)), slice) //

			this.dataset_data.sort(function (a, b) {
				return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)
			})
		}

		this.options.dataset_lastupdate = Date.now()

		this.__update_data(this.dataset_data)
		// }
	}
})
