import {mkdirSync, statSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {runMeasured} from "./lib/run-measured.mjs";

const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const renders = [
  {composition: "FormbricksMediaHeavy-vertical-en", format: "vertical", locale: "en"},
  {composition: "FormbricksMediaHeavy-square-en", format: "square", locale: "en"},
  {composition: "FormbricksMediaHeavy-landscape-en", format: "landscape", locale: "en"},
  {composition: "FormbricksMediaHeavy-landscape-fr", format: "landscape", locale: "fr"}
];

mkdirSync("out", {recursive: true});
const results = [];

for (const render of renders) {
  const file = `formbricks-6.0.1-media-heavy-remotion-${render.format}-${render.locale}.mp4`;
  const output = join("out", file);

  console.log(`\n[media-benchmark][remotion] ${render.format}/${render.locale} -> ${output}`);

  const measured = runMeasured(
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
    {env: process.env}
  );

  const success = measured.status === 0;
  const bytes = success ? statSync(output).size : null;

  results.push({
    renderer: "remotion",
    ...render,
    file,
    success,
    bytes,
    ...measured
  });
}

writeFileSync(
  "out/formbricks-6.0.1-media-heavy-remotion-benchmark.json",
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
