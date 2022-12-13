import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from './views/NotFound.vue'

export const routes = [
  {
    path: '/',
    component: () => import('./layouts/Mine.vue'),
    children: [
      {
        path: '',
        meta: { title: '个人主页' },
        redirect: '/memo',
      },
      {
        path: '/memo',
        meta: { title: '个人主页' },
        name: 'memo',
        props: route => ({ tag: route.query.tag }),
        component: () => import('./views/Memo.vue'),
      }, {
        path: '/me',
        meta: { title: '个人资料' },
        name: 'profile',
        component: () => import('./views/Profile.vue'),
      },
      {
        path: '/wechat',
        name: 'wechat',
        meta: { title: '微信输入' },
        component: () => import('./views/Wechat.vue'),
      },
      {
        path: '/review',
        name: 'review',
        meta: { title: '每日回顾' },
        component: () => import('./views/Review.vue'),
      },
      {
        path: '/recycle',
        name: 'recycle',
        meta: { title: '回收站' },
        component: () => import('./views/Recycle.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', publicRoute: true },
    component: () => import('./views/Login.vue'),
  },
  {
    path: '/logup',
    name: 'Logup',
    meta: { title: '注册', publicRoute: true },
    component: () => import('./views/Logup.vue'),
  },

  { path: '/:path(.*)', component: NotFound },
] as RouteRecordRaw[]
export const router = createRouter({
  history: createWebHistory(),
  routes,
})
