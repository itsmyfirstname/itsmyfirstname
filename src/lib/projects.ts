import { getCollection } from "astro:content";

/** Published projects, by `order` then newest start date. Drafts are included only in dev. */
export async function getProjects() {
  const projects = await getCollection("projects", ({ data }) => import.meta.env.DEV || !data.draft);
  return projects.sort(
    (a, b) =>
      a.data.order - b.data.order || (b.data.startDate?.valueOf() ?? 0) - (a.data.startDate?.valueOf() ?? 0),
  );
}

/** "Mar 2024 – Jan 2025", "Mar 2024 – present", or "" when there's no start date. */
export function projectDates(start?: Date, end?: Date) {
  if (!start) return "";
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${end ? fmt(end) : "present"}`;
}
