/* eslint-disable */
'use strict'

// import { EventBus } from '@libs/eventbus'

import * as Debug from "debug"
const debug = Debug("libs:pipelines:filters:doc_id")
debug.log = console.log.bind(console) // don't forget to bind to console!

let qs = require('qs')
// export default function (doc, opts, next, pipeline) {
// 	debug('filter', doc, qs.stringify(doc.metadata.opts.query))
// 	if (doc.metadata.opts.params && doc.metadata.opts.params.id) {
// 		doc.id = doc.metadata.opts.params.id
// 	} else {
// 		doc.id = doc.metadata.input + '?' + qs.stringify(doc.metadata.opts.query)
// 	}
//
// 	next(doc, opts, next, pipeline)
// }

export default function(payload){
  let {input, output, opts } = payload
  // let type = input.type
  // let full_range = input.full_range
  // let table = input.clients.options.table
  // full_range = full_range || false
  // let group_index = (opts && opts.group_index !== undefined) ? opts.group_index : DEFAULT_GROUP_INDEX

  let filter = function(doc, opts, next, pipeline){
		let { type, input, input_type, app } = opts
		debug('filter', doc)
		// debug('filter', doc, qs.stringify(doc.metadata.opts.query))
		if (doc.metadata.opts.params && doc.metadata.opts.params.id) {
			doc.id = doc.metadata.opts.params.id
		} else {
			doc.id = doc.metadata.input + '?' + qs.stringify(doc.metadata.opts.query)
		}

		next(doc, opts, next, pipeline)
	}

  return filter
}
