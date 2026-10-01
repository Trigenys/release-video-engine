import {
  atelierMaitreFleetDemo,
  atelierMaitreGeneralDemo
} from "../video/data/atelierMaitre";
import {productDemoDurationInFrames} from "../video/contracts/productDemo";

const fps = 30;
const expected = [
  {name: "general", spec: atelierMaitreGeneralDemo, seconds: 300},
  {name: "fleet", spec: atelierMaitreFleetDemo, seconds: 330}
];

for (const item of expected) {
  const actualSeconds = item.spec.scenes.reduce(
    (sum, scene) => sum + scene.durationSeconds,
    0
  );

  if (actualSeconds !== item.seconds) {
    throw new Error(
      `${item.name} demo duration mismatch: expected ${item.seconds}s, got ${actualSeconds}s`
    );
  }

  const sourceRevision = item.spec.product.sourceRevision;
  if (!sourceRevision || !/^[a-f0-9]{40}$/.test(sourceRevision)) {
    throw new Error(`${item.name} demo must pin a 40-char source revision`);
  }

  const screenshots = item.spec.scenes.flatMap((scene) =>
    scene.screenshot ? [scene.screenshot.src] : []
  );

  if (screenshots.length === 0) {
    throw new Error(`${item.name} demo must contain real product screenshots`);
  }

  for (const src of screenshots) {
    if (!src.includes(sourceRevision) || src.includes("/main/")) {
      throw new Error(`${item.name} screenshot is not revision-pinned: ${src}`);
    }
  }

  const frames = productDemoDurationInFrames(item.spec, fps);
  if (frames !== actualSeconds * fps) {
    throw new Error(`${item.name} frame duration mismatch`);
  }

  console.log(
    `[atelier-maitre] ${item.name}: ${actualSeconds}s · ${frames} frames · ${screenshots.length} screenshots`
  );
}
