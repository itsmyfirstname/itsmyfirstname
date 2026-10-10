import { GITHUB_USER, GITHUB_REPOS } from "../consts";

export interface Repo {
  nameWithOwner: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
}

export interface GitHubStats {
  stars: number;
  commitsLastYear: number;
  pullRequests: number;
  issues: number;
  contributedTo: number;
  repos: Repo[];
}

const repoFields = "nameWithOwner description url stargazerCount forkCount primaryLanguage { name color }";

let cached: Promise<GitHubStats | null> | undefined;

/**
 * Fetches profile stats and featured repos from the GitHub GraphQL API at build time.
 * Needs GITHUB_TOKEN (set automatically in Actions; locally: `GITHUB_TOKEN=$(gh auth token) npm run dev`).
 * Returns null instead of failing the build when the token is missing or the API errors.
 */
export function getGitHubStats(): Promise<GitHubStats | null> {
  cached ??= load();
  return cached;
}

async function load(): Promise<GitHubStats | null> {
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[github] GITHUB_TOKEN not set, skipping GitHub stats");
    return null;
  }

  const repoQueries = GITHUB_REPOS.map((full, i) => {
    const [owner, name] = full.split("/");
    return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${repoFields} }`;
  }).join("\n");

  const query = `{
    user(login: ${JSON.stringify(GITHUB_USER)}) {
      pullRequests { totalCount }
      issues { totalCount }
      contributionsCollection { totalCommitContributions restrictedContributionsCount }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) { totalCount }
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) { nodes { stargazerCount } }
    }
    ${repoQueries}
  }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json));

    const { user, ...repos } = json.data;
    return {
      stars: user.repositories.nodes.reduce((sum: number, r: { stargazerCount: number }) => sum + r.stargazerCount, 0),
      commitsLastYear:
        user.contributionsCollection.totalCommitContributions +
        user.contributionsCollection.restrictedContributionsCount,
      pullRequests: user.pullRequests.totalCount,
      issues: user.issues.totalCount,
      contributedTo: user.repositoriesContributedTo.totalCount,
      repos: Object.values(repos).filter(Boolean) as Repo[],
    };
  } catch (err) {
    console.warn(`[github] failed to fetch stats: ${err}`);
    return null;
  }
}
