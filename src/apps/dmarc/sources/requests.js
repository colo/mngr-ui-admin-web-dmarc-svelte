import * as Debug from 'debug'
const debug = Debug('apps:dmarc:periodical:requests')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'

let init = false

// let _top_domains = []
// let top_domains = {}

import dmarc_periodical_callback from '@apps/dmarc/libs/periodical'
import dmarc_info_callback from '@apps/dmarc/libs/info'

// import os_callback from '@apps/system/libs/periodical'
//
// import web_callback from '@apps/logs/web/libs/periodical'

const generic_callback = function (data, metadata, key, vm) {
  // debug('PERIODICAL GENERIC CALLBACK data %s %o', key, data, metadata)

  if (key === 'dmarc.periodical') {
    dmarc_periodical_callback(data, metadata, key, vm)
  } else if (key === 'dmarc.info') {
    dmarc_info_callback(data, metadata, key, vm)
  } else if (key === 'dmarc.first') {
    debug('GENERIC CALLBACK data FIRST %s %o', key, data, metadata)
    // dmarc_info_callback(data, metadata, key, vm)
    // if (data.dmarc[0].metadata.timestamp * 1 !== vm.datePickerMinDate * 1) { vm.datePickerMinDate = data.dmarc[0].metadata.timestamp }
    vm.setDatePickerMinDate( data.dmarc[0].metadata.timestamp )
  }
  /**
	* graphql
	*
	if (key === 'dmarc.periodical') { dmarc_periodical_callback(data.dmarc, metadata, key, vm) }
	**/

  //
  // if (key === 'os.periodical') { os_callback(data, metadata, key, vm) }
  //
  // if (key === 'logs.periodical') { web_callback(data, metadata, key, vm) }
}

