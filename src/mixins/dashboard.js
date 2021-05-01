'use strict'

import * as Debug from 'debug'
const debug = Debug('mixins:dashboard')
debug.log = console.log.bind(console) // don't forget to bind to console!

const Moo = require('mootools')

import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'

import dataSource from '@mixins/dataSources.js'

export default new Class({
	Extends: dataSource,
	// refresh: SECOND * 5,
  period: 'second',
	start_time: undefined,
	current_time: undefined,

  components: {
  },

  props: {
    // type: {
    //   period: String,
    //   default: 'minute'
    // },
    // dark: {
    //   type: Boolean,
    //   default: false,
    // },
    // fluid: {
    //   type: Boolean,
    //   default: false,
    // },
    // mode: {
    //   type: String,
    //   default: '',
    // },
  },
	round: function (timestamp) {
		if (this.period === 'second' || this.period === 'periodical') {
			return roundMilliseconds(timestamp)
		} else if (this.period === 'minute') {
			return roundSeconds(timestamp)
		} else if (this.period === 'hour') {
			return roundMinutes(timestamp)
		} else {
			return roundHours(timestamp)
		}
	},
	start: function () {
		if (this.start_time === undefined) {
      if (this.period === 'second' || this.period === 'periodical') {
        return (this.end() - SECOND >= 0) ? this.end() - SECOND : 0
      } else if (this.period === 'minute') {
        return (this.end() - MINUTE >= 0) ? this.end() - MINUTE : 0
      } else if (this.period === 'hour') {
        return (this.end() - HOUR >= 0) ? this.end() - HOUR : 0
      } else if (this.period === 'day') {
        return (this.end() - DAY >= 0) ? this.end() - DAY : 0
      } else if (this.period === 'secondly') {
        return roundMilliseconds(this.end())
      } else if (this.period === 'minutely') {
        return roundSeconds(this.end())
      } else if (this.period === 'hourly') {
        return roundMinutes(this.end())
      } else if (this.period === 'daily') {
        return roundHours(this.end())
      }
    } else {
      return this.start_time
    }
	},
	end: function () {
		if (this.current_time === undefined) {
      // return Date.now()
      if (this.period === 'second' || this.period === 'periodical') {
        // return Date.now() - SECOND
        return roundMilliseconds(Date.now()) - (5 * SECOND) // use "5 seconds ago" to really get all documents (DB may be behind writing/reading )
      } else {
        return Date.now()
      }
      // else if (this.period === 'minute') {
      //   // return Date.now() - (2 * MINUTE)
      //   return roundSeconds(Date.now())
      // } else if (this.period === 'hour') {
      //   // return Date.now() - HOUR
      //   return roundMinutes(Date.now())
      // } else {
      //   // return Date.now()
      //   return roundHours(Date.now())
      // }
    } else {
      return this.current_time
    }
	},
})
