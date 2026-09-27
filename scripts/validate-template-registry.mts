import assert from "node:assert/strict";
import {
  creativeTemplateRegistry,
  explorerRelease,
  getCreativeTemplate
} from "../src/data/templateDirections.ts";

assert.ok(creativeTemplateRegistry.length >= 3, "At least three creative directions are required");
assert.ok(Object.isFrozen(explorerRelease), "Explorer release facts must be frozen");

const ids = new Set<string>();
for (const template of creativeTemplateRegistry) {
  assert.ok(!ids.has(template.id), "Duplicate template id: " + template.id);
  assert.equal(template.version, "1");
  assert.ok(template.presentation.surface);
  assert.ok(template.presentation.ink);
  assert.ok(template.presentation.primary);
  assert.ok(template.presentation.typeStyle);
  ids.add(template.id);
  assert.equal(getCreativeTemplate(template.id).id, template.id);
}

assert.ok(explorerRelease.product);
assert.ok(explorerRelease.version);
assert.ok(explorerRelease.title);
assert.ok(explorerRelease.summary);
assert.equal(new URL(explorerRelease.sourceUrl).hostname, "github.com");

console.log(
  "[templates] " + creativeTemplateRegistry.length + " directions validated against one immutable release payload"
);
