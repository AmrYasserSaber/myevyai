import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "myEvyAi",
  version: "0.1.0",
  permissions: ["storage", "sidePanel"],
  host_permissions: ["https://www.linkedin.com/*", "https://openrouter.ai/*"],
  action: {
    default_title: "Open myEvyAi",
  },
  side_panel: {
    default_path: "src/sidePanel/index.html",
  },
  background: {
    service_worker: "src/background/serverWorker.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://www.linkedin.com/*"],
      js: ["src/content/scrap.ts"],
      run_at: "document_idle",
    },
  ],
});
