/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_ENV: "development" | "test" | "staging" | "production";
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare const __APP_ENV__: string;
declare const __BUILD_TIME__: string;
declare const __BUILD_VERSION__: string;
declare const __BUILD_ENV__: string;
