import * as Debug from 'debug'
const debug = Debug('apps:dmarc:periodical:requests')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'

let init = false

// let _top_domains = []
// let top_domains = {}

// import dmarc_callback from '@apps/dmarc/libs/periodical'

// import os_callback from '@apps/system/libs/periodical'
//
// import web_callback from '@apps/logs/web/libs/periodical'
let dmarc = []

const generic_callback = function (data, metadata, key, vm) {
  debug('PERIODICAL GENERIC CALLBACK data %s %o', key, data.dmarc.dmarc, metadata, vm)
	// vm.setHosts(data.dmarc.dmarc)
	let dmarc_data = []
  if (data.dmarc.dmarc) {
    Array.each(data.dmarc.dmarc, function (row) {
      // let path = row.metadata.path
      let host = row.metadata.host

      dmarc.combine([host])
      dmarc_data.push(row)
    })

    dmarc_data.sort((a, b) => (a.metadata.hostname > b.metadata.hostname) ? 1 : ((b.metadata.hostname > a.metadata.hostname) ? -1 : 0))
    dmarc.sort()

    debug('PERIODICAL DMARC CALLBACK UPDATE %s %o', dmarc, dmarc_data, vm.dmarc)
    // vm.dmarc = dmarc
    // vm.dmarc_data = dmarc_data
		vm.setDmarcData(dmarc_data)
  }
  // if (key === 'dmarc.periodical') { dmarc_callback(data, metadata, key, vm) }
  //
  // if (key === 'os.periodical') { os_callback(data, metadata, key, vm) }
  //
  // if (key === 'logs.periodical') { web_callback(data, metadata, key, vm) }
}

const dmarc_periodical = {
  params: function (_key, vm) {
    debug('PERIODICAL dmarc_periodical %o %o', _key, vm)

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

    debug('dmarc_periodical FILTER ', filter)

    if (
      _key
    ) {
      switch (_key) {
        case 'dmarc.periodical':
          source = [{
            params: { id: _key },
            // path: 'all',
            // range: 'posix ' + roundMilliseconds(Date.now() - (6 * SECOND)) + '-' + roundMilliseconds(Date.now() - SECOND) + '/*',
						range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
            query: {
              'from': 'dmarc',
              // 'index': false,
              // /**
              // * right now needed to match OUTPUT 'id' with this query (need to @fix)
              // **/
              // 'q': [
              //   'data',
              //   'metadata'
              // ],
              // 'transformation': [
              //   {
              //     'orderBy': { 'index': 'r.asc(host)' }
              //   }
              // ],
              // 'filter': os_filter
              // query: `{
              //     dmarc (domain: "e-ducativa.com" limit: 0 disposition: "reject" order: "asc") {
              //         data {
              //             report {org}, policy {p, sp}, records
              //         }
              //         metadata {host}
              //
              //     }
              //
              //
              // }`
              query: `{
							    dmarc (limit: 0) {
							        data {
						            report {
													email,
													id,
													org,
													range {start, end}
												},
												policy {
													aspf,
												  domain,
												  fo,
												  p,
												  pct,
												  sp
												},
												records
							        }
							        metadata {
												domain,
											  host,
											  id,
											  path,
											  timestamp,
											  type,
											  tag,
											  range {start,end}
											}

							    }


							}`

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
  dmarc_periodical,
]

const periodical = [
  dmarc_periodical,
  // dmarc_summary_periodical
]

const requests = {
  periodical: periodical,
  once: once
}

export { dmarc_periodical, periodical, once }
export default requests
