import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from './views/NotFound.vue'
import MainLayout from './layouts/Main.vue'
import Memo from './views/Memo.vue'
import Login from './views/User/Auth/Login.vue'
import {
  DeleteFilled,
  Menu,
  TrendCharts,
} from '@element-plus/icons-vue'

export const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        meta: { title: '个人主页' },
        redirect: '/memo',
      },
      // 首页不需要懒加载
      {
        path: '/memo',
        meta: { title: 'MEMO', icon: Menu, category: 'subpage' },
        name: 'memo',
        props: route => ({ tag: route.query.tag }),
        component: Memo,
      },
      {
        path: '/review',
        name: 'review',
        meta: { title: '每日回顾', icon: TrendCharts, category: 'subpage' },
        component: () => import('./views/Review.vue'),
      },
      {
        path: '/recycle',
        name: 'recycle',
        meta: { title: '回收站', icon: DeleteFilled, category: 'subpage' },
        component: () => import('./views/Recycle.vue'),
      },
      {
        path: '/me',
        name: 'me',
        meta: { title: '个人资料' },
        component: () => import('./views/Me.vue'),
      },
    ],
  },
  // 注意：更具体的 /user/auth/* 必须声明在 /user/:id 之前
  {
    path: '/user/auth/login',
    name: 'Login',
    meta: { title: '登录', publicRoute: true },
    component: Login,
  },
  {
    path: '/user/auth/register',
    name: 'Register',
    meta: { title: '注册', publicRoute: true },
    component: () => import('./views/User/Auth/Register.vue'),
  },
  // 分享页使用独立布局；原先这里与上面一样声明成 path: '/'，
  // 造成两条同路径的顶层记录，且 redirect 会把 /user/:id 也重定向到 /memo
  {
    path: '/user/:id',
    component: () => import('./layouts/Share.vue'),
    children: [
      {
        path: '',
        name: 'user-memo',
        meta: { title: '用户主页', publicRoute: true },
        component: () => import('./views/User/memo.vue'),
      },
    ],
  },
  { path: '/:path(.*)', component: NotFound },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
