import { useUserStore } from "@/store/user";

export default function loginGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const isAuthenticated = userStore.isAuthenticated;
    if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
    else next();
  });
}
