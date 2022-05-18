import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import applyMiddleware from "./middleware/index.js";
import { createPinia } from "pinia";
const app = createApp(App);
const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes,
});

applyMiddleware(router);

app.use(pinia);
app.use(router);
app.mount("#app");
