# matthays.dev

Personal site and blog, built with [Astro](https://astro.build).

## Writing a post

```sh
make post title="My post title"  # creates src/content/blog/my-post-title.md as a draft
make dev                         # http://localhost:4321, drafts are visible here
```

Write in Markdown, then set `draft: false` and push to `master`. Front matter:

```yaml
title: "My post title"
description: "One line, used in link previews and RSS"
pubDate: 2026-10-09
updatedDate: 2026-10-12   # optional
tags: [homelab]
draft: false
```

Images for a post can go next to it (`![alt](./diagram.png)`) or in `public/img/`.

## Where things live

| Path                     | What                                  |
| ------------------------ | ------------------------------------- |
| `src/content/blog/`      | blog posts                            |
| `src/content/projects/`  | project pages (`category: work\|fun`) |
| `src/data/resume.json`   | resume data, rendered at `/cv/`       |
| `src/consts.ts`          | site name, links, featured repos      |
| `src/pages/index.astro`  | home / about text                     |
| `src/styles/global.css`  | all site styles                       |

## GitHub stats

`/repositories` pulls repo cards and profile stats from the GitHub API at build time. Pick the featured
repos in `GITHUB_REPOS` in `src/consts.ts`. Locally, pass a token or the page shows a placeholder:

```sh
GITHUB_TOKEN=$(gh auth token) npm run dev
```

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`: it builds the site and publishes `dist/` to the
`gh-pages` branch, which Cloudflare serves. It also rebuilds daily so the GitHub stats stay current.
Pull requests build but don't deploy.
