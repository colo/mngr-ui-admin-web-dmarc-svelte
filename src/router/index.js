// import Vue from 'vue'
// import VueRouter from 'vue-router'
//
import routes from './routes'
//
// Vue.use(VueRouter)

// import Router from 'svelte-easyroute'
import createRouter from '@spaceavocado/svelte-router'

createRouter({
	mode: 'HISTORY',
	basename: '',
  routes
})

// const router = new Router({
// 	omitTrailingSlash: true,
//   // mode: 'history',
//   base: '/',
//   // scrollBehavior: () => ({ x: 0, y: 0 }),
//   // scrollBehavior (to, from, savedPosition) {
//   //   if (to.hash) {
//   //     return {
//   //       selector: to.hash
//   //       // offset: { x: 0, y: 0 }
//   //     }
//   //   } else if (savedPosition) {
//   //     return savedPosition
//   //   } else {
//   //     return { x: 0, y: 0 }
//   //   }
//   // },
//   routes
// })
//
// export default router
