import { createRouter, createWebHistory } from "vue-router";
import About from "./views/About.vue";
import NotFound from "./views/NotFound.vue";
export const routes = [
  // { path: "/", component: Home, meta: { title: "Home" } },

  {
    path: "/",
    component: () => import("./layouts/Mine.vue"),
    children: [
      {
        path: "",
        meta: { title: "个人主页" },

        redirect: "/memo",
      },
      {
        path: "/memo",
        meta: { title: "个人主页" },
        name: "memo",
        component: () => import("./views/Memo.vue"),
      },
      {
        path: "/wechat",
        name: "wechat",
        meta: { title: "微信输入" },
        component: () => import("./views/Wechat.vue"),
      },
      {
        path: "/review",
        name: "review",
        meta: { title: "每日回顾" },
        component: () => import("./views/Review.vue"),
      },
      {
        path: "/recycle",
        name: "recycle",
        meta: { title: "回收站" },
        component: () => import("./views/Recycle.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录", publicRoute: true },
    component: () => import("./views/Login.vue"),
  },
  {
    path: "/logup",
    name: "Logup",
    meta: { title: "注册", publicRoute: true },
    component: () => import("./views/Logup.vue"),
  },

  { path: "/:path(.*)", component: NotFound },
];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});
