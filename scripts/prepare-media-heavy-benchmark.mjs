import {copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync} from "node:fs";
import {join} from "node:path";

const outDir = join("public", "benchmark");
mkdirSync(outDir, {recursive: true});

const SCREENSHOT_URL =
  "https://github-production-user-asset-6210df.s3.amazonaws.com/675065/249441967-ccb89ea3-82b4-4bf2-8d2c-528721ec313b.png";

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "release-video-engine-media-benchmark"
        },
        redirect: "follow"
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw lastError;
}

function findFont(weight) {
  const filesDir = join("node_modules", "@fontsource", "inter", "files");
  const expected = `inter-latin-${weight}-normal.woff2`;
  const direct = join(filesDir, expected);
  if (existsSync(direct)) {
    return direct;
  }

  const fallback = readdirSync(filesDir).find(
    (name) => name.includes("latin") && name.includes(`-${weight}-`) && name.endsWith(".woff2")
  );

  if (!fallback) {
    throw new Error(`Unable to find Inter ${weight} WOFF2 in @fontsource/inter`);
  }

  return join(filesDir, fallback);
}

function writeWav(path, durationSeconds = 24, sampleRate = 22050) {
  const sampleCount = Math.floor(durationSeconds * sampleRate);
  const bytesPerSample = 2;
  const dataSize = sampleCount * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  const sceneHits = [0, 6, 10, 18];

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const fadeIn = Math.min(1, t / 1.2);
    const fadeOut = Math.min(1, (durationSeconds - t) / 1.5);
    const envelope = Math.max(0, Math.min(fadeIn, fadeOut));

    const bed =
      Math.sin(2 * Math.PI * 110 * t) * 0.045 +
      Math.sin(2 * Math.PI * 165 * t) * 0.025 +
      Math.sin(2 * Math.PI * 220 * t) * 0.012;

    let hit = 0;
    for (const start of sceneHits) {
      const dt = t - start;
      if (dt >= 0 && dt < 0.65) {
        const hitEnvelope = Math.exp(-5.2 * dt);
        hit +=
          Math.sin(2 * Math.PI * 440 * dt) * 0.08 * hitEnvelope +
          Math.sin(2 * Math.PI * 660 * dt) * 0.04 * hitEnvelope;
      }
    }

    const sample = Math.max(-1, Math.min(1, (bed + hit) * envelope));
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }

  writeFileSync(path, buffer);
}

const screenshot = await fetchWithRetry(SCREENSHOT_URL);
writeFileSync(join(outDir, "formbricks-product.png"), screenshot);

copyFileSync(findFont(400), join(outDir, "inter-latin-400-normal.woff2"));
copyFileSync(findFont(700), join(outDir, "inter-latin-700-normal.woff2"));

writeWav(join(outDir, "formbricks-benchmark-bed.wav"));

console.log("[media-benchmark] prepared screenshot, Inter fonts and deterministic audio bed");
