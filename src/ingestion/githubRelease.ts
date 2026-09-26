import * as z from "zod";

const API = "https://api.github.com";
const API_VERSION = "2026-03-10";

const repositorySchema = z.object({
  name: z.string().min(1),
  full_name: z.string().min(3),
  html_url: z.url(),
  description: z.string().nullable(),
  default_branch: z.string().min(1)
});

const releaseSchema = z.object({
  tag_name: z.string().min(1),
  name: z.string().nullable(),
  body: z.string().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  created_at: z.string().nullable(),
  published_at: z.string().nullable()
});

const tagSchema = z.object({
  name: z.string().min(1),
  commit: z.object({sha: z.string().min(7), url: z.url()})
});

export const normalizedGitHubReleaseSchema = z.object({
  schemaVersion: z.literal("1"),
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    fullName: z.string().min(3),
    url: z.url(),
    description: z.string().nullable(),
    defaultBranch: z.string().min(1)
  }),
  release: z.object({
    source: z.enum(["release", "tag"]),
    tag: z.string().min(1),
    title: z.string().min(1),
    publishedAt: z.string().nullable(),
    prerelease: z.boolean(),
    summary: z.string().min(1)
  }),
  content: z.object({
    highlights: z.array(z.object({
      value: z.string().min(1),
      label: z.string().min(1)
    })).min(1).max(4)
  })
});

export type NormalizedGitHubRelease = z.infer<typeof normalizedGitHubReleaseSchema>;
export interface GitHubRepositoryRef { owner: string; repo: string; }
export interface ReleaseChoice {
  tag: string;
  title: string;
  source: "release" | "tag";
  publishedAt: string | null;
  prerelease: boolean;
}
export interface GitHubReleaseIngestionOptions {
  tag?: string;
  token?: string;
  fetch?: typeof fetch;
}

export interface ReleaseVideoSeed {
  product: {
    name: string;
    version: string;
    repository: string;
  };
  release: {
    title: string;
    summary: string;
    publishedAt?: string;
  };
  content: NormalizedGitHubRelease["content"];
}

type ErrorCode =
  | "invalid_repository_url"
  | "repository_not_found"
  | "release_not_found"
  | "no_release_available"
  | "rate_limited"
  | "github_forbidden"
  | "github_unavailable"
  | "invalid_github_payload";

export class GitHubReleaseIngestionError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly status?: number,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "GitHubReleaseIngestionError";
  }
}

