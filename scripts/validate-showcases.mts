import assert from "node:assert/strict";
import {releaseShowcases} from "../src/data/releaseShowcases.ts";

assert.ok(releaseShowcases.length >= 3, "At least three showcases are required");

const ids = new Set<string>();
const compositions = new Set<string>();
const formats = new Set<string>();

for (const showcase of releaseShowcases) {
  assert.equal(showcase.publicDemo, true, showcase.id + " must be labeled as a public demo");
  assert.ok(!ids.has(showcase.id), "Duplicate showcase id: " + showcase.id);
  assert.ok(
    !compositions.has(showcase.renderCompositionId),
    "Duplicate render composition: " + showcase.renderCompositionId
  );

  const repository = new URL(showcase.repositoryUrl);
  const release = new URL(showcase.releaseUrl);

  assert.equal(repository.hostname, "github.com");
  assert.equal(release.hostname, "github.com");
  assert.ok(showcase.previewSrc.startsWith("/showcases/"));

  ids.add(showcase.id);
  compositions.add(showcase.renderCompositionId);
  formats.add(showcase.format);
}

assert.deepEqual(
  [...formats].sort(),
  ["1:1", "16:9", "9:16"].sort(),
  "Gallery must visibly cover 9:16, 1:1 and 16:9"
);

console.log(
  "[showcase] " + releaseShowcases.length + " public demos validated across " + formats.size + " formats"
);
