import {mkdirSync, statSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {performance} from "node:perf_hooks";
import {spawnSync} from "node:child_process";

const CLI_VERSION = "0.8.62";
const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const renders = [
  {
    format: "vertical",
    project: "hyperframes/formbricks-6.0.1/vertical",
    file: "formbricks-6.0.1-hyperframes-vertical.mp4"
  },
  {
    format: "square",
    project: "hyperframes/formbricks-6.0.1/square",
    file: "formbricks-6.0.1-hyperframes-square.mp4"
  },
  {
    format: "landscape",
    project: "hyperframes/formbricks-6.0.1/landscape",
    file: "formbricks-6.0.1-hyperframes-landscape.mp4"
  }
];

mkdirSync("out", {recursive: true});
const results = [];

for (const render of renders) {
  const output = resolve("out", render.file);
  const project = resolve(render.project);
  const startedAt = performance.now();

  console.log(`\n[hyperframes] rendering ${render.format} -> ${output}`);

  const result = spawnSync(
    executable,
    [
      "--yes",
      `hyperframes@${CLI_VERSION}`,
      "render",
      project,
      "--output",
      output,
      "--quality",
      "standard",
      "--workers",
      "2"
    ],
    {
      stdio: "inherit",
      env: process.env
    }
  );

  const durationMs = Math.round(performance.now() - startedAt);
  const success = result.status === 0;
  const bytes = success ? statSync(output).size : null;

  results.push({
    renderer: "hyperframes",
    cliVersion: CLI_VERSION,
    format: render.format,
    project: render.project,
    file: render.file,
    success,
    durationMs,
    bytes
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  sourceSpec: "video/data/formbricks.ts#formbricksRelease",
  release: "Formbricks 6.0.1",
  results
};

writeFileSync(
  "out/formbricks-6.0.1-hyperframes-benchmark.json",
  JSON.stringify(report, null, 2)
);

console.log("\n[hyperframes] render summary");
for (const result of results) {
  const size =
    result.bytes === null
      ? "n/a"
      : `${(result.bytes / 1024 / 1024).toFixed(2)} MiB`;
  console.log(
    `- ${result.format}: ${result.success ? "ok" : "failed"} · ${result.durationMs} ms · ${size}`
  );
}

if (results.some((result) => !result.success)) {
  process.exitCode = 1;
}
