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
            path: '/admin/menu/index',
            name: 'index',
            component: () => import('@/views/admin/person/index.vue')
          },
          {
            path: '/admin/menu/userList',
            name: 'userList',
            component: () => import('@/views/admin/userList/index.vue')
          },
          {
            path: '/admin/menu/home',
            name: 'AdminHome',
            component: () => import('@/views/admin/home/index.vue')
          },
          {
            path: '/admin/menu/monitor',
            name: 'monitor',
            component: () => import('@/views/admin/monitor/index.vue')
          },
          {
            path: '/admin/menu/person',
            name: 'person',
            component: () => import('@/views/admin/person/index.vue')
          },
          {
            path: '/admin/menu/priorityPage',
            name: 'priorityPage',
            component: () => import('@/views/admin/priority/index.vue'),
            redirect: '/priority/priorityFacebookPage',
            children: [
              {
                path: '/priority/priorityFacebookPage',
                name: 'priorityFacebookPage',
                component: () => import('@/views/admin/priority/PriorityFacebookPage.vue')
              },
              {
                path: '/admin/menu/propertyMenu',
                name: 'PropertyMenu',
                component: () => import('@/components/property/PropertyMenu.vue'),
                redirect: {
                  path: '/admin/menu/propertyMenu/areaList'
                },
                children: [
                  {
                    path: '/admin/menu/propertyMenu/areaList',
                    name: 'areaList',
                    component: () => import('@/components/property/AreaList.vue')
                  },
                  {
                    path: '/admin/menu/propertyMenu/categoryList',
                    name: 'categoryList',
                    component: () => import('@/components/property/CategoryList.vue')
                  }
                ]
              }
            ]
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
