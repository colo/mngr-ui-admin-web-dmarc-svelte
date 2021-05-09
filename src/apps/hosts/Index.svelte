<div class="container mx-auto py-6 px-4">
	<div class="card shadow-lg">
		<div class="card-body">
			<DataTable id="hostsTable" options="{hostsTableOptions}" dataSet="{hostsTableData}" />
		</div>
	</div>
</div>

<script>
import * as Debug from 'debug'
const debug = Debug('App')
debug.log = console.log.bind(console) // don't forget to bind to console!

import dashboard from '@mixins/dashboard.js'
import JSPipeline from '../../../modules/js-pipeline'
import Pipeline from '@libs/pipelines'
import InputIO from '@libs/pipelines/input/io'
// import InputIO from '@libs/pipelines/input/graphql.io'
import IO from '@libs/pipelines/default.io'
// import IO from '@libs/pipelines/default.graphql.io'
import DocIDFilter from '@libs/pipelines/filters/doc_id'
import OutputEventbus from '@libs/pipelines/output/eventbus'

import { global as EventBus } from '@libs/eventbus'

import { requests, store } from './sources/index'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'
import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'

import {router} from '@spaceavocado/svelte-router'

import DataTable from '@components/dataTable'
import jquery from 'jquery'

let setHosts = function () {
	debug('setHosts', $router.currentRoute.query.host)
  let query_host = ($router.currentRoute.query.host) ? JSON.parse(JSON.stringify($router.currentRoute.query.host)) : ''
  // let filter_host = JSON.parse(JSON.stringify(filters.host))
	let filter_host = Object.keys(Object.filter(filters.host, function(value, key){
    return value === true;
	}))

	debug('filters.host setHosts',
    filter_host,
    query_host,
    (!Array.isArray(query_host)),
    (Array.isArray(query_host) && (query_host.every(function (item) { return filter_host.contains(item) }) !== true || filter_host.every(function (item) { return query_host.contains(item) }) !== true))
  )
  if (
    !query_host ||
		(!Array.isArray(query_host) && (filter_host.length > 1 || !filter_host.contains(query_host))) === true ||
		(Array.isArray(query_host) &&
		(query_host.every(function (item) { return filter_host.contains(item) }) !== true || filter_host.every(function (item) { return query_host.contains(item) }) !== true))
  ) {
    $router.replace({ query: { ...$router.currentRoute.query, host: filter_host}}) //.catch(err => { debug('setHosts', err) })
    ds.pipelines[ds.id].fireEvent('onOnce')
    // ds.destroy_pipelines()
    // ds.create_pipelines()
  }

  // this.filters_debounce.host.ts = Date.now()
  if (filters_debounce.host !== undefined) {
    clearTimeout(filters_debounce.host)
    filters_debounce.host = undefined
    // this.filters_debounce.host.ts = 0
  }
}
let setDomains = function () {
	debug('setDomains', $router.currentRoute.query.domain)
  let query_domain = ($router.currentRoute.query.domain) ? JSON.parse(JSON.stringify($router.currentRoute.query.domain)) : ''
  // let filter_domain = JSON.parse(JSON.stringify(filters.domain))
	let filter_domain = Object.keys(Object.filter(filters.domain, function(value, key){
    return value === true;
	}))

	debug('filters.domain setDomains',
    filter_domain,
    query_domain,
    (!Array.isArray(query_domain)),
    (Array.isArray(query_domain) && (query_domain.every(function (item) { return filter_domain.contains(item) }) !== true || filter_domain.every(function (item) { return query_domain.contains(item) }) !== true))
  )
  if (
    !query_domain ||
		(!Array.isArray(query_domain) && (filter_domain.length > 1 || !filter_domain.contains(query_domain))) === true ||
		(Array.isArray(query_domain) &&
		(query_domain.every(function (item) { return filter_domain.contains(item) }) !== true || filter_domain.every(function (item) { return query_domain.contains(item) }) !== true))
  ) {
    $router.replace({ query: { ...$router.currentRoute.query, domain: filter_domain}}) //.catch(err => { debug('setDomains', err) })
    ds.pipelines[ds.id].fireEvent('onOnce')
    // ds.destroy_pipelines()
    // ds.create_pipelines()
  }

  // this.filters_debounce.domain.ts = Date.now()
  if (filters_debounce.domain !== undefined) {
    clearTimeout(filters_debounce.domain)
    filters_debounce.domain = undefined
    // this.filters_debounce.domain.ts = 0
  }
}

