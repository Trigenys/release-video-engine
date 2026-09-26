import assert from "node:assert/strict";
import {
  ingestGitHubRelease,
  listGitHubReleaseChoices,
  normalizedGitHubReleaseSchema,
  parseGitHubRepositoryUrl,
  toReleaseVideoSeed
} from "../src/ingestion/githubRelease.ts";

const repositories = [
  "https://github.com/remotion-dev/remotion",
  "https://github.com/vitejs/vite",
  "https://github.com/fastapi/fastapi"
];

assert.deepEqual(
  parseGitHubRepositoryUrl("https://github.com/remotion-dev/remotion"),
  {owner: "remotion-dev", repo: "remotion"}
);

assert.deepEqual(
  parseGitHubRepositoryUrl("git@github.com:remotion-dev/remotion.git"),
  {owner: "remotion-dev", repo: "remotion"}
);

for (const repositoryUrl of repositories) {
  const normalized = await ingestGitHubRelease(repositoryUrl);
  normalizedGitHubReleaseSchema.parse(normalized);
  assert.ok(normalized.release.tag);
  assert.ok(normalized.release.summary);
  assert.ok(normalized.content.highlights.length >= 1);
  assert.ok(normalized.content.highlights.length <= 4);

  const seed = toReleaseVideoSeed(normalized);
  assert.equal(seed.product.name, normalized.repository.name);
  assert.equal(seed.content.highlights.length, normalized.content.highlights.length);

  console.log(
    `[ingestion] ${normalized.repository.fullName} -> ${normalized.release.tag} · ${normalized.release.source} · ${normalized.content.highlights.length} highlight(s)`
  );
}

const choices = await listGitHubReleaseChoices(repositories[0]);
assert.ok(choices.length > 0);

const selected = await ingestGitHubRelease(repositories[0], {
  tag: choices[0].tag
});
assert.equal(selected.release.tag, choices[0].tag);

console.log(
  `[ingestion] explicit selection -> ${selected.repository.fullName}@${selected.release.tag}`
);
console.log("[ingestion] public GitHub validation passed");
