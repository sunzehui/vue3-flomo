import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import NotFound from './views/NotFound.vue'
import Mine from './layouts/Mine.vue'
import Memo from './views/Memo.vue'
import Login from './views/Login.vue'
export const routes = [

  {
    path: '/',
    component: Mine,
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
        component: Memo,
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
      }, {
        path: '/me',
        name: 'me',
        meta: { title: '个人资料' },
        component: () => import('./views/me.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', publicRoute: true },
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    meta: { title: '注册', publicRoute: true },
    component: () => import('./views/Register.vue'),
  },
  {
    path: '/',
    component: () => import('./layouts/Share.vue'),
    redirect: '/memo',
    children: [
      {
        path: '/user/:id',
        name: 'user-memo',
        meta: { title: '用户主页', publicRoute: true },
        component: () => import('./views/User/memo.vue'),
      },
    ],
  },
  { path: '/:path(.*)', component: NotFound },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
