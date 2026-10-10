// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://matthays.dev",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  // Keep the old Jekyll URLs working.
  redirects: {
    "/projects/Expanding My Local AI Capabilities": "/blog/litellm-open-webui",
    "/projects/ct-gh-actions-migration": "/projects/jenkins-to-actions",
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
