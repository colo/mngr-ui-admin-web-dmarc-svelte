'use strict'
const App = require('../../../modules/node-app-socket.io-client/wrapper')
import DefaultConn from '@etc/default.io'

// let _app = new App(Object.merge(DefaultConn, { path: '/' }))
// export default _app.io

export default function () {
  if (Array.isArray(DefaultConn)) {
    let ios = []
    Array.each(DefaultConn, function (conn) {
      let _app = new App(Object.merge(conn, { path: '/', type: 'Worker' }))
      // ios.push(_app.io)
      ios.push(_app)
    })

    return ios
  } else {
    let _app = new App(Object.merge(DefaultConn, { path: '/', type: 'Worker' }))
    // return _app.io
    return _app
  }
}
