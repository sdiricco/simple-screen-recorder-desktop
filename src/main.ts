import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./samples/node-api";

// Plugins
import { registerPlugins } from "./plugins";

const pinia = createPinia();

const app = createApp(App);

registerPlugins(app);

app.use(pinia).use(router);

router.isReady().then(() => {
  app.mount("#app").$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
});
