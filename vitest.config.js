import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: './tests/setup.ts',
    deps: { inline: ["@vue", "pinia"] },
  },
});
