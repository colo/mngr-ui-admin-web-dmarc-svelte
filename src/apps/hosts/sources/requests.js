import * as Debug from 'debug'
const debug = Debug('apps:hosts:periodical:requests')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'

let init = false

// let _top_domains = []
// let top_domains = {}

// import hosts_periodical_callback from '@apps/hosts/libs/periodical'
import hosts_info_callback from '@apps/hosts/libs/info'

// import os_callback from '@apps/system/libs/periodical'
//
// import web_callback from '@apps/logs/web/libs/periodical'

const generic_callback = function (data, metadata, key, vm) {
  // debug('PERIODICAL GENERIC CALLBACK data %s %o', key, data, metadata)

  if (key === 'hosts.periodical') {
    // hosts_periodical_callback(data, metadata, key, vm)
		vm.setHostsData(data.hosts)
  } else if (key === 'hosts.info') {
    hosts_info_callback(data, metadata, key, vm)
  } else if (key === 'hosts.first') {
    debug('GENERIC CALLBACK data FIRST %s %o', key, data, metadata)
    // hosts_info_callback(data, metadata, key, vm)
    // if (data.hosts[0].metadata.timestamp * 1 !== vm.datePickerMinDate * 1) { vm.datePickerMinDate = data.hosts[0].metadata.timestamp }
    vm.setDatePickerMinDate( data.hosts[0].metadata.timestamp )
  } else if (key === 'hosts.report') {
    debug('GENERIC CALLBACK data REPORT %s %o', key, data, metadata)
    // hosts_info_callback(data, metadata, key, vm)
    // if (data.hosts[0].metadata.timestamp * 1 !== vm.datePickerMinDate * 1) { vm.datePickerMinDate = data.hosts[0].metadata.timestamp }
    vm.setReportDoc( data.hosts[0] )
  } else if (key === 'hosts.info') {
    debug('GENERIC CALLBACK HOSTS INFO %s %o', key, data, metadata)
    // hosts_info_callback(data, metadata, key, vm)
    // if (data.hosts[0].metadata.timestamp * 1 !== vm.datePickerMinDate * 1) { vm.datePickerMinDate = data.hosts[0].metadata.timestamp }
    vm.setServers ( data.hosts )
  }
  /**
	* graphql
	*
	if (key === 'hosts.periodical') { hosts_periodical_callback(data.hosts, metadata, key, vm) }
	**/

  //
  // if (key === 'os.periodical') { os_callback(data, metadata, key, vm) }
  //
  // if (key === 'logs.periodical') { web_callback(data, metadata, key, vm) }
}

