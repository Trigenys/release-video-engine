import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {calculateAll} from "./lib/unit-economics.mjs";

function load(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function usd(value, digits = 4) {
  return `$${value.toFixed(digits)}`;
}

function seconds(value) {
  return `${value.toFixed(1)}s`;
}

const observations = load("economics/render-benchmark-observations.json");
const rates = load("economics/rates.json");
const scenarios = load("economics/scenarios.json");

const report = calculateAll({observations, rates, scenarios});

mkdirSync("out", {recursive: true});
writeFileSync(
  "out/unit-economics-report.json",
  JSON.stringify(report, null, 2)
);

const rows = report.results
  .map(
    (item) =>
      `| ${item.scenarioId} | ${item.renderer} | ${item.outputCountPerRelease} | ${seconds(item.measuredRenderSeconds)} | ${seconds(item.setupSeconds)} | ${item.billedMinutesPerAttempt.toFixed(0)} | ${usd(item.monthlyComputeUsd)} | ${usd(item.monthlyStorageAndDeliveryUsd, 6)} | ${usd(item.monthlyTotalUsd)} | ${usd(item.infrastructureUsdPerRelease)} | ${usd(item.priceFloors["80"])} | ${usd(item.priceFloors["90"])} |`
  )
  .join("\n");

const markdown = `# Release Video Engine — unit economics report

Generated: ${report.generatedAt}

Rates as of: **${report.ratesAsOf}**

This is an infrastructure-cost model, not a product price recommendation. It excludes labor, support, payment processing, taxes, sales/marketing and profit beyond the displayed gross-margin floor.

| Scenario | Renderer | Outputs/release | Measured render | Setup assumption | Billed min/attempt | Monthly compute | Monthly storage + delivery | Monthly infra | Infra/release | 80% GM floor | 90% GM floor |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}

## Model notes

- Compute uses the configured paid GitHub Actions Linux 2-core rate and rounds each release job to whole billed minutes.
- Retry overhead uses expected attempts = 1 / (1 - retryProbability).
- R2 free-tier allowances are excluded, so the report represents marginal cost rather than today's subsidized bill.
- R2 egress is modeled from the configured rate (currently zero).
- External API cost is zero in the current deterministic pipeline but is represented explicitly in the model.
- Setup time is separated from measured render time and remains configurable per renderer.
`;

writeFileSync("out/unit-economics-report.md", markdown);
console.log(markdown);
