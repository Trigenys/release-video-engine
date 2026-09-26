import {spawnSync} from "node:child_process";
import {mkdirSync, statSync} from "node:fs";
import {join} from "node:path";
import {performance} from "node:perf_hooks";

const renders = [
  {
    composition: "AgenFetchRelease-v031",
    format: "vertical",
    file: "agenfetch-v0.3.1-vertical.mp4"
  },
  {
    composition: "AgenFetchRelease-v031-square",
    format: "square",
    file: "agenfetch-v0.3.1-square.mp4"
  },
  {
    composition: "AgenFetchRelease-v031-landscape",
    format: "landscape",
    file: "agenfetch-v0.3.1-landscape.mp4"
  }
];

const outDir = "out";
mkdirSync(outDir, {recursive: true});

const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const results = [];

for (const render of renders) {
  const output = join(outDir, render.file);
  const startedAt = performance.now();

  console.log(
    `\n[release-video] rendering ${render.format} -> ${output}`
  );

  const result = spawnSync(
    executable,
    [
      "remotion",
      "render",
      "video/index.ts",
      render.composition,
      output,
      "--codec=h264",
      "--crf=20",
      "--concurrency=2"
    ],
    {
      stdio: "inherit",
      env: process.env
    }
  );

  const durationMs = Math.round(performance.now() - startedAt);
  const success = result.status === 0;
  let bytes = null;

  if (success) {
    bytes = statSync(output).size;
  }

  results.push({
    ...render,
    success,
    durationMs,
    bytes
  });
}

console.log("\n[release-video] render summary");
for (const result of results) {
  const size = result.bytes === null
    ? "n/a"
    : `${(result.bytes / 1024 / 1024).toFixed(2)} MiB`;

  console.log(
    `- ${result.format}: ${result.success ? "ok" : "failed"} · ${result.durationMs} ms · ${size}`
  );
}

const failures = results.filter((result) => !result.success);

if (failures.length > 0) {
  console.error(
    `[release-video] ${failures.length} format(s) failed: ${failures
      .map((result) => result.format)
      .join(", ")}`
  );
  process.exitCode = 1;
}
