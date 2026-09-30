import {copyFileSync, mkdirSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {
  releaseVideoFormats,
  resolveReleaseVideoSpec,
  type ReleaseVideoFormat,
  type ReleaseVideoSpec
} from "../../video/contracts/releaseVideo";

export interface ProspectHyperframesOptions {
  spec: ReleaseVideoSpec<Record<string, unknown>>;
  outputRoot: string;
  publicRoot?: string;
  audioSrc?: string;
  fontRegularSrc: string;
  fontBoldSrc: string;
  gsapSrc: string;
  benchmarkLabel?: string;
}

const formats: Array<{name: ReleaseVideoFormat; label: string}> = [
  {name: "vertical", label: "9:16"},
  {name: "square", label: "1:1"},
  {name: "landscape", label: "16:9"}
];

function escapeHtml(value: string | undefined) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function publicPath(publicRoot: string, src: string) {
  return join(publicRoot, ...src.split("/"));
}

export function buildProspectHyperframes(options: ProspectHyperframesOptions) {
  const publicRoot = options.publicRoot ?? "public";
  const spec = resolveReleaseVideoSpec(options.spec);
  const screenshot = spec.content.screenshots?.[0];
  const logo = spec.brand.logo;

  if (!screenshot) {
    throw new Error("prospect HyperFrames template requires one screenshot");
  }

  if (!logo) {
    throw new Error("prospect HyperFrames template requires a logo asset");
  }

  for (const format of formats) {
    const dimensions = releaseVideoFormats[format.name];
    const vertical = format.name === "vertical";
    const square = format.name === "square";
    const safe = dimensions.safeInset;
    const screenshotPosition = screenshot.focalPoint
      ? `${Math.round(screenshot.focalPoint.x * 100)}% ${Math.round(
          screenshot.focalPoint.y * 100
        )}%`
      : "50% 50%";

    const projectDir = join(options.outputRoot, format.name);
    const assetsDir = join(projectDir, "assets");
    mkdirSync(assetsDir, {recursive: true});

    copyFileSync(publicPath(publicRoot, screenshot.src), join(assetsDir, "screenshot.png"));
    copyFileSync(publicPath(publicRoot, logo), join(assetsDir, "logo.png"));
    copyFileSync(options.fontRegularSrc, join(assetsDir, "inter-400.woff2"));
    copyFileSync(options.fontBoldSrc, join(assetsDir, "inter-700.woff2"));
    copyFileSync(options.gsapSrc, join(assetsDir, "gsap.min.js"));

    if (options.audioSrc) {
      copyFileSync(options.audioSrc, join(assetsDir, "bed.wav"));
    }

    const highlights = spec.content.highlights
      .map(
        (item, index) => `
          <article id="highlight-${index}" class="highlight">
            <div class="highlight-value">${escapeHtml(item.value)}</div>
            <div class="highlight-label">${escapeHtml(item.label)}</div>
          </article>`
      )
      .join("\n");

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=${dimensions.width}, height=${dimensions.height}" />
  <title>${escapeHtml(spec.product.name)} ${escapeHtml(spec.product.version)} release preview</title>
  <script src="assets/gsap.min.js"></script>
  <style>
    @font-face {
      font-family: "Inter";
      src: url("assets/inter-400.woff2") format("woff2");
      font-weight: 400;
    }
    @font-face {
      font-family: "Inter";
      src: url("assets/inter-700.woff2") format("woff2");
      font-weight: 700;
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
        radial-gradient(circle at 14% 8%, ${spec.brand.palette.primary}3d 0, transparent 32%),
        radial-gradient(circle at 92% 88%, ${spec.brand.palette.accent}28 0, transparent 30%),
        ${spec.brand.palette.background};
    }
    #root::after {
      content: "";
      position: absolute;
      inset: ${safe}px;
      z-index: 40;
      border: 1px solid ${spec.brand.palette.muted}24;
      border-radius: 38px;
      pointer-events: none;
    }
    .clip {
      position: absolute;
      inset: 0;
    }
    .scene {
      padding: ${Math.round(safe * 1.35)}px;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .brand-logo {
      width: ${vertical ? 90 : 72}px;
      height: ${vertical ? 90 : 72}px;
      object-fit: contain;
      border-radius: 18px;
      background: rgba(255,255,255,.96);
      padding: 10px;
    }
    .product-name {
      font-size: ${vertical ? 46 : 38}px;
      font-weight: 700;
      letter-spacing: -.04em;
    }
    .version {
      margin-top: 4px;
      color: ${spec.brand.palette.muted};
      font-size: ${vertical ? 23 : 19}px;
    }
    .eyebrow {
      display: inline-flex;
      margin-top: ${vertical ? 90 : 58}px;
      padding: 11px 17px;
      border: 1px solid ${spec.brand.palette.primary}66;
      border-radius: 999px;
      color: ${spec.brand.palette.primary};
      background: ${spec.brand.palette.primary}16;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    h1 {
      max-width: ${vertical ? 860 : square ? 850 : 1300}px;
      margin: 25px 0 0;
      font-size: ${vertical ? 92 : square ? 72 : 82}px;
      line-height: .98;
      letter-spacing: -.055em;
      font-weight: 700;
    }
    .summary {
      max-width: ${vertical ? 835 : 1120}px;
      margin-top: 30px;
      color: ${spec.brand.palette.muted};
      font-size: ${vertical ? 33 : 28}px;
      line-height: 1.4;
    }
    .format-label {
      position: absolute;
      right: ${Math.round(safe * 1.35)}px;
      top: ${Math.round(safe * 1.35)}px;
      color: ${spec.brand.palette.muted};
      font-size: 16px;
      letter-spacing: .08em;
    }
    .media {
      width: 100%;
      height: 100%;
      object-fit: ${screenshot.fit ?? "cover"};
      object-position: ${screenshotPosition};
      filter: saturate(.97) contrast(1.02);
    }
    .media-shade {
      pointer-events: none;
      background:
        linear-gradient(90deg,
          rgba(11,9,18,.18) 0%,
          rgba(11,9,18,.34) 48%,
          rgba(11,9,18,.9) 100%
        ),
        linear-gradient(180deg,
          rgba(11,9,18,.16) 0%,
          transparent 42%,
          rgba(11,9,18,.7) 100%
        );
    }
    .changes {
      display: flex;
      align-items: center;
      justify-content: ${vertical || square ? "center" : "flex-end"};
      padding: ${Math.round(safe * 1.16)}px;
    }
    .changes-card {
      width: ${vertical ? "100%" : square ? "100%" : "46%"};
      max-height: ${vertical ? "58%" : square ? "62%" : "86%"};
      padding: ${vertical ? 30 : 28}px;
      border: 1px solid ${spec.brand.palette.muted}2d;
      border-radius: 28px;
      background: ${spec.brand.palette.background}e8;
      box-shadow: 0 34px 90px rgba(0,0,0,.36);
      backdrop-filter: blur(10px);
    }
    .changes-kicker {
      color: ${spec.brand.palette.primary};
      font-size: 18px;
      font-weight: 700;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    .changes-title {
      margin-top: 13px;
      font-size: ${vertical ? 42 : square ? 36 : 39}px;
      line-height: 1.05;
      letter-spacing: -.04em;
      font-weight: 700;
    }
    .highlights {
      display: grid;
      grid-template-columns: ${vertical || square ? "1fr 1fr" : "1fr"};
      gap: 12px;
      margin-top: 20px;
    }
    .highlight {
      padding: ${vertical ? 18 : 15}px;
      border: 1px solid ${spec.brand.palette.muted}20;
      border-radius: 18px;
      background: ${spec.brand.palette.surface};
    }
    .highlight-value {
      color: ${spec.brand.palette.secondary ?? spec.brand.palette.primary};
      font-size: ${vertical ? 22 : 20}px;
      font-weight: 700;
    }
    .highlight-label {
      margin-top: 6px;
      color: ${spec.brand.palette.text};
      font-size: ${vertical ? 17 : 16}px;
      line-height: 1.33;
    }
    .source-pill {
      position: absolute;
      left: ${Math.round(safe * 1.16)}px;
      bottom: ${Math.round(safe * 1.16)}px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(11,9,18,.84);
      color: ${spec.brand.palette.muted};
      font-size: 14px;
    }
    .outro {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: ${Math.round(safe * 1.4)}px;
      text-align: center;
    }
    .outro-logo {
      width: ${vertical ? 132 : 106}px;
      height: ${vertical ? 132 : 106}px;
      object-fit: contain;
      border-radius: 28px;
      background: rgba(255,255,255,.96);
      padding: 14px;
      box-shadow: 0 26px 80px ${spec.brand.palette.primary}35;
    }
    .cta {
      max-width: ${vertical ? 850 : 1200}px;
      margin-top: 32px;
      font-size: ${vertical ? 70 : 57}px;
      line-height: 1.03;
      letter-spacing: -.05em;
      font-weight: 700;
    }
    .supporting {
      max-width: 940px;
      margin-top: 18px;
      color: ${spec.brand.palette.muted};
      font-size: ${vertical ? 25 : 22}px;
      line-height: 1.42;
    }
    .legal {
      position: absolute;
      left: ${Math.round(safe * 1.4)}px;
      right: ${Math.round(safe * 1.4)}px;
      bottom: ${Math.round(safe * 1.08)}px;
      color: ${spec.brand.palette.muted};
      font-size: 14px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div
    id="root"
    data-composition-id="${spec.id}-${format.name}"
    data-start="0"
    data-duration="24"
    data-fps="30"
    data-width="${dimensions.width}"
    data-height="${dimensions.height}"
  >
    <section id="intro" class="clip scene" data-start="0" data-duration="7" data-track-index="2">
      <div class="format-label">${escapeHtml(options.benchmarkLabel ?? "TAILORED PREVIEW")} · ${format.label}</div>
      <div id="brand-row" class="brand-row">
        <img class="brand-logo" src="assets/logo.png" alt="${escapeHtml(spec.brand.name)} logo" />
        <div>
          <div class="product-name">${escapeHtml(spec.product.name)}</div>
          <div class="version">Release ${escapeHtml(spec.product.version)}</div>
        </div>
      </div>
      <div id="eyebrow" class="eyebrow">${escapeHtml(spec.release.eyebrow)}</div>
      <h1 id="headline">${escapeHtml(spec.release.headline ?? spec.release.title)}</h1>
      <div id="summary" class="summary">${escapeHtml(spec.release.summary)}</div>
    </section>

    <img
      id="release-media"
      class="clip media"
      src="assets/screenshot.png"
      alt="${escapeHtml(screenshot.alt)}"
      data-start="7"
      data-duration="11"
      data-track-index="0"
    />

    <div
      id="media-shade"
      class="clip media-shade"
      data-start="7"
      data-duration="11"
      data-track-index="1"
    ></div>

    <section id="changes" class="clip changes" data-start="7" data-duration="11" data-track-index="2">
      <div id="changes-card" class="changes-card">
        <div class="changes-kicker">What's new</div>
        <div class="changes-title">${escapeHtml(spec.release.title)}</div>
        <div class="highlights">${highlights}</div>
      </div>
      <div class="source-pill">Source · ${escapeHtml(spec.product.repository)}</div>
    </section>

    <section id="outro" class="clip outro" data-start="18" data-duration="6" data-track-index="2">
      <img id="outro-logo" class="outro-logo" src="assets/logo.png" alt="" />
      <div id="cta" class="cta">${escapeHtml(spec.cta.label)}</div>
      <div id="supporting" class="supporting">${escapeHtml(spec.cta.supportingText)}</div>
      <div class="legal">${escapeHtml(spec.legal?.footer)}</div>
    </section>

    ${options.audioSrc ? `
    <audio
      id="audio-bed"
      src="assets/bed.wav"
      data-start="0"
      data-duration="24"
      data-track-index="5"
      data-volume="0.14"
    ></audio>` : ""}
  </div>

  <script>
    window.__timelines = window.__timelines || {};
    const timeline = gsap.timeline({paused: true});

    timeline
      .fromTo("#brand-row", {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: .55, ease: "power3.out"}, .12)
      .fromTo("#eyebrow", {opacity: 0, y: 18}, {opacity: 1, y: 0, duration: .45, ease: "power2.out"}, .4)
      .fromTo("#headline", {opacity: 0, y: 48}, {opacity: 1, y: 0, duration: .75, ease: "power3.out"}, .65)
      .fromTo("#summary", {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: .6, ease: "power2.out"}, 1.0)
      .to("#intro", {opacity: 0, y: -18, duration: .45, ease: "power2.in"}, 6.4)
      .fromTo("#release-media", {opacity: 0, scale: 1.055}, {opacity: 1, scale: 1, duration: .8, ease: "power2.out"}, 7.02)
      .fromTo("#changes-card", {opacity: 0, x: 50}, {opacity: 1, x: 0, duration: .72, ease: "power3.out"}, 7.35);

    for (let index = 0; index < ${spec.content.highlights.length}; index++) {
      timeline.fromTo(
        "#highlight-" + index,
        {opacity: 0, y: 16},
        {opacity: 1, y: 0, duration: .42, ease: "power2.out"},
        7.75 + index * .18
      );
    }

    timeline
      .to("#changes-card", {opacity: 0, x: 34, duration: .4, ease: "power2.in"}, 17.45)
      .to("#release-media", {opacity: 0, scale: 1.015, duration: .42, ease: "power2.in"}, 17.5)
      .fromTo("#outro-logo", {opacity: 0, scale: .82, rotate: -5}, {opacity: 1, scale: 1, rotate: 0, duration: .66, ease: "back.out(1.4)"}, 18.08)
      .fromTo("#cta", {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: .62, ease: "power3.out"}, 18.42)
      .fromTo("#supporting", {opacity: 0, y: 18}, {opacity: 1, y: 0, duration: .55, ease: "power2.out"}, 18.78);

    window.__timelines["${spec.id}-${format.name}"] = timeline;
  </script>
</body>
</html>`;

    writeFileSync(join(projectDir, "index.html"), html);
  }

  console.log(
    `[prospect-hyperframes] generated ${formats.length} projects for ${spec.product.name} ${spec.product.version}`
  );
}
