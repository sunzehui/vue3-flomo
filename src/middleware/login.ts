import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";
import { Router } from "vue-router";

export default function loginGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const isAuthenticated = userStore.isAuthenticated;
    if (to.name !== "Login" && !isAuthenticated) {
      ElMessage.error("请先登录");
      next({ name: "Login" });
    } else next();
  });
}
