import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/',
    redirect: {
      name: 'Home'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