const dmarc_info = {
  params: function (_key, vm) {
    debug('PERIODICAL dmarc_info %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.info', 'config.range', 'minute.range']
      key = ['dmarc.info'] //, 'minute.range'
    }

    // let filter = [
    //   // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
    // ]
    //
    // if (vm.filters && Object.getLength(vm.filters) > 0) {
    //   Object.each(vm.filters, function (data, prop) {
    //     if (!Array.isArray(data)) data = []
    //
    //     let _filter
    //     Array.each(data, function (value) {
    //       if (_filter === undefined) {
    //         _filter = "this.r.row('metadata')('" + prop + "').eq('" + value + "')"
    //       } else {
    //         _filter += ".or(this.r.row('metadata')('" + prop + "').eq('" + value + "')"
    //       }
    //     })
    //
    //     if (data.length > 1) { // close each 'or'
    //       Array.each(data, function (value, index) {
    //         if (index < data.length - 1) { _filter += ')' }
    //       })
    //     }
    //     filter.push(_filter)
    //   })
    // }

    // debug('dmarc_info FILTER ', filter)

    if (
      _key
    ) {
      switch (_key) {
        case 'dmarc.info':
          source = [{
            params: { id: _key },
            // path: 'all',
            // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
						range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
            query: {
              'from': 'dmarc',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                // 'data',
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              // 'filter': filter
            }
          }]
          break
      }
    }

    // debug('dmarc_info ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const dmarc_first = {
  params: function (_key, vm) {
    debug('PERIODICAL dmarc_first %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.first', 'config.range', 'minute.range']
      key = ['dmarc.first'] //, 'minute.range'
    }

    let filter = [
      // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
    ]

		if (vm && vm.getFilters && typeOf(vm.getFilters) === 'function' && Object.getLength(vm.getFilters()) > 0) {
      Object.each(vm.getFilters(), function (data, prop) {
				debug('PERIODICAL dmarc_periodical FILTER %s %o', prop, data)
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

    debug('dmarc_first FILTER ', filter)

    if (
      _key
    ) {
      switch (_key) {
        case 'dmarc.first':
          source = [{
            params: { id: _key },
            // path: 'all',
            // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
            query: {
              'from': 'dmarc',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                {'metadata': ['timestamp']}
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.asc(timestamp)' },
                },
                {
                  limit: 1
                }
              ],
              'filter': filter

            }
          }]
          break
      }
    }

    // debug('dmarc_first ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const dmarc_periodical = {
  params: function (_key, vm) {
    debug('PERIODICAL dmarc_periodical %o %o', _key, (vm.getFilters) ? typeOf(vm.getFilters) : undefined)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.periodical', 'config.range', 'minute.range']
      key = ['dmarc.periodical'] //, 'minute.range'
    }

    let filter = [
      // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
    ]

    if (vm && vm.getFilters && typeOf(vm.getFilters) === 'function' && Object.getLength(vm.getFilters()) > 0) {
      Object.each(vm.getFilters(), function (data, prop) {
				debug('PERIODICAL dmarc_periodical FILTER %s %o', prop, data)
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

    debug('dmarc_periodical FILTER ', filter)

    if (
      _key
    ) {
			debug('dmarc_periodical RANGE ', vm.start() + '-' + vm.end())

      switch (_key) {
        case 'dmarc.periodical':
          source = [{
            params: { id: _key },
            // path: 'all',
            // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
						range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
            query: {
              'from': 'dmarc',
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
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': filter

              // query: `{
              //     dmarc (limit: 0) {
              //         data {
              //           report {
              // 						email,
              // 						id,
              // 						org,
              // 						range {start, end}
              // 					},
              // 					policy {
              // 						aspf,
              // 					  domain,
              // 					  fo,
              // 					  p,
              // 					  pct,
              // 					  sp
              // 					},
              // 					records
              //         }
              //         metadata {
              // 					domain,
              // 				  host,
              // 				  id,
              // 				  path,
              // 				  timestamp,
              // 				  type,
              // 				  tag,
              // 				  range {start,end}
              // 				}
              //
              //     }
              //
              //
              // }`

            }
          }]
          break
      }
    }

    // debug('dmarc_periodical ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

// const dmarc_summary_periodical = {
//   params: function (_key, vm) {
//     // debug('PERIODICAL dmarc_summary_periodical %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.periodical', 'config.range', 'minute.range']
//       key = ['os.periodical', 'logs.periodical'] //, 'minute.range'
//     }
//
//     let filter = [
//       // "this.r.row('metadata')('path').eq('os.memory').or(this.r.row('metadata')('path').eq('os.cpus'))"
//     ]
//
//     if (vm.selected_dmarc && vm.selected_dmarc.length > 0) {
//       let dmarc_filter
//       Array.each(vm.selected_dmarc, function (host) {
//         if (dmarc_filter === undefined) {
//           dmarc_filter = "this.r.row('metadata')('host').eq('" + host + "')"
//         } else {
//           dmarc_filter += ".or(this.r.row('metadata')('host').eq('" + host + "')"
//         }
//       })
//
//       if (vm.selected_dmarc.length > 1) { // close each 'or'
//         Array.each(vm.selected_dmarc, function (host, index) {
//           if (index < vm.selected_dmarc.length - 1) { dmarc_filter += ')' }
//         })
//       }
//       filter.push(dmarc_filter)
//     }
//
//     debug('dmarc_summary_periodical FILTER ', filter)
//
//     let os_filter = Array.clone(filter)
//     let logs_filter = Array.clone(filter)
//     logs_filter.push({ 'metadata': { 'path': 'logs.nginx' } })
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'os.periodical':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             // range: 'posix ' + roundMilliseconds(Date.now() - (6 * SECOND)) + '-' + roundMilliseconds(Date.now() - SECOND) + '/*',
//             range: 'posix ' + vm.round(vm.end() - vm.refresh) + '-' + vm.round(vm.end()) + '/*',
//             query: {
//               'from': 'os',
//               // 'register': 'changes',
//               // 'format': 'stat',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 // {
//                 //   'metadata': [
//                 //     'timestamp',
//                 //     'path'
//                 //   ]
//                 // },
//                 // 'metadata',
//                 'data',
//                 {'metadata': ['host', 'timestamp', 'path']}
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': os_filter
//
//             }
//           }]
//           break
//
//         case 'logs.periodical':
//           source = [{
//             params: { id: _key },
//             path: 'all',
//             // range: 'posix ' + roundMilliseconds(Date.now() - (6 * SECOND)) + '-' + roundMilliseconds(Date.now() - SECOND) + '/*',
//             range: 'posix ' + vm.round(vm.end() - vm.refresh) + '-' + vm.round(vm.end()) + '/*',
//             query: {
//               'from': 'logs',
//               // 'register': 'changes',
//               // 'format': 'stat',
//               'index': false,
//               /**
//                 * right now needed to match OUTPUT 'id' with this query (need to @fix)
//                 **/
//               'q': [
//                 // {
//                 //   'metadata': [
//                 //     'timestamp',
//                 //     'path'
//                 //   ]
//                 // },
//                 // 'metadata',
//                 'data',
//                 {'metadata': ['host', 'timestamp', 'path', 'domain']}
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': logs_filter
//
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('MyChart periodical KEY ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const once = [
	dmarc_info,
  dmarc_first,
  dmarc_periodical,
]

const periodical = [
  // dmarc_info,
  // dmarc_periodical,
  // dmarc_summary_periodical
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
