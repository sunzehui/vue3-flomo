import About from "./views/About.vue";
import NotFound from "./views/NotFound.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
// example of route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
// component: () => import('./views/About.vue')

export const routes = [
  // { path: "/", component: Home, meta: { title: "Home" } },

  {
    path: "/",
    component: () => import("./layouts/Mine.vue"),
    children: [
      {
        path: "",
        meta: { title: "个人主页" },
        component: () => import("./views/Memo.vue"),
      },
      {
        path: "/about",
        meta: { title: "About" },
        component: () => import("./views/About.vue"),
      },
      {
        path: "/memo",
        meta: { title: "个人主页" },
        component: () => import("./views/Memo.vue"),
      },
      {
        path: "/wechat",
        meta: { title: "微信输入" },
        component: () => import("./views/Wechat.vue"),
      },
      {
        path: "/review",
        meta: { title: "每日回顾" },
        component: () => import("./views/Review.vue"),
      },
      {
        path: "/recycle",
        meta: { title: "回收站" },
        component: () => import("./views/Recycle.vue"),
      },
    ],
  },
  {
    path: "/login",
    meta: { title: "登录" },
    component: () => import("./views/Login.vue"),
  },

  { path: "/:path(.*)", component: NotFound },
];
