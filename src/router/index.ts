import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/',
    redirect: {
      name: 'Home'
    }
  },  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/accountAnalysis/Account.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
