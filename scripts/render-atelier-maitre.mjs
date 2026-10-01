import {spawnSync} from "node:child_process";
import {mkdirSync, statSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {performance} from "node:perf_hooks";

const renders = [
  {
    composition: "AtelierMaitre-General-FR",
    variant: "general",
    file: "atelier-maitre-demo-general-fr.mp4"
  },
  {
    composition: "AtelierMaitre-Fleet-FR",
    variant: "fleet",
    file: "atelier-maitre-demo-flotte-fr.mp4"
  }
];

mkdirSync("out/atelier-maitre", {recursive: true});
const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const results = [];

for (const render of renders) {
  const output = join("out/atelier-maitre", render.file);
  const startedAt = performance.now();

  console.log(`\n[atelier-maitre] rendering ${render.variant} -> ${output}`);

  const result = spawnSync(
    executable,
    [
      "remotion",
      "render",
      "video/index.ts",
      render.composition,
      output,
      "--codec=h264",
      "--crf=22",
      "--concurrency=2"
    ],
    {stdio: "inherit", env: process.env}
  );

  const durationMs = Math.round(performance.now() - startedAt);
  const success = result.status === 0;
  const bytes = success ? statSync(output).size : null;
  results.push({...render, success, durationMs, bytes});
}

writeFileSync(
  "out/atelier-maitre/render-summary.json",
  JSON.stringify({generatedAt: new Date().toISOString(), results}, null, 2)
);

console.log("\n[atelier-maitre] render summary");
for (const result of results) {
  const size =
    result.bytes === null
      ? "n/a"
      : `${(result.bytes / 1024 / 1024).toFixed(2)} MiB`;
  console.log(
    `- ${result.variant}: ${result.success ? "ok" : "failed"} · ${result.durationMs} ms · ${size}`
  );
}

if (results.some((result) => !result.success)) {
  process.exitCode = 1;
}
