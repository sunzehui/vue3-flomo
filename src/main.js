import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import { ElTooltip } from "element-plus";
import "element-plus/es/components/Tooltip/style/css";
const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.use(ElTooltip);
app.mount("#app");
