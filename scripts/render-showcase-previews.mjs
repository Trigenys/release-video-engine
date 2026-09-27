import {mkdirSync, statSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {join} from "node:path";
import {performance} from "node:perf_hooks";

const previews = [
  {
    composition: "Showcase-AgenFetch-v031-vertical",
    file: "agenfetch-v031-vertical.png"
  },
  {
    composition: "Showcase-Remotion-v40529-square",
    file: "remotion-v40529-square.png"
  },
  {
    composition: "Showcase-Vite-v831-landscape",
    file: "vite-v831-landscape.png"
  }
];

const outDir = "out/showcases";
mkdirSync(outDir, {recursive: true});
const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const results = [];

for (const preview of previews) {
  const output = join(outDir, preview.file);
  const started = performance.now();
  const result = spawnSync(
    executable,
    ["remotion", "still", "video/index.ts", preview.composition, output],
    {stdio: "inherit", env: process.env}
  );

  const durationMs = Math.round(performance.now() - started);
  const success = result.status === 0;
  const bytes = success ? statSync(output).size : null;
  results.push({...preview, success, durationMs, bytes});
}

console.log("\n[showcase] render summary");
for (const result of results) {
  console.log(
    `- ${result.composition}: ${result.success ? "ok" : "failed"} · ${result.durationMs} ms · ${result.bytes ?? "n/a"} bytes`
  );
}

if (results.some((result) => !result.success)) {
  process.exitCode = 1;
}
