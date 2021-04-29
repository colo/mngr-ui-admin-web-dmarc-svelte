 <div
	id="{id}"
	class="{config.class}"
	style="{config.style}"
 >
</div>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:frappeCharts')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

import chartWrapperMixin from '@mixins/chartWrapper'

// import netDataColors from '@libs/netdata/colors'

// import dbColors from '@dashblocks/src/components/dbcolors'

import { v4 as uuidv4 } from 'uuid'

export let id = uuidv4()
export let options = {}
export let config = {}
export let datasets = []

import { onMount } from 'svelte'

let old_options = {}
let old_config = {}

let chart = undefined

$: if(chart !== undefined && JSON.stringify(options) !== JSON.stringify(old_options)){
	let old = chart.get_data()

	debug('changed options', id, options, old_options)

	chart = new frappeCharts({
		id,
		options,
		config,
		datasets
	})
	window.charts[id] = chart
	if(old.length > 0)
		chart.update(old)

	old_options = options
}

$: if(chart !== undefined && JSON.stringify(config) !== JSON.stringify(old_config)){
	let old = chart.get_data()

	debug('changed config', id, config, old_config)

	chart = new frappeCharts({
		id,
		options,
		config,
		datasets
	})
	window.charts[id] = chart
	if(old.length > 0)
		chart.update(old)

	old_config = config
}


let frappeCharts = new Class({
	// Implements: [Options],
  Extends: chartWrapperMixin,

  name: 'frappe-charts-wrapper',

  // _frappe_charts_wrapper_defaults: {
  // },

	graph: undefined,
	buffer: [],

  // watch: {
  //   // visible: function (val) {
  //   //   this.container_class_helper = (val === false) ? 'invisible' : ''
  //   //   // console.log('class visible', val, this.container_class_helper)
  //   // },
  //   // datasets: function (val) {
  //   //   this.update(val)
  //   // },
  //   options: function (val) {
  //     debug('watch options', this.options.id, val)
  //     this.graph = undefined
  //     this.create()
  //   },
  //   // config: function (val) {
  //   //   debug('watch config', this.options.id, val)
  //   //   this.graph = undefined
  //   //   this.create()
  //   // },
  // },

  initialize: function(options) {
		debug('initialize', options)
		this.parent(options)
  },
  // vue methods
	create: function () {
		this.parent()
		if (document.getElementById(this.options.id)) {
			debug('create', this.options, document.getElementById(this.options.id), this.options.data)
			// this.graph = new Chart(
			//   document.getElementById(this.options.id), // containing div
			//   this.options
			// )
			let data = (this.options && this.options.options && this.options.options.data)
				? this.__handle_data(this.get_data(this.options.options.data.datasets))
				: (this.options.datasets)
					? this.options.datasets
					: {}

			debug('creating...', data)
			// this.options.data = data
			let options = Object.merge(Object.clone(this.options.config.options), Object.clone(this.options.options), {data: data})

			debug('creating...', this.options.id, options)
			if (data && data.datasets && data.datasets.length > 0) {
				this.graph = new Chart(
					document.getElementById(this.options.id), // containing div
					options
				)

				if (this.options.config && this.options.config.init) { this.options.config.init(this, this.graph, this.options.id, options.data, 'frappe') }
			}
		}
	},

	update: function (data) {
		debug('update', this.options.id, data, this.buffer, this.datasets, this.graph)


		data = this.get_data(data)
		let last = data.getLast()
		if (last.labels && this.graph) {
			debug('updating LAST', this.options.id, this.__handle_data(last))
			this.graph.update(this.__handle_data(last))
		} else if (this.graph) {
			debug('updating', this.options.id, this.__handle_data(data))
			this.graph.update(this.__handle_data(data))
		}
		// this.__handle_data(this.get_data(data).getLast())
		// if (data && data.datasets && data.datasets.length > 0) {
		//   this.buffer = Array.clone(data.datasets)
		// } else if (data && Array.isArray(data)) {
		this.buffer = Array.clone(data)
		// }
		if (!this.graph || this.graph === undefined) {
			this.create()
		}


		// this.graph.draw()
	},
	// get_data: function (data) {
	// 	debug('get_data', data, this.datasets, this.buffer)
	// 	data = (data && data.length > 0) ? data : (this.datasets && this.datasets.length > 0) ? this.datasets : this.buffer
	// 	data = JSON.parse(JSON.stringify(data))
	// 	debug('get_data return', data)
	// 	return data
	// },
	__handle_data: function (value) {
		debug('__handle_data', this.options.id, value)
		let data = {labels: [], datasets: []}
		if (value && Array.isArray(value) && value.length === 1 && value[0].labels && value[0].datasets) { value = value[0] }

		if (value && value.labels && value.datasets) {
			data = value
		} else if (this.options.options && this.options.options.data && this.options.options.data.labels) {
			data.labels = this.options.options.data.labels
			if (Array.isArray(value)) {
				if (value[0] && Array.isArray(value[0])) {
					data.datasets = []
					Array.each(value, function (_val) {
						data.datasets.push({ values: _val })
					})
				} else {
					data.datasets = [{ values: value }]
				}
			} else {
				data.datasets = value
			}
			// if (value.values && value.values !== undefined) {
			//   debug('__handle_data', value, value.values)
			//   data.datasets = value
			// } else {
			//   data.datasets = [{ values: value }]
			// }
		}
		debug('__handle_data return', data)
		return data
	}
})

onMount(() => {
	if(chart === undefined){
		chart = new frappeCharts({
			id,
			options,
			config,
			datasets
		})
		window.charts[id] = chart
	}

})
</script>
