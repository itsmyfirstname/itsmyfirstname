// Scaffold a draft blog post or project write-up.
// Usage: node scripts/new.mjs <post|project> "Title"
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const [kind, ...rest] = process.argv.slice(2);
const title = rest.join(" ").trim();
const dirs = { post: "blog", project: "projects" };

if (!dirs[kind] || !title) {
  console.error('Usage: node scripts/new.mjs <post|project> "Title"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
if (!slug) {
  console.error("Title needs at least one letter or number for the filename");
  process.exit(1);
}

const path = fileURLToPath(new URL(`../src/content/${dirs[kind]}/${slug}.md`, import.meta.url));
if (existsSync(path)) {
  console.error(`${path} already exists`);
  process.exit(1);
}

const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); // local date

const templates = {
  post: `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${today}
tags: []
draft: true
---

`,

  project: `---
title: ${JSON.stringify(title)}
# One line: shown on the project card and in link previews.
description: ""
# work | fun
category: work
tags: []
startDate: ${today}
# endDate: ${today}   # leave out while the project is ongoing
# image: /img/${slug}.webp   # optional card image, put the file in public/img/
order: 99
draft: true
---

<!--
  Drafting notes (delete this comment before publishing).
  Fill in each section from what actually happened; keep it concrete:
  real numbers, tools, and trade-offs over adjectives. First person, plain tone.
  Leave out anything confidential about an employer's systems.
  Cut sections that don't apply.
-->

## Context

<!-- Where this happened and why it mattered. Team, system, constraints. -->

## The problem

<!-- What was broken, slow, risky or missing. How it showed up. -->

## What I did

<!-- The approach, key decisions, and alternatives considered. -->

## Outcome

<!-- Measurable results where possible: time saved, cost, reliability, adoption. -->

## Stack

<!-- Languages, tools and services involved. -->

## Lessons learned

<!-- What I'd repeat, what I'd do differently. -->
`,
};

writeFileSync(path, templates[kind]);
console.log(`Created ${path} (draft: set draft: false to publish)`);
