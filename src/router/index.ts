import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layout/admin/index.vue'),
    redirect: '/admin/index',
    children: [
      {
        path: '/admin/index',
        name: 'Dashboard',
        component: () => import('@/views/admin/index/index.vue')
      },
      {
        path: '/admin/dict',
        name: 'Dict',
        component: () => import('@/views/admin/dict/index.vue')
      },
      {
        path: '/admin/menu',
        name: 'menu',
        component: () => import('@/components/admin/Menu.vue'),
        children: [
          {
            path: '/admin/menu/monitor',
            name: 'monitor',
            component: () => import('@/views/admin/monitor/index.vue')
          },
          {
            path: '/admin/menu/userList',
            name: 'userList',
            component: () => import('@/views/admin/userList/index.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: {
      name: 'Home'
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/Home.vue'),
        name: 'Home'
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Login.vue')
      },
      {
        path: '/person',
        component: () => import('@/views/person/Person.vue'),
        name: 'Person'
      },
      {
        path: '/account',
        component: () => import('@/views/accountAnalysis/Account.vue'),
        name: 'Account'
      },
      {
        path: '/header',
        component: () => import('@/components/Header.vue'),
        name: 'Header'
      },
      {
        path: '/Leaderboard',
        name: 'Leaderboard',
        component: () => import('@/views/leaderboard/Leaderboard.vue')
      },
      {
        path: '/Account',
        name: 'Account',
        component: () => import('@/views/accountAnalysis/Account.vue')
      },
      {
        path: `/Account/:accountId`,
        name: 'Account',
        component: () => import('@/views/accountAnalysis/Account.vue')
      }
    ]
  }
]

export const history = createWebHashHistory()
const router = createRouter({
  history,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user) {
      next()
      return
    }
    next({
      name: 'Login'
    })
    return
  }
  next()
})

export default router
