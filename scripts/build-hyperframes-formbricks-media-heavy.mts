import {copyFileSync, mkdirSync} from "node:fs";
import {join} from "node:path";
import {
  releaseVideoFormats,
  resolveReleaseVideoSpec,
  type ReleaseVideoFormat
} from "../video/contracts/releaseVideo";
import {
  type BenchmarkLocale,
  type FormbricksMediaHeavyData,
  formbricksMediaHeavyRelease
} from "../video/data/formbricksMediaHeavy";

const spec = resolveReleaseVideoSpec(formbricksMediaHeavyRelease);
const data = spec.template.data as FormbricksMediaHeavyData;
const outputRoot = "hyperframes/formbricks-6.0.1-media-heavy";
const duration = 24;
const fps = 30;

const outputs: Array<{
  format: ReleaseVideoFormat;
  locale: BenchmarkLocale;
  label: string;
}> = [
  {format: "vertical", locale: "en", label: "9:16 · EN"},
  {format: "square", locale: "en", label: "1:1 · EN"},
  {format: "landscape", locale: "en", label: "16:9 · EN"},
  {format: "landscape", locale: "fr", label: "16:9 · FR"}
];

function escapeHtml(value: string | undefined) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildComposition(format: ReleaseVideoFormat, locale: BenchmarkLocale, label: string) {
  const dimensions = releaseVideoFormats[format];
  const copy = data.locales[locale];
  const screenshot = spec.content.screenshots?.[0];
  const safe = dimensions.safeInset;
  const vertical = format === "vertical";
  const square = format === "square";
  const objectPosition = screenshot?.focalPoint
    ? `${Math.round(screenshot.focalPoint.x * 100)}% ${Math.round(screenshot.focalPoint.y * 100)}%`
    : "50% 50%";

  const highlights = copy.highlights
    .map(
      (item, index) => `
        <article id="highlight-${index}" class="highlight">
          <div class="highlight-value">${escapeHtml(item.value)}</div>
          <div class="highlight-label">${escapeHtml(item.label)}</div>
        </article>`
    )
    .join("\n");

  const captions = copy.captions
    .map(
      (cue, index) => `
      <div
        id="caption-${index}"
        class="clip caption"
        data-start="${cue.start}"
        data-duration="${(cue.end - cue.start).toFixed(2)}"
        data-track-index="4"
      >
        <span>${escapeHtml(cue.text)}</span>
      </div>`
    )
    .join("\n");

  const id = `formbricks-media-heavy-${format}-${locale}`;

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=${dimensions.width}, height=${dimensions.height}" />
  <title>Formbricks 6.0.1 media-heavy · ${escapeHtml(label)}</title>
  <script src="assets/gsap.min.js"></script>
  <style>
    @font-face {
      font-family: "Inter";
      src: url("assets/inter-latin-400-normal.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "Inter";
      src: url("assets/inter-latin-700-normal.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      overflow: hidden;
      background: ${spec.brand.palette.background};
      color: ${spec.brand.palette.text};
      font-family: "Inter", Arial, sans-serif;
    }
    #root {
      position: relative;
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      overflow: hidden;
      background:
        radial-gradient(circle at 12% 12%, ${spec.brand.palette.primary}30 0, transparent 34%),
        radial-gradient(circle at 90% 88%, ${spec.brand.palette.accent}20 0, transparent 30%),
        ${spec.brand.palette.background};
    }
    #root::after {
      content: "";
      position: absolute;
      inset: ${safe}px;
      border: 1px solid ${spec.brand.palette.muted}28;
      border-radius: 38px;
      z-index: 30;
      pointer-events: none;
    }
    .clip {
      position: absolute;
      inset: 0;
    }
    .scene {
      padding: ${Math.round(safe * 1.35)}px;
    }
    .pill {
      display: inline-flex;
      padding: 12px 18px;
      border: 1px solid ${spec.brand.palette.primary}66;
      border-radius: 999px;
      background: ${spec.brand.palette.primary}18;
      color: ${spec.brand.palette.primary};
      font-size: 19px;
      font-weight: 700;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    .product {
      margin-top: ${vertical ? 92 : 56}px;
      color: ${spec.brand.palette.muted};
      font-size: ${vertical ? 34 : 28}px;
    }
    h1 {
      margin: 22px 0 0;
      max-width: ${vertical ? 870 : square ? 870 : 1420}px;
      font-size: ${vertical ? 96 : square ? 76 : 86}px;
      line-height: .98;
      letter-spacing: -.055em;
      font-weight: 700;
    }
    .summary {
      margin: 34px 0 0;
      max-width: ${vertical ? 840 : 1180}px;
      color: ${spec.brand.palette.muted};
      font-size: ${vertical ? 34 : 29}px;
      line-height: 1.4;
    }
    .meta {
      position: absolute;
      left: ${Math.round(safe * 1.35)}px;
      bottom: ${Math.round(safe * 1.35)}px;
      color: ${spec.brand.palette.muted};
      font-size: 19px;
    }
    .media-shot {
      width: 100%;
      height: 100%;
      object-fit: ${screenshot?.fit ?? "cover"};
      object-position: ${objectPosition};
      filter: saturate(.96) contrast(1.02);
    }
    .media-overlay {
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(7,17,31,.12) 0%, rgba(7,17,31,.2) 45%, rgba(7,17,31,.82) 100%),
        linear-gradient(180deg, rgba(7,17,31,.15) 0%, transparent 40%, rgba(7,17,31,.65) 100%);
    }
    .changes {
      padding: ${Math.round(safe * 1.15)}px;
      display: flex;
      align-items: center;
      justify-content: ${vertical || square ? "flex-end" : "flex-end"};
    }
    .changes-panel {
      width: ${vertical ? "100%" : square ? "100%" : "44%"};
      max-height: ${vertical ? "52%" : square ? "58%" : "84%"};
      padding: ${vertical ? 30 : 28}px;
      border-radius: 28px;
      background: rgba(7,17,31,.9);
      border: 1px solid ${spec.brand.palette.muted}33;
      box-shadow: 0 32px 90px rgba(0,0,0,.3);
      backdrop-filter: blur(10px);
    }
    .kicker {
      color: ${spec.brand.palette.primary};
      font-size: 19px;
      font-weight: 700;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    .changes-title {
      margin-top: 14px;
      font-size: ${vertical ? 44 : square ? 38 : 40}px;
      line-height: 1.05;
      letter-spacing: -.04em;
      font-weight: 700;
    }
    .highlights {
      display: grid;
      grid-template-columns: ${vertical || square ? "1fr 1fr" : "1fr"};
      gap: 12px;
      margin-top: 22px;
    }
    .highlight {
      padding: ${vertical ? 18 : 16}px;
      border-radius: 18px;
      border: 1px solid ${spec.brand.palette.muted}25;
      background: ${spec.brand.palette.surface};
    }
    .highlight-value {
      color: ${spec.brand.palette.primary};
      font-size: ${vertical ? 23 : 21}px;
      font-weight: 700;
    }
    .highlight-label {
      margin-top: 6px;
      font-size: ${vertical ? 18 : 17}px;
      line-height: 1.32;
    }
    .focal {
      position: absolute;
      left: ${Math.round(safe * 1.15)}px;
      bottom: ${Math.round(safe * 1.15)}px;
      padding: 9px 13px;
      border-radius: 999px;
      background: rgba(7,17,31,.82);
      font-size: 15px;
      color: #f8fafc;
    }
    .outro {
      display: flex;
      padding: ${Math.round(safe * 1.4)}px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
    }
    .mark {
      display: grid;
      width: ${vertical ? 146 : 116}px;
      height: ${vertical ? 146 : 116}px;
      place-items: center;
      border-radius: 30px;
      background: ${spec.brand.palette.primary};
      color: ${spec.brand.palette.background};
      font-size: ${vertical ? 68 : 52}px;
      font-weight: 700;
    }
    .cta {
      margin-top: 34px;
      max-width: ${vertical ? 860 : 1220}px;
      font-size: ${vertical ? 72 : 58}px;
      line-height: 1.03;
      letter-spacing: -.05em;
      font-weight: 700;
    }
    .supporting {
      margin-top: 18px;
      max-width: 900px;
      color: ${spec.brand.palette.muted};
      font-size: ${vertical ? 27 : 23}px;
      line-height: 1.4;
    }
    .caption {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0 ${vertical ? 80 : Math.round(dimensions.width * .15)}px ${vertical ? 118 : 72}px;
      pointer-events: none;
      z-index: 50;
    }
    .caption span {
      max-width: 1200px;
      padding: ${vertical ? "18px 22px" : "14px 20px"};
      border-radius: 18px;
      background: rgba(7,17,31,.88);
      border: 1px solid rgba(248,250,252,.16);
      color: #f8fafc;
      font-size: ${vertical ? 27 : 23}px;
      font-weight: 700;
      line-height: 1.3;
      text-align: center;
      box-shadow: 0 18px 50px rgba(0,0,0,.22);
    }
  </style>
</head>
<body>
  <div
    id="root"
    data-composition-id="${id}"
    data-start="0"
    data-duration="${duration}"
    data-fps="${fps}"
    data-width="${dimensions.width}"
    data-height="${dimensions.height}"
  >
    <section id="intro" class="clip scene" data-start="0" data-duration="6" data-track-index="1">
      <div id="intro-pill" class="pill">${escapeHtml(copy.eyebrow)}</div>
      <div id="intro-product" class="product">${escapeHtml(spec.product.name)} · ${escapeHtml(spec.product.version)}</div>
      <h1 id="intro-title">${escapeHtml(copy.headline)}</h1>
      <div id="intro-summary" class="summary">${escapeHtml(copy.summary)}</div>
      <div class="meta">${locale.toUpperCase()} · bundled Inter · deterministic audio</div>
    </section>

    <img
      id="product-shot"
      class="clip media-shot"
      src="assets/formbricks-product.png"
      alt="${escapeHtml(screenshot?.alt)}"
      data-start="5"
      data-duration="13"
      data-track-index="0"
    />

    <div class="clip media-overlay" data-start="5" data-duration="13" data-track-index="1"></div>

    <section id="changes" class="clip changes" data-start="5" data-duration="13" data-track-index="2">
      <div id="changes-panel" class="changes-panel">
        <div class="kicker">${escapeHtml(copy.changesKicker)}</div>
        <div class="changes-title">${escapeHtml(copy.changesTitle)}</div>
        <div class="highlights">
          ${highlights}
        </div>
      </div>
      <div class="focal">public screenshot · focal point ${objectPosition}</div>
    </section>

    <section id="outro" class="clip outro" data-start="18" data-duration="6" data-track-index="2">
      <div id="outro-mark" class="mark">F</div>
      <div id="outro-cta" class="cta">${escapeHtml(copy.cta)}</div>
      <div id="outro-supporting" class="supporting">${escapeHtml(copy.supportingText)}</div>
    </section>

    ${captions}

    <audio
      id="benchmark-audio"
      src="assets/formbricks-benchmark-bed.wav"
      data-start="0"
      data-duration="24"
      data-track-index="5"
      data-volume="${data.audio.volume}"
    ></audio>
  </div>

  <script>
    window.__timelines = window.__timelines || {};
    const timeline = gsap.timeline({paused: true});

    timeline
      .fromTo("#intro-pill", {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: .5, ease: "power3.out"}, .1)
      .fromTo("#intro-product", {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: .55, ease: "power3.out"}, .28)
      .fromTo("#intro-title", {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: .75, ease: "power3.out"}, .48)
      .fromTo("#intro-summary", {opacity: 0, y: 26}, {opacity: 1, y: 0, duration: .65, ease: "power2.out"}, .85)
      .to("#intro", {opacity: 0, y: -20, duration: .45, ease: "power2.in"}, 5.45)
      .fromTo("#product-shot", {scale: 1.05, opacity: 0}, {scale: 1, opacity: 1, duration: .8, ease: "power2.out"}, 5.05)
      .fromTo("#changes-panel", {opacity: 0, x: 48}, {opacity: 1, x: 0, duration: .7, ease: "power3.out"}, 5.45);

    for (let index = 0; index < ${copy.highlights.length}; index++) {
      timeline.fromTo(
        "#highlight-" + index,
        {opacity: 0, y: 18},
        {opacity: 1, y: 0, duration: .45, ease: "power2.out"},
        5.9 + index * .18
      );
    }

    timeline
      .to("#changes-panel", {opacity: 0, x: 36, duration: .4, ease: "power2.in"}, 17.45)
      .to("#product-shot", {opacity: 0, scale: 1.015, duration: .45, ease: "power2.in"}, 17.5)
      .fromTo("#outro-mark", {opacity: 0, scale: .82}, {opacity: 1, scale: 1, duration: .65, ease: "back.out(1.4)"}, 18.1)
      .fromTo("#outro-cta", {opacity: 0, y: 32}, {opacity: 1, y: 0, duration: .65, ease: "power3.out"}, 18.45)
      .fromTo("#outro-supporting", {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: .55, ease: "power2.out"}, 18.8);

    window.__timelines["${id}"] = timeline;
  </script>
</body>
</html>`;
}

const assetSources = {
  screenshot: join("public", "benchmark", "formbricks-product.png"),
  regularFont: join("public", "benchmark", "inter-latin-400-normal.woff2"),
  boldFont: join("public", "benchmark", "inter-latin-700-normal.woff2"),
  audio: join("public", "benchmark", "formbricks-benchmark-bed.wav"),
  gsap: join("node_modules", "gsap", "dist", "gsap.min.js")
};

for (const output of outputs) {
  const projectDir = join(outputRoot, `${output.format}-${output.locale}`);
  const assetsDir = join(projectDir, "assets");
  mkdirSync(assetsDir, {recursive: true});

  copyFileSync(assetSources.screenshot, join(assetsDir, "formbricks-product.png"));
  copyFileSync(assetSources.regularFont, join(assetsDir, "inter-latin-400-normal.woff2"));
  copyFileSync(assetSources.boldFont, join(assetsDir, "inter-latin-700-normal.woff2"));
  copyFileSync(assetSources.audio, join(assetsDir, "formbricks-benchmark-bed.wav"));
  copyFileSync(assetSources.gsap, join(assetsDir, "gsap.min.js"));

  await import("node:fs").then(({writeFileSync}) => {
    writeFileSync(
      join(projectDir, "index.html"),
      buildComposition(output.format, output.locale, output.label)
    );
  });
}

console.log(
  `[media-benchmark] generated ${outputs.length} HyperFrames compositions from one shared ReleaseVideoSpec`
);
