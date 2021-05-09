
import * as Debug from 'debug'
const debug = Debug('apps:hosts:libs:periodical')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import {SECOND, MINUTE, HOUR, DAY, WEEK, MONTH} from '@libs/time/const'
// import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'

// let hosts = []

export default function (data, metadata, key, vm) {
  debug('PERIODICAL HOSTS CALLBACK data %s %o', key, data, metadata, vm)

  let hosts_data = []
  if (data.hosts) {
    Array.each(data.hosts, function (row) {
      // let path = row.metadata.path
      let host = row.metadata.host

      // hosts.combine([host])
      hosts_data.push(row)
    })

    hosts_data.sort((a, b) => (a.metadata.hostname > b.metadata.hostname) ? 1 : ((b.metadata.hostname > a.metadata.hostname) ? -1 : 0))
    // hosts.sort()

    // debug('PERIODICAL HOSTS CALLBACK UPDATE %s %o', hosts, hosts_data, vm.hosts)
    // vm.hosts = hosts
    // vm.hosts_data = hosts_data
  }
	vm.setHostsData(hosts_data)
}
