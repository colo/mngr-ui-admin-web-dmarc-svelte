/* eslint-disable */

'use strict'

var App = require('../node-app'),
  // path = require('path'),
  // fs = require('fs'),
  IOWrapper = require('./wrapper')
// pathToRegexp = require('path-to-regexp'),
// io = require('socket.io-client');

var debug = require('debug')('node-app-socket.io-client')
var debug_events = require('debug')('node-app-socket.io-client:Events')
var debug_internals = require('debug')('node-app-socket.io-client:Internals')

var AppIOClient = new Class({
  // Implements: [Options, Events],
  Extends: App,

  ON_CONNECT: 'onConnect',
  ON_CONNECT_ERROR: 'onConnectError',

	connected: false,

  // request: null,
  io: undefined,

  api: {},

  methods: [
    'on',
    'emit',
  ],

  authorization: null,
  // authentication: null,
  _merged_apps: {},

  options: {

    scheme: 'http',
    host: '127.0.0.1',
    port: 80,
    // db: '',

    io: {
      // manager: new io.Manager({
      // 	autoConnect: false
      // })
    },

    logs: null,

    authentication: null,

    // authentication: {
    // username: 'user',
    // password: 'pass',
    // sendImmediately: true,
    // bearer: 'bearer,
    // basic: false
    // },

    authorization: null,

    /* routes: {

			get: [
				{
					path: '/:param',
					callbacks: ['check_authentication', 'get'],
					content_type: /text\/plain/,
				},
			],
			post: [
				{
				path: '',
				callbacks: ['', 'post']
				},
			],
			all: [
				{
				path: '',
				callbacks: ['', 'get']
				},
			]

		}, */

    // api: {
    //
    // 	content_type: 'application/json',
    //
    // 	path: '',
    //
    // 	version: '0.0.0',
    //
    // 	versioned_path: false, //default false
    //
    // 	//accept_header: 'accept-version', //implement?
    //
    // 	/*routes: {
    // 		get: [
    // 			{
    // 			path: '',
    // 			callbacks: ['get_api'],
    // 			content_type: 'application/x-www-form-urlencoded',
    // 			//version: '1.0.1',
    // 			},
    // 			{
    // 			path: ':service_action',
    // 			callbacks: ['get_api'],
    // 			version: '2.0.0',
    // 			},
    // 			{
    // 			path: ':service_action',
    // 			callbacks: ['get_api'],
    // 			version: '1.0.1',
    // 			},
    // 		],
    // 		post: [
    // 			{
    // 			path: '',
    // 			callbacks: ['check_authentication', 'post'],
    // 			},
    // 		],
    // 		all: [
    // 			{
    // 			path: '',
    // 			callbacks: ['get'],
    // 			version: '',
    // 			},
    // 		]
    //
    // 	},*/
    //
    //
    // 	/*doc: {
    // 		'/': {
    // 			type: 'function',
    // 			returns: 'array',
    // 			description: 'Return an array of registered servers',
    // 			example: '{"username":"lbueno","password":"40bd001563085fc35165329ea1ff5c5ecbdbbeef"} / curl -v -L -H "Accept: application/json" -H "Content-type: application/json" -X POST -d \' {"user":"something","password":"app123"}\'  http://localhost:8080/login'
    //
    // 		}
    // 	},*/
    // },
  },
  initialize: function (options) {
    this.parent(options)// override default options

    let	path = (typeof (this.options.path) !== 'undefined') ? this.options.path : '/'

    debug_internals('initialize with this.options.io socket', this.options)
    if (this.options.scheme && this.options.host && this.options.port) {
      // let io = new IOWrapper({uri: this.options.scheme + '://'+ this.options.host + ':' + this.options.port+path})
      let io = new IOWrapper(this.options)
      this.add_io(io)
    }

    // }

    // if (this.logger) { this.logger.extend_app(this) }

    /**
		 * logger
		 *  - end
		 * **/

    /**
		 * authorization
		 * - start
		 * */
		 if(this.options.authorization){
			 let authorization = null;

			 ////console.log('----typeof(his.options.authorization)---');
			 ////console.log(typeof(this.options.authorization));
			 ////console.log(this.options.authorization);

			if(typeof(this.options.authorization) == 'class'){
				authorization = new this.options.authorization({});
				this.options.authorization = {};
			}
			else if(this.options.authorization.module){
				authorization = new this.options.authorization.module(this.options.authorization)
			}
			// else if(typeof(this.options.authorization) == 'function'){
			else{
				authorization = this.options.authorization;
				this.options.authorization = {};
			}

			if(authorization){
				//if(this.options.authorization.init !== false){

					// if(this.options.authorization.process){
					// 	////console.log('----this.options.authorization.process---');
					// 	authorization.processRules(
					// 		this.options.authorization.process
					// 	);
					// }

					this.authorization = authorization;
					// app.use(this.authorization.session());
					if(this.authorization && typeof(this.authorization.extend_app) === 'function')
						this.authorization.extend_app(this)
					//
					// middlewares.push(this.authorization.session())



				this.fireEvent(this.ON_INIT_AUTHORIZATION, authorization);
			}
		}
		/**
		 * authorization
		 * - end
		 * */

    // this.apply_routes(this.options.routes, false);
  },
	connect: function(){
		debug_events('connect', this.connected)
		if(this.connected === true){
			this.fireEvent(this.ON_CONNECT)
		}
		// else{
		// 	this.fireEvent(this.ON_CONNECT_ERROR)
		// }

	},
  add_io: function (io) {
    if (this.io === undefined && io) {
      debug_internals('add_io', io, this.io)
      this.io = io
      if (io.connected == true) this.socket(this.io)
      else io.addEvent('connect', function () { this.socket(io) }.bind(this))

    }
  },
  socket: function (socket) {
    debug('CONNECTED, %o', socket)

    this.connected = socket.connected

    if (this.options.io) {
      /**
			* WTF?: this is server side code
			*
      if(this.options.io.rooms){

        Array.each(this.options.io.rooms, function(room){
          socket.join(room, () => {
            let rooms = Object.keys(socket.rooms);
            ////console.log(rooms); // [ <socket.id>, 'room 237' ]
          });
        }.bind(this))
      }
			**/

      // if(this.options.io.routes)

    }

    this.apply_io_routes(socket)

    // socket.on('disconnect', function () {
    socket.addEvent('disconnect', function () {
    	this.connected = socket.connected
      debug('DISCONNECTED, %o', socket)
    }.bind(this))
  },
  apply_io_routes: function (socket) {
		debug_events('apply_io_routes', this.options.io.routes)

    if (this.options.io.routes) {
      // let app = this.io;

      Object.each(this.options.io.routes, function (routes, message) {
        // console.log('message', message)

        let route_index = 0
        routes.each(function (route) { // each array is a route
          var path = route.path

          let current = null
          let prev = null

          for (let i = route.callbacks.length - 1; i >= 0; i--) {
            let callback = this.__callback(route.callbacks[i], message)

      			if (i == route.callbacks.length - 1) {
      				/// /console.log('_apply_filters last')

      				if (route.callbacks.length == 1) { // if there is only one filter, 'next' must be sent to "output/save"
      					current = undefined
      					/// /console.log('_apply_filters last 1')
      				} else {
      					let self = this
      					current = function (socket) {
                  let callback = this.__callback(route.callbacks[i], message)
      						callback(socket, undefined)
      					}.bind(this)

      					/// /console.log('_apply_filters last 2')
      				}
      			} else if (i != 0) {
      				/// /console.log('_apply_filters not zero ', i);

      				prev = current
      				current = function (socket) {
                let callback = this.__callback(route.callbacks[i], message)

      					callback(socket, function (socket) {
      						prev(socket, undefined)
      					}, this)
      				}.bind(this)
      			}

      			if (i == 0) { // first filter, start running
      				/// /console.log('_apply_filters start ', message);

      				// route.callbacks[i](socket, current);
              if (route.once && route.once === true) {
                socket.once(message, function () {
                  // ////console.log('arguments', args)
                  callback.attempt([socket, current].append(arguments), this)
                }.bind(this))
              } else {
                socket.on(message, function () {
                  // console.log('message', message)
                  callback.attempt([socket, current].append(arguments), this)
                }.bind(this))
              }
      			}

      			// current(doc, opts, prev);
      		}

          // var callbacks = [];
          // route.callbacks.each(function(fn){
          //   ////console.log('apply_io_routes', message)
          // 	var callback = (typeof(fn) == 'function') ? fn : this[fn].bind(this);
          //
          // 	if(process.env.PROFILING_ENV && this.logger){
          // 		var profile = 'ID['+this.options.id+']:IO:MESSAGE['+message+']:PATH['+path+']:CALLBACK['+fn+']';
          //
          // 		var profiling = function(socket, next){
          // 			////////console.log('---profiling...'+profile);
          // 			this.profile(profile);
          //
          //       callback(socket, next);
          //
          // 			this.profile(profile);
          // 			////////console.log('---end profiling...'+profile);
          // 		}.bind(this);
          //
          // 		// callbacks.push(profiling);
          //     socket.on(message, profiling(socket, next))
          // 	}
          // 	else{
          //
          // 		// callbacks.push(callback);
          //     socket.on(message, callback.pass(socket))
          //
          // 	}
          //
          // }.bind(this));

          // // app[message](route.path, callbacks);
          // // app[message](route.path, this._parallel(callbacks));
          // // socket.on(message, (socket) => callbacks)
          //
          // var perms = [];
          // // var routes = this.options.io.routes;
          // // //var path = (route.path != '' ) ? route.path : '/';
          // // if(message == '*'){
          // //
          // // 	methods.each(function(method){
          // // 		var path_found = false;
          // // 		if(routes[method]){
          // // 			path_found = routes[method].every(function(item){
          // // 				if(item['path'] == '')
          // // 					item['path'] = '/';
          // //
          // // 					return item['path'] == path;
          // // 			});
          // //
          // // 		}
          // //
          // // 		//if(!this.options.routes[method])//ommit verbs that have a specific route already
          // // 		if( !routes[method] || !path_found ){//ommit verbs that have a specific route already
          // // 			perms.push(this.create_authorization_permission(method, this.uuid+'_'+route.path));
          // // 		}
          // //
          // // 	}.bind(this));
          // // }
          // // else{
          // 	perms.push(this.create_authorization_permission(message, this.uuid+'_io_'+route_index));
          // // }
          // //
          // this.apply_authorization_permissions(perms);
          // //
          // this.apply_authorization_roles_permission(route, perms);
          //
          // route_index++
        }.bind(this))
      }.bind(this))
    }

		debug('gonna fire this.ON_CONNECT')
    this.fireEvent(this.ON_CONNECT)
  },
  remove_io_routes: function () {
    let socket = this.io
    if (this.options.io.routes) {
      // let app = this.io;

      Object.each(this.options.io.routes, function (routes, message) {
        // console.log('message', message)

        let route_index = 0
        routes.each(function (route) { // each array is a route
          var path = route.path

          let current = null
          let prev = null

          for (let i = route.callbacks.length - 1; i >= 0; i--) {
            // let callback = this.__callback(route.callbacks[i], message)

      			// if(i == route.callbacks.length - 1){
      			// 	////console.log('_apply_filters last')
            //
      			// 	if(route.callbacks.length == 1){//if there is only one filter, 'next' must be sent to "output/save"
            //
      			// 		current = undefined
      			// 		////console.log('_apply_filters last 1')
            //
      			// 	}
      			// 	else{
      			// 		let self = this
      			// 		current = function(socket){
            //       let callback = this.__callback(route.callbacks[i], message)
      			// 			callback(socket, undefined);
            //
      			// 		}.bind(this);
            //
      			// 		////console.log('_apply_filters last 2')
            //
      			// 	}
      			// }
      			// else if(i != 0){
      			// 	////console.log('_apply_filters not zero ', i);
            //
      			// 	prev = current;
      			// 	current = function(socket){
            //     let callback = this.__callback(route.callbacks[i], message)
            //
      			// 		callback(socket, function(socket){
      			// 			prev(socket, undefined);
      			// 		}.bind(this), this);
            //
      			// 	}.bind(this);
      			// }

      			if (i == 0) { // first filter, start running
              socket.removeAllListeners(message)
      			}

      			// current(doc, opts, prev);
      		}
        })
      })
    }
  },
  __callback (fn, message) {
    var callback = (typeof (fn) === 'function') ? fn : this[fn].bind(this)

		if ((!window || window === undefined) && process.env && process.env.PROFILING_ENV && this.logger) {
      // //console.log('PROFILING_ENV')
      var profile = 'ID[' + this.options.id + ']:IO:MESSAGE[' + message + ']:CALLBACK[' + fn + ']'

      var profiling = function () {
        // //console.log('---profiling...'+profile);
        this.profile(profile)

        callback.attempt(arguments, this)

        this.profile(profile)
        /// /////console.log('---end profiling...'+profile);
      }.bind(this)

      // callbacks.push(profiling);
      return profiling
    } else {
      return callback
    }
  },
  use: function (mount, app) {
    debug('use instanceOf(app, AppIOClient) %o', instanceOf(app, AppIOClient))

    if (instanceOf(app, AppIOClient)) { this.parent(mount, app) }
  }

})

module.exports = AppIOClient