// let formatMinStats = function (val) {
//   if (val > 1000) {
//     val = '+' + Math.round(val / 1000) + 'K'
//   } else if (val > 1000000) {
//     val = '+' + Math.round(val / 1000000) + 'M'
//   }
//   return val
// }


let filters_debounce = {
	domain: undefined,
	host: undefined,
}
let filters = {
	domain: {},
	host: {}
}

let old_filters = {
	domain: {},
	host: {}
}

let hosts = []
let domains = []

$: if(filters.host && JSON.stringify(filters.host) !== JSON.stringify(old_filters.host)) {// && old_filters.host
	// let _hosts = [...filters.host]
	debug('filters.host', filters.host,  JSON.stringify(filters.host), JSON.stringify(old_filters.host))
	if (filters_debounce.host !== undefined) clearTimeout(filters_debounce.host)
	filters_debounce.host = setTimeout(setHosts, 500)

	old_filters.host = JSON.parse(JSON.stringify(filters.host))
}

$: if(filters.domain && JSON.stringify(filters.domain) !== JSON.stringify(old_filters.domain)) {// && old_filters.domain
	// let _domains = [...filters.domain]
	debug('filters.domain', filters.domain,  JSON.stringify(filters.domain), JSON.stringify(old_filters.domain))
	if (filters_debounce.domain !== undefined) clearTimeout(filters_debounce.domain)
	filters_debounce.domain = setTimeout(setDomains, 500)

	old_filters.domain = JSON.parse(JSON.stringify(filters.domain))
}

let hosts_data = []
let hostsTableData = []
const hostsTableOptions = {
  deferRender: true,
  // stateSave: true,
  responsive: true,
  data: [],

  columns: [
    {
      title: 'Hostname',
      data: 'hostname',
      // render: function (data, type, row, meta) {
      //   // return format(data, 'E dd/MM/yyyy H:mm O')
      //   if (type === 'display') {
      //     // return `<a class="link link-primary open-item" href="javascript:void(0);" data-item-id=${row.id}>${data}</a>`
      //     return `<button class="btn btn-ghost  open-item" data-item-id=${data}>
      // 			<!-- Download SVG icon from http://tabler-icons.io/i/eye -->
      // 			<svg xmlns="http://www.w3.org/2000/svg" class="icon" data-item-id=${data} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="2" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>
      // 			${data}
      // 		</button>`
      //   } else {
      //     return data
      //   }
      // }
    },
    {
      title: '# CPUS',
      data: 'cpus',
      'width': '10%',
      render: function (data, type, row, meta) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        return data.length
      }
    },
    {
      title: 'CPUS DETAIL',
      data: 'cpus_detail',
      // render: function (data, type, row, meta) {
      //   // return format(data, 'E dd/MM/yyyy H:mm O')
      //   if (type === 'display') {
      //     // debug('table timestamp', row, meta)
      //     return format(data, 'PPPP HH:MM', {locale: es})
      //   } else {
      //     return data
      //   }
      // }
    },
    {
      title: 'Memory (GB)',
      data: 'totalmem',
      'width': '10%',
      // render: function (data, type) {
      //   // return format(data, 'E dd/MM/yyyy H:mm O')
      //   return `<div class="badge badge-success">${data}</div> `
      // }
      render: function (data, type, row, meta) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        if (type === 'display') {
          // return `<a class="link link-primary open-item" href="javascript:void(0);" data-item-id=${row.id}>${data}</a>`
          return Math.round(data / 1073741824) // GB 1073741824
        } else {
          return data
        }
      }
    },
    {
      title: 'platform',
      data: 'platform',
      'width': '10%',
      // render: function (data, type) {
      //   // return format(data, 'E dd/MM/yyyy H:mm O')
      //   return `<div class="badge badge-warning">${data}</div> `
      // }
    },
    {
      title: 'release',
      data: 'release',
      // 'width': '10%',
      // render: function (data, type) {
      //   // return format(data, 'E dd/MM/yyyy H:mm O')
      //   return `<div class="badge badge-error">${data}</div> `
      // }
    },
    {
      title: 'Arch',
      data: 'arch',
      'width': '5%',
      // render: function (data, type) {
      //   // return format(data, 'E dd/MM/yyyy H:mm O')
      //   return `<div class="badge badge-error">${data}</div> `
      // }
    },
  ],
  'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
  'columnDefs': [
    // {
    //   targets: [1, 2, 3],
    //   className: 'dt-center'
    // },
    // { 'visible': false, 'targets': 0 },
    {
      'targets': [0, 1, 2, 3, 4, 5, 6],
      // 'searchable': false,
      className: 'dt-body-center'
    }

  ],
  'order': [[ 0, 'asc' ]],
  'displayLength': 25,
  'drawCallback': function (settings) {
		let els = document.getElementsByClassName('open-item')
    debug('ELS', els)
    Array.each(els, function (el) {
      el.addEventListener('click', function (e) {
        debug('open-item', e.target.dataset.itemId)
        setReportID(e.target.dataset.itemId)
      })
    })

    let api = this.api()
    let rows = api.rows({page: 'current'}).nodes()
    let last = null

    // api.column(0, {page: 'current'}).data().each(function (group, i) {
    //   if (last !== group) {
    //     jquery(rows).eq(i).before(
    //       '<tr class="group"><td colspan="6">' + group + '</td></tr>'
    //     )
		//
    //     last = group
    //   }
    // })
  }
}

