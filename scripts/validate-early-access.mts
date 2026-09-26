import assert from "node:assert/strict";
import {
  normalizedLeadKey,
  validateEarlyAccessPayload
} from "../shared/earlyAccess.ts";

const valid = validateEarlyAccessPayload({
  email: " Founder@Example.com ",
  repositoryUrl: "https://github.com/example/product",
  releaseFrequency: "weekly",
  source: "linkedin",
  campaign: "release-pilot"
});

assert.equal(valid.ok, true);
assert.equal(valid.data?.email, "founder@example.com");

const keyA = normalizedLeadKey(valid.data!);
const keyB = normalizedLeadKey({
  ...valid.data!,
  repositoryUrl: "https://github.com/example/product.git"
});

assert.equal(keyA, keyB);

const invalidRepo = validateEarlyAccessPayload({
  email: "founder@example.com",
  repositoryUrl: "https://gitlab.com/example/product",
  releaseFrequency: "weekly"
});
assert.equal(invalidRepo.ok, false);
assert.ok(invalidRepo.errors?.repositoryUrl);

const invalidFrequency = validateEarlyAccessPayload({
  email: "founder@example.com",
  repositoryUrl: "https://github.com/example/product",
  releaseFrequency: "daily"
});
assert.equal(invalidFrequency.ok, false);
assert.ok(invalidFrequency.errors?.releaseFrequency);

console.log("[funnel] early-access validation passed");
