import {readFileSync} from "node:fs";
import {
  calculateAll,
  expectedAttempts,
  findResult
} from "./lib/unit-economics.mjs";

const load = (path) => JSON.parse(readFileSync(path, "utf8"));
const observations = load("economics/render-benchmark-observations.json");
const rates = load("economics/rates.json");
const scenarios = load("economics/scenarios.json");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(observations.observations.length >= 8, "expected measured renderer observations");
assert(rates.computeProfiles.githubActionsLinux2CorePrivate.usdPerMinute > 0, "compute rate must be positive");
assert(rates.storageProfiles.cloudflareR2Standard.usdPerGbMonth >= 0, "storage rate must be non-negative");
assert(Math.abs(expectedAttempts(0.05) - 1.0526315789473684) < 1e-12, "retry math regression");

const report = calculateAll({observations, rates, scenarios});

for (const scenario of scenarios.scenarios) {
  for (const renderer of ["remotion", "hyperframes"]) {
    const result = findResult(report, scenario.id, renderer);
    assert(result, `missing result for ${scenario.id}/${renderer}`);
    assert(result.monthlyTotalUsd > 0, `non-positive total for ${scenario.id}/${renderer}`);
    assert(result.infrastructureUsdPerRelease > 0, `non-positive release cost for ${scenario.id}/${renderer}`);
    assert(result.priceFloors["80"] > result.monthlyTotalUsd, "80% margin floor must exceed cost");
    assert(result.priceFloors["90"] > result.priceFloors["80"], "90% margin floor must exceed 80%");
  }
}

for (const scenarioId of [
  "single-vertical-en",
  "single-square-en",
  "single-landscape-en"
]) {
  const remotion = findResult(report, scenarioId, "remotion");
  const hyperframes = findResult(report, scenarioId, "hyperframes");
  assert(
    remotion.billedMinutesPerAttempt === hyperframes.billedMinutesPerAttempt,
    `${scenarioId} should demonstrate minute-rounding parity`
  );
}

const remotionPack = findResult(
  report,
  "launch-pack-3-formats-en",
  "remotion"
);
const hyperframesPack = findResult(
  report,
  "launch-pack-3-formats-en",
  "hyperframes"
);

assert(
  hyperframesPack.billedMinutesPerAttempt < remotionPack.billedMinutesPerAttempt,
  "3-format pack should preserve HyperFrames wall-time billing advantage"
);

const localizedRemotion = findResult(
  report,
  "localized-launch-pack",
  "remotion"
);
const localizedHyperframes = findResult(
  report,
  "localized-launch-pack",
  "hyperframes"
);

assert(
  localizedRemotion.billedMinutesPerAttempt === localizedHyperframes.billedMinutesPerAttempt,
  "localized pack should expose the current minute-rounding tie"
);

console.log(
  `[unit-economics] validated ${report.results.length} scenario/renderer calculations`
);
