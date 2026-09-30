import {mkdirSync, writeFileSync, copyFileSync, existsSync, readdirSync} from "node:fs";
import {join} from "node:path";

const outDir = join("public", "pilot", "logto");
mkdirSync(outDir, {recursive: true});

const assets = [
  {
    url: "https://github.com/user-attachments/assets/16b11f26-0c2a-4601-8562-174e5015519b",
    file: "changelog.png"
  },
  {
    url: "https://raw.githubusercontent.com/logto-io/logto/master/logo.png",
    file: "logo.png"
  }
];

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {"user-agent": "release-video-engine-concierge-pilot"},
        redirect: "follow"
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }
  throw lastError;
}

for (const asset of assets) {
  writeFileSync(join(outDir, asset.file), await fetchWithRetry(asset.url));
}

function findFont(weight) {
  const filesDir = join("node_modules", "@fontsource", "inter", "files");
  const direct = join(filesDir, `inter-latin-${weight}-normal.woff2`);
  if (existsSync(direct)) return direct;

  const fallback = readdirSync(filesDir).find(
    (name) =>
      name.includes("latin") &&
      name.includes(`-${weight}-`) &&
      name.endsWith(".woff2")
  );
  if (!fallback) throw new Error(`Inter ${weight} font not found`);
  return join(filesDir, fallback);
}

copyFileSync(findFont(400), join(outDir, "inter-400.woff2"));
copyFileSync(findFont(700), join(outDir, "inter-700.woff2"));
copyFileSync(
  join("node_modules", "gsap", "dist", "gsap.min.js"),
  join(outDir, "gsap.min.js")
);

function writeAudio(path, durationSeconds = 24, sampleRate = 22050) {
  const samples = Math.floor(durationSeconds * sampleRate);
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  const pulses = [0, 7, 18];
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const fade = Math.max(
      0,
      Math.min(1, t / 1.1, (durationSeconds - t) / 1.4)
    );
    let value =
      Math.sin(2 * Math.PI * 98 * t) * 0.028 +
      Math.sin(2 * Math.PI * 147 * t) * 0.018 +
      Math.sin(2 * Math.PI * 196 * t) * 0.01;

    for (const pulse of pulses) {
      const dt = t - pulse;
      if (dt >= 0 && dt < 0.55) {
        value +=
          Math.sin(2 * Math.PI * 392 * dt) *
          0.055 *
          Math.exp(-6 * dt);
      }
    }

    const sample = Math.max(-1, Math.min(1, value * fade));
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }

  writeFileSync(path, buffer);
}

writeAudio(join(outDir, "bed.wav"));
console.log("[logto-pilot] prepared changelog image, logo, fonts, GSAP and audio");
