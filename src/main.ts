import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { setupDirectives } from "./directives";
import { setupErrorHandler } from "./utils/errorHandler";
import { setupCommonComponents } from "./components/common";
import { setupMonitor } from "./monitor";
import { setupLogger } from "./utils/logger";
import { printBuildInfo } from "./utils/buildInfo";
import i18n from "./locales";

import "./assets/main.css";

setupLogger();
printBuildInfo();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);

const elementLocale = i18n.global.locale.value === "zh-CN" ? zhCn : en;
app.use(ElementPlus, { locale: elementLocale });

setupDirectives(app);
setupErrorHandler(app);
setupCommonComponents(app);
setupMonitor(app);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
