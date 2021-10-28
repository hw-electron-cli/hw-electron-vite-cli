import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import { uglify } from "rollup-plugin-uglify";
const path = require("path");
// import path from "path";
function resolve(dir) {
  return path.join(__dirname, dir);
}

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [vue(), viteMockServe({ supportTs: false })],
    build: {
      rollupOptions: {
        plugins: [
          {
            ...uglify({
              compress: {
                // eslint-disable-next-line camelcase
                drop_console: true,
                // eslint-disable-next-line camelcase
                drop_debugger: true
              }
            })
          }
        ]
      }
    },
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/style/common.scss";`
        }
      }
    },
    clearScreen: false,
    server: {
      host: process.env.VITE_APP_HOST,
      port: process.env.VITE_APP_PORT,
      open: false,
      proxy: {
        "/mock": {
          target: process.env.VITE_APP_MOCK_API,
          changeOrigin: true,
          // eslint-disable-next-line no-shadow
          rewrite: path => path.replace(/^\/mock/, "")
        },
        "/api": {
          target: process.env.VITE_APP_API,
          changeOrigin: true,
          // eslint-disable-next-line no-shadow
          rewrite: path => path.replace(/^\/api/, "")
        }
      }
    }
  });
};