const DS = new Class({
  Extends: dashboard,

  // store: true,
  pipeline_id: ['input.hosts.periodical'],

	id: 'input.hosts.periodical',
  path: 'all',
  // refresh: SECOND,
	refresh: MINUTE,
  period: 'day',

  hosts: [],

	// flatpickr: undefined,
	//
	// report_id: undefined,
	// report: undefined,
	// servers: [],

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

	initialize: function(options){
		this.parent(options)

		let allow_filters = /(host|domain)/
    Object.each($router.currentRoute.query, function (data, prop) {
      if (allow_filters.test(prop)) {
        // let selected = data
        debug('created selected_hosts', prop, data)
        if (data) {
          // if (!Array.isArray(data)) data = [data]
					data = data.split(',')
					Array.each(data, function(value){
						filters[prop][value] = true
					})

        } else {
          filters[prop] = {}
        }
      }
    }.bind(this))

		debug('initialize DS', $router.currentRoute.query)
		// if ($router.currentRoute.query.report_id && $router.currentRoute.query.report_id !== 'undefined') { this.report_id = decodeURIComponent($router.currentRoute.query.report_id) }

		if ($router.currentRoute.query.start_time && $router.currentRoute.query.start_time !== 'undefined') { this.start_time = $router.currentRoute.query.start_time * 1 }

    if ($router.currentRoute.query.current_time && $router.currentRoute.query.current_time !== 'undefined') {
      this.current_time = $router.currentRoute.query.current_time * 1 - HOUR
    } else {
      this.current_time = Date.now()
    }

		// debug('document.getElementById(flatpickr)',document.getElementById('flatpickr'),this.start_time, this.current_time, this.start(), this.end())
		//
		// this.flatpickr = flatpickr(document.getElementById('flatpickr'), {
		// 	position: "auto right",
		// 	maxDate: 'today',
		// 	mode: 'range',
		// 	defaultDate: [roundHours(this.start()), roundHours(this.end())],
		// 	onChange: this.setDates.bind(this)
		// })
	},
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
          // id: 'input.hosts',
          id: this.id,

          clients: clients,
          // clients: new InputIO({
          //   requests: components_requests,
          //   id: this.id + 0,
          //   index: 0
          // }),

          // type: 'minute', // second || minute || hour || day || once
          requests: {
            periodical: this.refresh,
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

	getFilters: function(){
		let _filters = {}
		Object.each(filters, function(val, prop){
			_filters[prop] = Object.keys(Object.filter(filters[prop], function(value, key){
				return value === true;
			}))
		})

		debug('getFilters %o', _filters)
		return _filters
	},
	// setDatePickerMinDate: function(ts){
	// 	debug('setDatePickerMinDate', ts)
	// 	// datePickerMinDate = ts
	// 	this.flatpickr.set('minDate', ts)
	// },
	setDates: function (dates) {
		// debug('setDates', selectedDates, dateStr, instance)
		// let dates = event.detail[0]
		debug('setDates', dates)
		if (dates.length > 1 && dates[0].getTime() !== dates[1].getTime()) {
			debug('setDates both', dates)
			this.start_time = dates[0].getTime()
			this.current_time = dates[1].getTime() + DAY - MINUTE// + DAY to include full day on selected day
		} else {
			debug('setDates current', dates)
			this.current_time = dates[0].getTime() + DAY - MINUTE// + DAY to include full day on selected day
			this.start_time = undefined
		}

		if ($router.currentRoute.query.start_time !== this.start_time || $router.currentRoute.query.current_time !== this.current_time) {
			$router.replace({ query: { ...$router.currentRoute.query, start_time: this.start_time, current_time: this.current_time}}) //.catch(err => { debug('setDates', err) })
		}

		this.pipelines[this.id].fireEvent('onOnce')
	},
	setHostsData: function(h){
		debug('setHostsData %o', h)
		// if(h && h.length > 0)
		hosts_data = h

		// let data = []
		// let count_domains = {}
		// let count_hosts = {}
		// let count_disposition = {none: 0, quarantine: 0, reject: 0}
		// total_records_count = 0
		// total_ips = []
		// domainsPieLabels = []
		// total_diposition_count = 0
		//
		// Array.each(dmarc_data, function (row, index) {
		// 	let domain = row.metadata.domain
		// 	let host = row.metadata.host
		//
		// 	count_disposition.none += (row.data.records && row.data.records.none) ? row.data.records.none.length : 0
		// 	count_disposition.quarantine += (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0
		// 	count_disposition.reject += (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0
		//
		// 	Object.each(row.data.records, function (disposition) {
		// 		Array.each(disposition, function (record) {
		// 			total_records_count += record.count
		// 			total_ips.combine([ record.ip])
		// 		})
		// 	})
		//
		// 	if (!count_domains[domain]) count_domains[domain] = 0
		//
		// 	count_domains[domain]++
		// 	domainsPieLabels.combine([domain])
		//
		// 	if (host && host !== undefined && host !== null) {
		// 		if (!count_hosts[host]) count_hosts[host] = 0
		// 		count_hosts[host]++
		// 		// hostsPieLabels.combine([host])
		// 	}
		// 	//table data
		// 	let _data = Object.merge(row.metadata, {
		// 		none: (row.data.records && row.data.records.none) ? row.data.records.none.length : 0,
		// 		quarantine: (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0,
		// 		reject: (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0
		// 	})
		//
		// 	data.push(_data)
		// })
		//
		// total_ips_count = total_ips.length
		// total_diposition_count += count_disposition.none + count_disposition.quarantine + count_disposition.reject
		// total_hosts_count = Object.keys(count_hosts).length
		// total_domains_count = Object.keys(count_domains).length
		//
		// domainsPieLabels.sort()
		// // hostsPieLabels.sort()
		//
		// let domains_dataset = []
		// Array.each(domainsPieLabels, function (domain) {
		// 	domains_dataset.push(count_domains[domain])
		// })
		// // domainsPieDatasets = [{values: domains_dataset}]
		// domainsPieDatasetsTabular = domains_dataset // [{values: domains_dataset}]
		//
		// // let hosts_dataset = []
		// // Array.each(hostsPieLabels, function (host) {
		// //   // hostsPieDatasets
		// //   hosts_dataset.push(count_hosts[host])
		// // })
		//
		// hostsPieDatasets = [count_hosts]
		// dispositionDatasets = [count_disposition]
		// // hostsPieDatasets = [{values: hosts_dataset}]
		// // hostsPieDatasetsTabular = hosts_dataset // [{values: hosts_dataset}]
		//
		// debug('dmarc_data domains', domainsPieLabels, count_domains, domains_dataset, total_ips)
		//
		//
		// domainsPieWrapper = {
		// 	type: frappeChartsWrapper,
		// 	props: Object.merge({ options: Object.clone(frappePieConfig.options) }, {options: { data: { labels: domainsPieLabels } }})
		// }
		//
		// hostsPieWrapper = {
		// 	type: frappeChartsWrapper,
		// 	props: { options: Object.clone(frappePieConfig.options) }
		// }
		//
		// dispositionPieWrapper = {
		// 	type: frappeChartsWrapper,
		// 	props: { options: Object.merge(Object.clone(frappePieConfig.options), { colors: ['#31C4DD', '#FCB10E', '#FE7289'] }) }
		// }

		// debug('computed rangeReportsTableData', dmarc_data, data)
		let data = []
    Array.each(hosts_data, function (host, index) {
      let _data = host.data
      _data.cpus_detail = host.data.cpus[0].model
      data.push(_data)
    })
    debug('computed rangeReportsTableData', hosts_data, data)
    hostsTableData = data

  },
})

import { onMount } from 'svelte'
let ds

onMount(async () => {
	ds = new DS()
})
</script>
