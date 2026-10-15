import type { Router } from 'vue-router'
import { useUserStore } from '@/store/user'

export default function loginGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    // 本地模式：默认放行（未登录也能使用，数据保存在本机）；
    // 仅显式标记 requiresAuth 的页面（如个人资料）强制登录
    if (!to.meta.requiresAuth)
      return next()

    const userStore = useUserStore()
    if (!userStore.isAuthenticated)
      return next({ name: 'Login' })

    next()
  })
}
