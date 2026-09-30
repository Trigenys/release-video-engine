import {readFileSync, writeFileSync} from "node:fs";

const remotion = JSON.parse(
  readFileSync("out/formbricks-6.0.1-media-heavy-remotion-benchmark.json", "utf8")
);
const hyperframes = JSON.parse(
  readFileSync("out/formbricks-6.0.1-media-heavy-hyperframes-benchmark.json", "utf8")
);

function totals(report) {
  return report.results.reduce(
    (acc, item) => {
      acc.durationMs += item.durationMs ?? 0;
      acc.bytes += item.bytes ?? 0;
      acc.cpuUserSeconds += item.cpuUserSeconds ?? 0;
      acc.cpuSystemSeconds += item.cpuSystemSeconds ?? 0;
      acc.peakRssKb = Math.max(acc.peakRssKb, item.peakRssKb ?? 0);
      return acc;
    },
    {
      durationMs: 0,
      bytes: 0,
      cpuUserSeconds: 0,
      cpuSystemSeconds: 0,
      peakRssKb: 0
    }
  );
}

const remotionTotals = totals(remotion);
const hyperframesTotals = totals(hyperframes);

const pairs = remotion.results.map((left) => {
  const right = hyperframes.results.find(
    (candidate) =>
      candidate.format === left.format && candidate.locale === left.locale
  );

  if (!right) {
    throw new Error(`Missing HyperFrames result for ${left.format}/${left.locale}`);
  }

  return {
    format: left.format,
    locale: left.locale,
    remotion: left,
    hyperframes: right,
    hyperframesSpeedup:
      right.durationMs > 0 ? left.durationMs / right.durationMs : null,
    outputSizeDeltaPct:
      left.bytes && right.bytes
        ? ((right.bytes - left.bytes) / left.bytes) * 100
        : null,
    peakRssDeltaPct:
      left.peakRssKb && right.peakRssKb
        ? ((right.peakRssKb - left.peakRssKb) / left.peakRssKb) * 100
        : null
  };
});

const comparison = {
  generatedAt: new Date().toISOString(),
  release: "Formbricks 6.0.1 media-heavy",
  totals: {
    remotion: remotionTotals,
    hyperframes: hyperframesTotals,
    hyperframesSpeedup:
      hyperframesTotals.durationMs > 0
        ? remotionTotals.durationMs / hyperframesTotals.durationMs
        : null,
    outputSizeDeltaPct:
      remotionTotals.bytes > 0
        ? ((hyperframesTotals.bytes - remotionTotals.bytes) /
            remotionTotals.bytes) *
          100
        : null,
    peakRssDeltaPct:
      remotionTotals.peakRssKb > 0
        ? ((hyperframesTotals.peakRssKb - remotionTotals.peakRssKb) /
            remotionTotals.peakRssKb) *
          100
        : null
  },
  pairs
};

writeFileSync(
  "out/media-heavy-renderer-comparison.json",
  JSON.stringify(comparison, null, 2)
);

const fmtSeconds = (ms) => `${(ms / 1000).toFixed(3)} s`;
const fmtMib = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
const fmtPct = (value) => (value === null ? "n/a" : `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`);

const rows = pairs
  .map(
    (pair) =>
      `| ${pair.format} | ${pair.locale.toUpperCase()} | ${fmtSeconds(
        pair.remotion.durationMs
      )} | ${fmtSeconds(pair.hyperframes.durationMs)} | ${pair.hyperframesSpeedup?.toFixed(
        2
      )}× | ${fmtPct(pair.outputSizeDeltaPct)} | ${fmtPct(pair.peakRssDeltaPct)} |`
  )
  .join("\n");

const markdown = `# Media-heavy renderer comparison

| Format | Locale | Remotion | HyperFrames | HF speedup | HF size delta | HF peak RSS delta |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${rows}

## Totals

- Remotion wall time: **${fmtSeconds(remotionTotals.durationMs)}**
- HyperFrames wall time: **${fmtSeconds(hyperframesTotals.durationMs)}**
- HyperFrames speedup: **${comparison.totals.hyperframesSpeedup?.toFixed(2)}×**
- Remotion aggregate output: **${fmtMib(remotionTotals.bytes)}**
- HyperFrames aggregate output: **${fmtMib(hyperframesTotals.bytes)}**
- HyperFrames aggregate size delta: **${fmtPct(comparison.totals.outputSizeDeltaPct)}**
- Remotion peak RSS (max single render): **${(remotionTotals.peakRssKb / 1024).toFixed(1)} MiB**
- HyperFrames peak RSS (max single render): **${(hyperframesTotals.peakRssKb / 1024).toFixed(1)} MiB**
- HyperFrames peak RSS delta: **${fmtPct(comparison.totals.peakRssDeltaPct)}**
- Remotion CPU time: **${(remotionTotals.cpuUserSeconds + remotionTotals.cpuSystemSeconds).toFixed(2)} s**
- HyperFrames CPU time: **${(hyperframesTotals.cpuUserSeconds + hyperframesTotals.cpuSystemSeconds).toFixed(2)} s**

These figures are CI observations for this benchmark, not universal renderer guarantees.
`;

writeFileSync("out/media-heavy-renderer-comparison.md", markdown);
console.log(markdown);
