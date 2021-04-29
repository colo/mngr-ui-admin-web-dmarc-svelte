/**
* Dynamic Layout
* https://dev.to/lampewebdev/vuejs-pages-with-dynamic-layouts-problems-and-a-solution-4460
*/

/**
* Avoid lazy loading or Apps get null $route (and breaks Dynamic Layout)
* https://forum.vuejs.org/t/this-route-only-returns-null-in-app-vue/64006/3
**/
import Index from '@apps/dmarc/Index.svelte'
import Error from '../views/Error.svelte'

const routes = [
  {
    path: '',
    // component: () => import('layouts/MainLayout.vue'),
    name: 'index',
    // component: () => import('@apps/start/Index.vue'),
    component: Index,
		// redirect: '/test'
    // meta: { layout: 'VerticalLayout' },

  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    // component: () => import('../views/Error.svelte'),
    component: Error,
    props: { number: 404, title: 'Oops… You just found an error page', subtitle: 'We are sorry but the page you are looking for was not found'},
    meta: { layout: 'EmptyLayout' },
  }
]

export default routes
