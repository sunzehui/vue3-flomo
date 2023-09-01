import { ElMessage } from 'element-plus'
import type { Router } from 'vue-router'
import { useUserStore } from '@/store/user'

export default function loginGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const thisRoutePublic = to.meta.publicRoute || false

    const userStore = useUserStore()
    const isAuthenticated = userStore.isAuthenticated

    if (!isAuthenticated && !thisRoutePublic)
      next({ name: 'Login' })

    else next()
  })
}
