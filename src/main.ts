import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useThemeStore } from "./stores/themeStore";
import "./assets/tailwind.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Vor dem Mounten initialisieren, damit der dark/light-Modus ohne
// sichtbaren Flackereffekt (FOUC) gesetzt ist, bevor die App rendert.
useThemeStore().init();

app.mount("#app");