export function parseGitHubRepositoryUrl(input: string): GitHubRepositoryRef {
  const value = input.trim();
  const ssh = value.match(/^git@github\.com:([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
  if (ssh) return {owner: ssh[1], repo: ssh[2]};

  let url: URL;
  try {
    url = new URL(value);
  } catch (cause) {
    throw new GitHubReleaseIngestionError(
      "invalid_repository_url",
      "Use a GitHub repository URL such as https://github.com/owner/repo.",
      undefined,
      {cause}
    );
  }

  if (url.hostname.toLowerCase() !== "github.com") {
    throw new GitHubReleaseIngestionError(
      "invalid_repository_url",
      "Only github.com repository URLs are supported in the public MVP."
    );
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new GitHubReleaseIngestionError(
      "invalid_repository_url",
      "GitHub repository URL must include owner and repository name."
    );
  }

  return {owner: parts[0], repo: parts[1].replace(/\.git$/i, "")};
}

class GitHubClient {
  private readonly requestFetch: typeof fetch;
  private readonly token?: string;

  constructor(options: GitHubReleaseIngestionOptions = {}) {
    this.requestFetch = options.fetch ?? fetch;
    this.token = options.token;
  }

  private async get(path: string, allow404 = false): Promise<unknown | null> {
    let response: Response;
    try {
      response = await this.requestFetch(`${API}${path}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": API_VERSION,
          ...(this.token ? {Authorization: `Bearer ${this.token}`} : {})
        }
      });
    } catch (cause) {
      throw new GitHubReleaseIngestionError(
        "github_unavailable",
        "GitHub could not be reached. Check the network and retry.",
        undefined,
        {cause}
      );
    }

    if (response.status === 404 && allow404) return null;
    if (response.status === 404) {
      throw new GitHubReleaseIngestionError(
        "repository_not_found",
        "Repository was not found or is not publicly accessible.",
        404
      );
    }
    if (response.status === 403) {
      const limited = response.headers.get("x-ratelimit-remaining") === "0";
      throw new GitHubReleaseIngestionError(
        limited ? "rate_limited" : "github_forbidden",
        limited
          ? "GitHub public API rate limit reached. Retry after the reset window."
          : "GitHub refused the request. The repository may require authentication.",
        403
      );
    }
    if (!response.ok) {
      throw new GitHubReleaseIngestionError(
        "github_unavailable",
        `GitHub returned HTTP ${response.status}.`,
        response.status
      );
    }
    return response.json();
  }

  private parse<T>(schema: z.ZodType<T>, payload: unknown): T {
    const result = schema.safeParse(payload);
    if (!result.success) {
      throw new GitHubReleaseIngestionError(
        "invalid_github_payload",
        "GitHub returned an unexpected API payload.",
        undefined,
        {cause: result.error}
      );
    }
    return result.data;
  }

  async repository(ref: GitHubRepositoryRef) {
    return this.parse(
      repositorySchema,
      await this.get(`/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}`)
    );
  }

  async latestRelease(ref: GitHubRepositoryRef) {
    const payload = await this.get(
      `/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/releases/latest`,
      true
    );
    return payload === null ? null : this.parse(releaseSchema, payload);
  }

  async releaseByTag(ref: GitHubRepositoryRef, tag: string) {
    const payload = await this.get(
      `/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/releases/tags/${encodeURIComponent(tag)}`,
      true
    );
    return payload === null ? null : this.parse(releaseSchema, payload);
  }

  async releases(ref: GitHubRepositoryRef) {
    return this.parse(
      z.array(releaseSchema),
      await this.get(`/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/releases?per_page=100`)
    );
  }

  async tags(ref: GitHubRepositoryRef, perPage = 100) {
    return this.parse(
      z.array(tagSchema),
      await this.get(`/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}/tags?per_page=${perPage}`)
    );
  }
}

export async function listGitHubReleaseChoices(
  repositoryUrl: string,
  options: Omit<GitHubReleaseIngestionOptions, "tag"> = {}
): Promise<ReleaseChoice[]> {
  const ref = parseGitHubRepositoryUrl(repositoryUrl);
  const client = new GitHubClient(options);
  await client.repository(ref);

  const [releases, tags] = await Promise.all([client.releases(ref), client.tags(ref)]);
  const seen = new Set<string>();
  const choices: ReleaseChoice[] = [];

  for (const release of releases) {
    if (release.draft || seen.has(release.tag_name)) continue;
    seen.add(release.tag_name);
    choices.push({
      tag: release.tag_name,
      title: release.name?.trim() || release.tag_name,
      source: "release",
      publishedAt: release.published_at,
      prerelease: release.prerelease
    });
  }

  for (const tag of tags) {
    if (seen.has(tag.name)) continue;
    seen.add(tag.name);
    choices.push({
      tag: tag.name,
      title: tag.name,
      source: "tag",
      publishedAt: null,
      prerelease: false
    });
  }

  return choices;
}

export async function ingestGitHubRelease(
  repositoryUrl: string,
  options: GitHubReleaseIngestionOptions = {}
): Promise<NormalizedGitHubRelease> {
  const ref = parseGitHubRepositoryUrl(repositoryUrl);
  const client = new GitHubClient(options);
  const repository = await client.repository(ref);

  if (options.tag?.trim()) {
    const requestedTag = options.tag.trim();
    const release = await client.releaseByTag(ref, requestedTag);
    if (release) return normalizeRelease(ref, repository, release);

    const tags = await client.tags(ref);
    if (tags.some((tag) => tag.name === requestedTag)) {
      return normalizeTag(ref, repository, requestedTag);
    }

    throw new GitHubReleaseIngestionError(
      "release_not_found",
      `Release or tag "${requestedTag}" was not found.`
    );
  }

  const latest = await client.latestRelease(ref);
  if (latest) return normalizeRelease(ref, repository, latest);

  const tags = await client.tags(ref, 1);
  if (!tags[0]) {
    throw new GitHubReleaseIngestionError(
      "no_release_available",
      "Repository has no published GitHub Release and no Git tag fallback."
    );
  }

  return normalizeTag(ref, repository, tags[0].name);
}

function normalizeRelease(
  ref: GitHubRepositoryRef,
  repository: z.infer<typeof repositorySchema>,
  release: z.infer<typeof releaseSchema>
): NormalizedGitHubRelease {
  const body = release.body?.trim() ?? "";
  const highlights = extractHighlights(body);
  const summary =
    extractSummary(body) ??
    repository.description?.trim() ??
    `${repository.name} ${release.tag_name} release.`;

  return normalizedGitHubReleaseSchema.parse({
    schemaVersion: "1",
    repository: {
      owner: ref.owner,
      name: repository.name,
      fullName: repository.full_name,
      url: repository.html_url,
      description: repository.description,
      defaultBranch: repository.default_branch
    },
    release: {
      source: "release",
      tag: release.tag_name,
      title: release.name?.trim() || release.tag_name,
      publishedAt: release.published_at ?? release.created_at,
      prerelease: release.prerelease,
      summary
    },
    content: {
      highlights: highlights.length
        ? highlights
        : [{value: release.tag_name, label: "Published GitHub release"}]
    }
  });
}

function normalizeTag(
  ref: GitHubRepositoryRef,
  repository: z.infer<typeof repositorySchema>,
  tag: string
): NormalizedGitHubRelease {
  return normalizedGitHubReleaseSchema.parse({
    schemaVersion: "1",
    repository: {
      owner: ref.owner,
      name: repository.name,
      fullName: repository.full_name,
      url: repository.html_url,
      description: repository.description,
      defaultBranch: repository.default_branch
    },
    release: {
      source: "tag",
      tag,
      title: tag,
      publishedAt: null,
      prerelease: false,
      summary:
        repository.description?.trim() ??
        `${repository.name} release tagged ${tag}.`
    },
    content: {
      highlights: [{
        value: tag,
        label: "Git tag fallback — no published GitHub Release notes available"
      }]
    }
  });
}

export function toReleaseVideoSeed(
  normalized: NormalizedGitHubRelease
): ReleaseVideoSeed {
  return {
    product: {
      name: normalized.repository.name,
      version: normalized.release.tag,
      repository: normalized.repository.url
    },
    release: {
      title: normalized.release.title,
      summary: normalized.release.summary,
      ...(normalized.release.publishedAt
        ? {publishedAt: normalized.release.publishedAt}
        : {})
    },
    content: normalized.content
  };
}

function extractSummary(markdown: string): string | null {
  const paragraph = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(
      (line) =>
        line.length > 0 &&
        !/^#{1,6}\s+/.test(line) &&
        !/^[-*+]\s+/.test(line) &&
        !/^\d+[.)]\s+/.test(line)
    );

  return paragraph ? clamp(cleanMarkdown(paragraph), 240) : null;
}

function extractHighlights(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*+]\s+/.test(line) || /^\d+[.)]\s+/.test(line))
    .map((line) => line.replace(/^([-*+]|\d+[.)])\s+/, ""))
    .map(cleanMarkdown)
    .filter((line) => line.length >= 8)
    .slice(0, 4)
    .map(toHighlight);
}

function toHighlight(text: string) {
  const colon = text.indexOf(":");
  if (colon > 0 && colon <= 48) {
    const value = clamp(text.slice(0, colon), 42);
    const label = clamp(text.slice(colon + 1), 120);
    if (value && label) return {value, label};
  }

  const words = text.split(/\s+/);
  return {
    value: clamp(words.slice(0, 5).join(" "), 42),
    label: clamp(words.slice(5).join(" ") || "Release highlight", 120)
  };
}

function cleanMarkdown(input: string): string {
  return input
    .replace(/^#{1,6}\s+/, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_~`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(input: string, maxLength: number): string {
  const value = input.replace(/\s+/g, " ").trim();
  return value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}
