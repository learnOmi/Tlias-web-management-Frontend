import { createI18n } from "vue-i18n";
import zhCN from "./zh-CN";
import enUS from "./en-US";
import { useAppStore } from "@/stores";

const appStore = useAppStore();

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
  globalInjection: true,
});

export function setLocale(locale: "zh-CN" | "en-US") {
  (i18n.global.locale as any).value = locale;
}

export default i18n;
