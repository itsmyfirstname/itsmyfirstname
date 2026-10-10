// Usage: npm run new -- "My post title"
import { existsSync, writeFileSync } from "node:fs";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "My post title"');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const path = `src/content/blog/${slug}.md`;
if (existsSync(path)) {
  console.error(`${path} already exists`);
  process.exit(1);
}

const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); // local date
writeFileSync(
  path,
  `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${today}
tags: []
draft: true
---

`,
);
console.log(`Created ${path} (draft: set draft: false to publish)`);
