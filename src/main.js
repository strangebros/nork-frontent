import "@/assets/css/reset.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// pinia
import { createPinia } from "pinia";
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedState);
app.use(pinia);

app.use(router);

app.mount("#app");
