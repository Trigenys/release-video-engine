export function observationKey(renderer, format, locale) {
  return `${renderer}:${format}:${locale}`;
}

export function indexObservations(observations) {
  return new Map(
    observations.map((item) => [
      observationKey(item.renderer, item.format, item.locale),
      item
    ])
  );
}

export function expectedAttempts(retryProbability) {
  if (retryProbability < 0 || retryProbability >= 1) {
    throw new Error("retryProbability must be >= 0 and < 1");
  }

  return 1 / (1 - retryProbability);
}

function moneyFloor(cost, margin) {
  if (margin <= 0 || margin >= 1) {
    throw new Error("gross margin target must be between 0 and 1");
  }

  return cost / (1 - margin);
}

export function calculateScenario({
  observations,
  rates,
  defaults,
  scenario,
  renderer
}) {
  const observationIndex = indexObservations(observations);
  const compute = rates.computeProfiles.githubActionsLinux2CorePrivate;
  const storage = rates.storageProfiles.cloudflareR2Standard;
  const retryProbability =
    scenario.retryProbability ?? defaults.retryProbability;
  const retentionDays = scenario.retentionDays ?? defaults.retentionDays;
  const readsPerOutput =
    scenario.readsPerOutput ?? defaults.readsPerOutput;
  const externalApiUsdPerOutput =
    scenario.externalApiUsdPerOutput ?? defaults.externalApiUsdPerOutput;
  const setupSecondsByRenderer = {
    ...defaults.setupSecondsByRenderer,
    ...(scenario.setupSecondsByRenderer ?? {})
  };

  const selected = scenario.outputs.map(({format, locale}) => {
    const found = observationIndex.get(
      observationKey(renderer, format, locale)
    );

    if (!found) {
      throw new Error(
        `No observation for ${renderer} ${format}/${locale}`
      );
    }

    return found;
  });

  const measuredRenderSeconds =
    selected.reduce((sum, item) => sum + item.durationMs, 0) / 1000;
  const outputBytes = selected.reduce((sum, item) => sum + item.bytes, 0);
  const cpuSeconds = selected.reduce(
    (sum, item) =>
      sum + item.cpuUserSeconds + item.cpuSystemSeconds,
    0
  );
  const peakRssKb = Math.max(...selected.map((item) => item.peakRssKb));
  const setupSeconds = setupSecondsByRenderer[renderer] ?? 0;
  const secondsPerAttempt = measuredRenderSeconds + setupSeconds;

  if (compute.billingModel !== "rounded-job-minute") {
    throw new Error(
      `Unsupported compute billing model: ${compute.billingModel}`
    );
  }

  const billingUnits = Math.ceil(
    secondsPerAttempt / compute.roundingSeconds
  );
  const billedMinutesPerAttempt =
    (billingUnits * compute.roundingSeconds) / 60;
  const computeUsdPerAttempt =
    billedMinutesPerAttempt * compute.usdPerMinute;
  const attempts = expectedAttempts(retryProbability);
  const releasesPerMonth = scenario.releasesPerCustomerMonth;
  const expectedComputeUsdPerRelease =
    computeUsdPerAttempt * attempts;
  const monthlyComputeUsd =
    expectedComputeUsdPerRelease * releasesPerMonth;

  const successfulOutputsPerMonth =
    selected.length * releasesPerMonth;
  const retainedGbMonths =
    (outputBytes * releasesPerMonth * (retentionDays / 30)) /
    1_000_000_000;
  const monthlyStorageUsd =
    retainedGbMonths * storage.usdPerGbMonth;

  const classAWrites = successfulOutputsPerMonth;
  const classBReads = successfulOutputsPerMonth * readsPerOutput;
  const monthlyClassAUsd =
    (classAWrites / 1_000_000) * storage.classAUsdPerMillion;
  const monthlyClassBUsd =
    (classBReads / 1_000_000) * storage.classBUsdPerMillion;

  const monthlyEgressGb =
    (outputBytes * releasesPerMonth * readsPerOutput) /
    1_000_000_000;
  const monthlyEgressUsd =
    monthlyEgressGb * storage.egressUsdPerGb;

  const monthlyExternalApiUsd =
    successfulOutputsPerMonth * externalApiUsdPerOutput;

  const monthlyStorageAndDeliveryUsd =
    monthlyStorageUsd +
    monthlyClassAUsd +
    monthlyClassBUsd +
    monthlyEgressUsd;

  const monthlyTotalUsd =
    monthlyComputeUsd +
    monthlyStorageAndDeliveryUsd +
    monthlyExternalApiUsd;
  const infrastructureUsdPerRelease =
    monthlyTotalUsd / releasesPerMonth;
  const infrastructureUsdPerOutput =
    monthlyTotalUsd / successfulOutputsPerMonth;

  return {
    scenarioId: scenario.id,
    description: scenario.description,
    renderer,
    outputCountPerRelease: selected.length,
    releasesPerCustomerMonth: releasesPerMonth,
    retryProbability,
    expectedAttemptsPerRelease: attempts,
    measuredRenderSeconds,
    setupSeconds,
    secondsPerAttempt,
    billedMinutesPerAttempt,
    computeUsdPerAttempt,
    expectedComputeUsdPerRelease,
    monthlyComputeUsd,
    outputBytesPerRelease: outputBytes,
    outputMiBPerRelease: outputBytes / 1024 / 1024,
    cpuSecondsPerRelease: cpuSeconds,
    peakRssMiB: peakRssKb / 1024,
    retentionDays,
    readsPerOutput,
    retainedGbMonths,
    monthlyStorageUsd,
    classAWrites,
    classBReads,
    monthlyClassAUsd,
    monthlyClassBUsd,
    monthlyEgressGb,
    monthlyEgressUsd,
    monthlyStorageAndDeliveryUsd,
    monthlyExternalApiUsd,
    monthlyTotalUsd,
    infrastructureUsdPerRelease,
    infrastructureUsdPerOutput,
    priceFloors: Object.fromEntries(
      rates.targetGrossMargins.map((margin) => [
        String(Math.round(margin * 100)),
        moneyFloor(monthlyTotalUsd, margin)
      ])
    )
  };
}

export function calculateAll({observations, rates, scenarios}) {
  const renderers = [...new Set(
    observations.observations.map((item) => item.renderer)
  )].sort();

  const results = [];

  for (const scenario of scenarios.scenarios) {
    for (const renderer of renderers) {
      results.push(
        calculateScenario({
          observations: observations.observations,
          rates,
          defaults: scenarios.defaults,
          scenario,
          renderer
        })
      );
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    benchmarkSource: observations.source,
    ratesAsOf: rates.asOf,
    currency: rates.currency,
    assumptions: {
      computeProfile: "githubActionsLinux2CorePrivate",
      storageProfile: "cloudflareR2Standard",
      freeTiersExcluded: true,
      setupAssumption: scenarios.defaults.setupAssumption
    },
    results
  };
}

export function findResult(report, scenarioId, renderer) {
  return report.results.find(
    (item) =>
      item.scenarioId === scenarioId &&
      item.renderer === renderer
  );
}
