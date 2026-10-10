// Usage: npm run new -- "My post title"
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "My post title"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
if (!slug) {
  console.error("Title needs at least one letter or number for the filename");
  process.exit(1);
}
const path = fileURLToPath(new URL(`../src/content/blog/${slug}.md`, import.meta.url));
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
