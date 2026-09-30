import {mkdirSync, statSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {runMeasured} from "./lib/run-measured.mjs";

const CLI_VERSION = "0.8.62";
const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const renders = [
  {project: "hyperframes/formbricks-6.0.1-media-heavy/vertical-en", format: "vertical", locale: "en"},
  {project: "hyperframes/formbricks-6.0.1-media-heavy/square-en", format: "square", locale: "en"},
  {project: "hyperframes/formbricks-6.0.1-media-heavy/landscape-en", format: "landscape", locale: "en"},
  {project: "hyperframes/formbricks-6.0.1-media-heavy/landscape-fr", format: "landscape", locale: "fr"}
];

mkdirSync("out", {recursive: true});
const results = [];

for (const render of renders) {
  const file = `formbricks-6.0.1-media-heavy-hyperframes-${render.format}-${render.locale}.mp4`;
  const output = resolve("out", file);

  console.log(`\n[media-benchmark][hyperframes] ${render.format}/${render.locale} -> ${output}`);

  const measured = runMeasured(
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
    {env: process.env}
  );

  const success = measured.status === 0;
  const bytes = success ? statSync(output).size : null;

  results.push({
    renderer: "hyperframes",
    cliVersion: CLI_VERSION,
    ...render,
    file,
    success,
    bytes,
    ...measured
  });
}

writeFileSync(
  "out/formbricks-6.0.1-media-heavy-hyperframes-benchmark.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceSpec: "video/data/formbricksMediaHeavy.ts#formbricksMediaHeavyRelease",
      results
    },
    null,
    2
  )
);

if (results.some((result) => !result.success)) {
  process.exitCode = 1;
}
