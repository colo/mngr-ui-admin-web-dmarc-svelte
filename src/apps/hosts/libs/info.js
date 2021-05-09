
import * as Debug from 'debug'
const debug = Debug('apps:hosts:libs:info')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import {SECOND, MINUTE, HOUR, DAY, WEEK, MONTH} from '@libs/time/const'
// import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'

// let hosts = []

export default function (data, metadata, key, vm) {
  debug('INFO HOSTS CALLBACK data %s %o', key, data, metadata, vm)

  let hosts_info = []
  if (data.hosts) {
    Array.each(data.hosts, function (row) {
      // let path = row.metadata.path
      let host = row.metadata.host

      // hosts.combine([host])
      hosts_info.push(row)
    })

    hosts_info.sort((a, b) => (a.metadata.hostname > b.metadata.hostname) ? 1 : ((b.metadata.hostname > a.metadata.hostname) ? -1 : 0))
    // hosts.sort()

    // debug('PERIODICAL HOSTS CALLBACK UPDATE %s %o', hosts, hosts_info, vm.hosts)
    // vm.hosts = hosts
    // vm.hosts_info = hosts_info

  }
	vm.setHostsInfo(hosts_info)
}
