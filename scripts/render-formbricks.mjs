import {spawnSync} from "node:child_process";
import {mkdirSync, statSync} from "node:fs";
import {join} from "node:path";
import {performance} from "node:perf_hooks";

const renders = [
  {
    composition: "FormbricksRelease-601",
    format: "vertical",
    file: "formbricks-6.0.1-vertical.mp4"
  },
  {
    composition: "FormbricksRelease-601-square",
    format: "square",
    file: "formbricks-6.0.1-square.mp4"
  },
  {
    composition: "FormbricksRelease-601-landscape",
    format: "landscape",
    file: "formbricks-6.0.1-landscape.mp4"
  }
];

mkdirSync("out", {recursive: true});
const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const results = [];

for (const render of renders) {
  const output = join("out", render.file);
  const startedAt = performance.now();

  console.log(`\n[pilot] rendering ${render.format} -> ${output}`);

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
    {stdio: "inherit", env: process.env}
  );

  const durationMs = Math.round(performance.now() - startedAt);
  const success = result.status === 0;
  const bytes = success ? statSync(output).size : null;

  results.push({...render, success, durationMs, bytes});
}

console.log("\n[pilot] Formbricks render summary");
for (const result of results) {
  const size = result.bytes === null ? "n/a" : `${(result.bytes / 1024 / 1024).toFixed(2)} MiB`;
  console.log(`- ${result.format}: ${result.success ? "ok" : "failed"} · ${result.durationMs} ms · ${size}`);
}

if (results.some((result) => !result.success)) {
  process.exitCode = 1;
}
