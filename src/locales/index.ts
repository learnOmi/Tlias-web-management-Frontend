import { createI18n } from "vue-i18n";
import zhCN from "./zh-CN";
import enUS from "./en-US";

const savedLanguage = localStorage.getItem("app-language") || "zh-CN";

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
  globalInjection: true,
});

export function setLocale(locale: "zh-CN" | "en-US") {
  (i18n.global.locale as any).value = locale;
  localStorage.setItem("app-language", locale);
}

export default i18n;
