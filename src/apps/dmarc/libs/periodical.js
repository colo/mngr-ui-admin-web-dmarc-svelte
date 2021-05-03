
import * as Debug from 'debug'
const debug = Debug('apps:dmarc:libs:periodical')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import {SECOND, MINUTE, HOUR, DAY, WEEK, MONTH} from '@libs/time/const'
// import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'

// let dmarc = []

export default function (data, metadata, key, vm) {
  debug('PERIODICAL DMARC CALLBACK data %s %o', key, data, metadata, vm)

  let dmarc_data = []
  if (data.dmarc) {
    Array.each(data.dmarc, function (row) {
      // let path = row.metadata.path
      let host = row.metadata.host

      // dmarc.combine([host])
      dmarc_data.push(row)
    })

    dmarc_data.sort((a, b) => (a.metadata.hostname > b.metadata.hostname) ? 1 : ((b.metadata.hostname > a.metadata.hostname) ? -1 : 0))
    // dmarc.sort()

    // debug('PERIODICAL DMARC CALLBACK UPDATE %s %o', dmarc, dmarc_data, vm.dmarc)
    // vm.dmarc = dmarc
    // vm.dmarc_data = dmarc_data
  }
	vm.setDmarcData(dmarc_data)
}
