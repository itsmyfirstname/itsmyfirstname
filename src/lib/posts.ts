import { getCollection } from "astro:content";

/** Published posts, newest first. Drafts are included only in dev. */
export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
