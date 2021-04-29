const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:defaults:vueEasyPieChart'),
    debug_internals = require('debug')('mngr-ui-admin-charts:defaults:vueEasyPieChart:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)


module.exports = {
  class: 'netdata-chart netdata-easypiechart-chart',
  component: 'vue-easy-pie-chart-wrapper',
  "interval": 0,
  pre_process: function(chart, name, stat){
    debug('pre_process', chart, name, stat)
    if(chart && chart.params)
      chart.params.title = name

    return chart
  },
  init: function (vm, chart, name, stat, type){
    debug('init', typeof vm, chart, name, stat, type)
    if(chart && chart.params)
      chart.params.title = name

  },
  watch: {
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){
      let isWindow = (caller && caller.setInterval) ? true : false
      debug_internals('transform', isWindow, caller, values, chart, cb)
      /**
      * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
      * Let it trasnform stat to tabular with generic methods
      * Run this one with only with tabular data
      **/
      if(isWindow){
        /**
        * gauges use only one value, so we keep 'last' one, the one with biggest timestamp
        * sort in desc order
        **/
        if(values && Array.isArray(values)){
          values.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })
          values = values[0]
        }

        debug_internals('transform2 %o', values)

      }
      // else{
      // }

      return values
    },
  },

  "params": {
    size: 100,
    animate: true,
    // 'track-color': "yellow-3",
    // 'scale-color': 'primary',
    'bar-color': 'blue',
    // 'line-width': 5
    'size': 130,
    'title': undefined,
    'unit': '%',
  },


}
