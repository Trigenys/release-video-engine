import {mkdirSync, statSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {performance} from "node:perf_hooks";
import {spawnSync} from "node:child_process";

const CLI_VERSION = "0.8.62";
const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const renders = [
  {format:"vertical", project:"hyperframes/pilot/logto-v1.44.0/vertical"},
  {format:"square", project:"hyperframes/pilot/logto-v1.44.0/square"},
  {format:"landscape", project:"hyperframes/pilot/logto-v1.44.0/landscape"}
];

mkdirSync("out", {recursive:true});
const results = [];

for (const render of renders) {
  const file = `logto-v1.44.0-hyperframes-${render.format}.mp4`;
  const output = resolve("out", file);
  const startedAt = performance.now();

  console.log(`\n[logto-pilot] rendering ${render.format} -> ${output}`);

  const result = spawnSync(
    executable,
    [
      "--yes",
      `hyperframes@${CLI_VERSION}`,
      "render",
      resolve(render.project),
      "--output",
      output,
      "--quality",
      "standard",
      "--workers",
      "2"
    ],
    {stdio:"inherit", env:process.env}
  );

  const durationMs = Math.round(performance.now() - startedAt);
  const success = result.status === 0;
  const bytes = success ? statSync(output).size : null;

  results.push({
    prospect:"Logto",
    release:"v1.44.0",
    renderer:"hyperframes",
    cliVersion:CLI_VERSION,
    format:render.format,
    file,
    success,
    durationMs,
    bytes
  });
}

writeFileSync(
  "out/logto-v1.44.0-pilot-metrics.json",
  JSON.stringify({
    generatedAt:new Date().toISOString(),
    sourceRelease:"https://github.com/logto-io/logto/releases/tag/v1.44.0",
    results
  }, null, 2)
);

console.log("\n[logto-pilot] render summary");
for (const result of results) {
  const size = result.bytes === null
    ? "n/a"
    : `${(result.bytes / 1024 / 1024).toFixed(2)} MiB`;
  console.log(
    `- ${result.format}: ${result.success ? "ok" : "failed"} · ${result.durationMs} ms · ${size}`
  );
}

if (results.some((result) => !result.success)) {
  process.exitCode = 1;
}
