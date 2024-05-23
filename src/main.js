import "@/assets/css/reset.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useKakao } from "vue3-kakao-maps/@utils";

// pinia
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App);
const pinia = createPinia();

// kakao
useKakao(import.meta.env.VITE_KAKAO_KEY);

pinia.use(piniaPluginPersistedState);
app.use(pinia);

app.use(router);
app.mount("#app");
