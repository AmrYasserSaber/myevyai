import { defineConfig, loadEnv } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __OPENROUTER_KEY__: JSON.stringify(env.OPEN_ROUTER_KEY ?? ""),
       __ENDPOINT__ : JSON.stringify(env.COMPLETIONENDPOINT ?? ""),
      __MODEL__: JSON.stringify(env.MODEL ?? ""),
    },
    plugins: [crx({ manifest })],
  };
});