// const hosts_info = {
//   params: function (_key, vm) {
//     debug('PERIODICAL hosts_info %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.info', 'config.range', 'minute.range']
//       key = ['hosts.info'] //, 'minute.range'
//     }
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'hosts.info':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             // range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
//             query: {
//               'from': 'hosts',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 {'data': ['networkInterfaces']},
//                 {'metadata': ['host']}
//               ],
//               // 'transformation': [
//               //   {
//               //     'orderBy': { 'index': 'r.desc(timestamp)' }
//               //   }
//               // ],
//               // 'filter': filter
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('hosts_info ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }
//
// const hosts_info = {
//   params: function (_key, vm) {
//     debug('PERIODICAL hosts_info %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.info', 'config.range', 'minute.range']
//       key = ['hosts.info'] //, 'minute.range'
//     }
//
//     // let filter = [
//     //   // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
//     // ]
//     //
//     // if (vm.filters && Object.getLength(vm.filters) > 0) {
//     //   Object.each(vm.filters, function (data, prop) {
//     //     if (!Array.isArray(data)) data = []
//     //
//     //     let _filter
//     //     Array.each(data, function (value) {
//     //       if (_filter === undefined) {
//     //         _filter = "this.r.row('metadata')('" + prop + "').eq('" + value + "')"
//     //       } else {
//     //         _filter += ".or(this.r.row('metadata')('" + prop + "').eq('" + value + "')"
//     //       }
//     //     })
//     //
//     //     if (data.length > 1) { // close each 'or'
//     //       Array.each(data, function (value, index) {
//     //         if (index < data.length - 1) { _filter += ')' }
//     //       })
//     //     }
//     //     filter.push(_filter)
//     //   })
//     // }
//
//     // debug('hosts_info FILTER ', filter)
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'hosts.info':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
// 						range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
//             query: {
//               'from': 'hosts',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 // 'data',
//                 'metadata'
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               // 'filter': filter
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('hosts_info ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }
//
// const hosts_first = {
//   params: function (_key, vm) {
//     debug('PERIODICAL hosts_first %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.first', 'config.range', 'minute.range']
//       key = ['hosts.first'] //, 'minute.range'
//     }
//
//     let filter = [
//       // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
//     ]
//
// 		if (vm && vm.getFilters && typeOf(vm.getFilters) === 'function' && Object.getLength(vm.getFilters()) > 0) {
//       Object.each(vm.getFilters(), function (data, prop) {
// 				debug('PERIODICAL hosts_periodical FILTER %s %o', prop, data)
//         if (!Array.isArray(data)) data = []
//
//         let _filter
//         Array.each(data, function (value) {
//           if (_filter === undefined) {
//             _filter = "this.r.row('metadata')('" + prop + "').eq('" + value + "')"
//           } else {
//             _filter += ".or(this.r.row('metadata')('" + prop + "').eq('" + value + "')"
//           }
//         })
//
//         if (data.length > 1) { // close each 'or'
//           Array.each(data, function (value, index) {
//             if (index < data.length - 1) { _filter += ')' }
//           })
//         }
// 				if(_filter !== undefined)
//         	filter.push(_filter)
//       })
//     }
//
//     debug('hosts_first FILTER ', filter)
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'hosts.first':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
//             query: {
//               'from': 'hosts',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 {'metadata': ['timestamp']}
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.asc(timestamp)' },
//                 },
//                 {
//                   limit: 1
//                 }
//               ],
//               'filter': filter
//
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('hosts_first ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const hosts_periodical = {
  params: function (_key, vm) {
    debug('PERIODICAL hosts_periodical %o %o', _key, (vm.getFilters) ? typeOf(vm.getFilters) : undefined)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.periodical', 'config.range', 'minute.range']
      key = ['hosts.periodical'] //, 'minute.range'
    }

    let filter = [
      // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
    ]

    if (vm && vm.getFilters && typeOf(vm.getFilters) === 'function' && Object.getLength(vm.getFilters()) > 0) {
      Object.each(vm.getFilters(), function (data, prop) {
				debug('PERIODICAL hosts_periodical FILTER %s %o', prop, data)
        if (!Array.isArray(data)) data = []

        let _filter
        Array.each(data, function (value) {
          if (_filter === undefined) {
            _filter = "this.r.row('metadata')('" + prop + "').eq('" + value + "')"
          } else {
            _filter += ".or(this.r.row('metadata')('" + prop + "').eq('" + value + "')"
          }
        })

        if (data.length > 1) { // close each 'or'
          Array.each(data, function (value, index) {
            if (index < data.length - 1) { _filter += ')' }
          })
        }
				if(_filter !== undefined)
        	filter.push(_filter)
      })
    }

    debug('hosts_periodical FILTER ', filter)

    if (
      _key
    ) {
			debug('hosts_periodical RANGE ', vm.start() + '-' + vm.end())

      switch (_key) {
        case 'hosts.periodical':
          source = [{
            params: { id: _key },
            // path: 'all',
						// range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
            query: {
              'from': 'hosts',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                'metadata'
              ],
							'transformation': [
                {
                  'orderBy': { 'index': 'r.asc(host)' }
                }
              ],
              'filter': filter

            }
          }]
          break
      }
    }

    // debug('hosts_periodical ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

// const hosts_report = {
//   params: function (_key, vm) {
//     debug('PERIODICAL hosts_report %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.report', 'config.range', 'minute.range']
//       key = ['hosts.report'] //, 'minute.range'
//     }
//
//     if (
//       _key && vm.getReportID() && vm.getReportID() !== undefined
//     ) {
//       let filter = []
//
//       filter.push("this.r.row('metadata')('id').eq('" + vm.getReportID() + "')")
//
//       debug('hosts_report FILTER ', filter)
//
//       switch (_key) {
//         case 'hosts.report':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             query: {
//               'from': 'hosts',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 'data',
//                 'metadata'
//               ],
//               'filter': filter
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('hosts_report ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const once = [
	// hosts_info,
  // hosts_first,
  hosts_periodical,
	// hosts_report,
	// hosts_info
]

const periodical = [
	// hosts_info,
  // hosts_info,
  // hosts_first,
  hosts_periodical,
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
