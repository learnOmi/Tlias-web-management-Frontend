import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  const buildTime = new Date().toISOString();
  const buildVersion = env.VITE_APP_VERSION || "1.0.0";
  const buildEnv = mode;

  const plugins: any[] = [vue()];

  if (isProd) {
    plugins.push(
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      })
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __BUILD_TIME__: JSON.stringify(buildTime),
      __BUILD_VERSION__: JSON.stringify(buildVersion),
      __BUILD_ENV__: JSON.stringify(buildEnv),
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      open: false,
      cors: true,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      target: "esnext",
      sourcemap: !isProd,
      minify: "esbuild",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            elementPlus: ["element-plus", "@element-plus/icons-vue"],
            echarts: ["echarts", "vue-echarts"],
            i18n: ["vue-i18n"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
  };
});
