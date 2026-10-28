import {spawnSync} from "node:child_process";
import {mkdirSync, statSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {performance} from "node:perf_hooks";

mkdirSync("out/atelier-maitre", {recursive: true});

const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const output = join("out/atelier-maitre", "atelier-maitre-demo-rapide-fr.mp4");
const startedAt = performance.now();

console.log(`[atelier-maitre-quick] rendering -> ${output}`);

const result = spawnSync(
  executable,
  [
    "remotion",
    "render",
    "video/index.ts",
    "AtelierMaitre-Quick-FR",
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

writeFileSync(
  "out/atelier-maitre/quick-render-summary.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      composition: "AtelierMaitre-Quick-FR",
      output,
      success,
      durationMs,
      bytes
    },
    null,
    2
  )
);

console.log(
  `[atelier-maitre-quick] ${success ? "ok" : "failed"} · ${durationMs} ms · ${bytes === null ? "n/a" : (bytes / 1024 / 1024).toFixed(2) + " MiB"}`
);

if (!success) process.exitCode = 1;
