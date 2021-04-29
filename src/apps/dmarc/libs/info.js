
import * as Debug from 'debug'
const debug = Debug('apps:dmarc:libs:info')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import {SECOND, MINUTE, HOUR, DAY, WEEK, MONTH} from '@libs/time/const'
// import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'

let dmarc = []

export default function (data, metadata, key, vm) {
  debug('INFO DMARC CALLBACK data %s %o', key, data, metadata, vm)

  let dmarc_info = []
  if (data.dmarc) {
    Array.each(data.dmarc, function (row) {
      // let path = row.metadata.path
      let host = row.metadata.host

      dmarc.combine([host])
      dmarc_info.push(row)
    })

    dmarc_info.sort((a, b) => (a.metadata.hostname > b.metadata.hostname) ? 1 : ((b.metadata.hostname > a.metadata.hostname) ? -1 : 0))
    // dmarc.sort()

    // debug('PERIODICAL DMARC CALLBACK UPDATE %s %o', dmarc, dmarc_info, vm.dmarc)
    // vm.dmarc = dmarc
    // vm.dmarc_info = dmarc_info
		vm.setDmarcInfo(dmarc_info)
  }
}
