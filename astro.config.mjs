// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { defineMdastPlugin } from "satteri";

/** Drop HTML comments from Markdown so drafting notes never reach the built HTML. */
const stripComments = defineMdastPlugin({
  name: "strip-comments",
  html(node, ctx) {
    if (/^\s*<!--[\s\S]*?-->\s*$/.test(node.value)) ctx.removeNode(node);
  },
});

export default defineConfig({
  site: "https://matthays.dev",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  // Keep the old Jekyll URLs working.
  redirects: {
    "/projects/Expanding My Local AI Capabilities": "/blog/litellm-open-webui",
  },
  markdown: {
    processor: satteri({ mdastPlugins: [stripComments] }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
