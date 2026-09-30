import {existsSync} from "node:fs";
import {performance} from "node:perf_hooks";
import {spawnSync} from "node:child_process";

function parseTimeMetrics(stderr = "") {
  const user = stderr.match(/User time \(seconds\):\s*([0-9.]+)/);
  const system = stderr.match(/System time \(seconds\):\s*([0-9.]+)/);
  const rss = stderr.match(/Maximum resident set size \(kbytes\):\s*(\d+)/);

  return {
    cpuUserSeconds: user ? Number(user[1]) : null,
    cpuSystemSeconds: system ? Number(system[1]) : null,
    peakRssKb: rss ? Number(rss[1]) : null
  };
}

export function runMeasured(command, args, options = {}) {
  const startedAt = performance.now();
  const useTime = process.platform === "linux" && existsSync("/usr/bin/time");

  const result = useTime
    ? spawnSync("/usr/bin/time", ["-v", command, ...args], {
        ...options,
        encoding: "utf8",
        maxBuffer: 128 * 1024 * 1024
      })
    : spawnSync(command, args, {
        ...options,
        encoding: "utf8",
        maxBuffer: 128 * 1024 * 1024
      });

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";

  if (stdout) {
    process.stdout.write(stdout);
  }
  if (stderr) {
    process.stderr.write(stderr);
  }

  return {
    status: result.status,
    durationMs: Math.round(performance.now() - startedAt),
    ...parseTimeMetrics(useTime ? stderr : "")
  };
}
