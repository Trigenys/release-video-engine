import {mkdirSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {
  releaseVideoFormats,
  resolveReleaseVideoSpec,
  type ReleaseVideoFormat
} from "../video/contracts/releaseVideo";
import {formbricksRelease} from "../video/data/formbricks";

const spec = resolveReleaseVideoSpec(formbricksRelease);
const outputRoot = "hyperframes/formbricks-6.0.1";
const duration = 24;
const fps = 30;

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

function buildComposition(format: ReleaseVideoFormat, formatLabel: string) {
  const dimensions = releaseVideoFormats[format];
  const vertical = format === "vertical";
  const square = format === "square";
  const safe = dimensions.safeInset;
  const titleSize = vertical ? 104 : square ? 76 : 88;
  const headlineSize = vertical ? 50 : square ? 40 : 42;
  const bodySize = vertical ? 35 : square ? 28 : 30;
  const cardTitle = vertical ? 34 : 29;
  const cardBody = vertical ? 27 : 23;
  const cardColumns = vertical ? 1 : 2;
  const markSize = vertical ? 128 : 104;
  const highlights = spec.content.highlights
    .map(
      (item, index) => `
        <article id="change-${index}" class="change-card">
          <div class="change-value">${escapeHtml(item.value)}</div>
          <div class="change-label">${escapeHtml(item.label)}</div>
        </article>`
    )
    .join("\n");

  const primary = spec.brand.palette.primary;
  const accent = spec.brand.palette.accent;
  const background = spec.brand.palette.background;
  const surface = spec.brand.palette.surface;
  const text = spec.brand.palette.text;
  const muted = spec.brand.palette.muted;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${dimensions.width}, height=${dimensions.height}" />
    <title>${escapeHtml(spec.product.name)} ${escapeHtml(spec.product.version)} — HyperFrames</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
        overflow: hidden;
        background: ${background};
        color: ${text};
        font-family: Inter, "Segoe UI", Arial, sans-serif;
      }
      body {
        position: relative;
      }
      #root {
        position: relative;
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
        overflow: hidden;
        background:
          radial-gradient(circle at 12% 10%, ${primary}36 0, transparent 33%),
          radial-gradient(circle at 92% 88%, ${accent}24 0, transparent 29%),
          ${background};
      }
      #root::after {
        content: "";
        position: absolute;
        inset: ${safe}px;
        border: 1px solid ${muted}2b;
        border-radius: 38px;
        pointer-events: none;
        z-index: 20;
      }
      .clip {
        position: absolute;
        inset: 0;
        padding: ${Math.round(safe * 1.35)}px;
      }
      .scene {
        width: 100%;
        height: 100%;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 13px 19px;
        border: 1px solid ${primary}66;
        border-radius: 999px;
        background: ${primary}18;
        color: ${primary};
        font-size: 20px;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: .12em;
      }
      .format-pill {
        position: absolute;
        top: ${Math.round(safe * 1.35)}px;
        right: ${Math.round(safe * 1.35)}px;
        color: ${muted};
        font-size: 18px;
        font-weight: 750;
        letter-spacing: .08em;
      }
      .intro-layout {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
      }
      .product {
        margin-top: ${vertical ? 78 : 54}px;
        font-size: ${headlineSize}px;
        font-weight: 900;
        letter-spacing: -.05em;
      }
      h1 {
        max-width: ${vertical ? 870 : square ? 850 : 1320}px;
        margin: 26px 0 0;
        font-size: ${titleSize}px;
        line-height: .98;
        letter-spacing: -.06em;
      }
      .summary {
        max-width: ${vertical ? 850 : square ? 810 : 1250}px;
        margin: 34px 0 0;
        color: ${muted};
        font-size: ${bodySize}px;
        line-height: 1.4;
      }
      .intro-footer,
      .changes-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        color: ${muted};
        font-size: 20px;
      }
      .version {
        color: ${primary};
        font-weight: 850;
      }
      .changes-layout {
        display: flex;
        height: 100%;
        flex-direction: column;
      }
      .changes-kicker {
        color: ${primary};
        font-size: 21px;
        font-weight: 850;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .changes-title {
        margin-top: 22px;
        max-width: ${vertical ? 850 : 1200}px;
        font-size: ${vertical ? 68 : square ? 52 : 56}px;
        font-weight: 900;
        letter-spacing: -.05em;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(${cardColumns}, minmax(0, 1fr));
        gap: ${vertical ? 22 : 24}px;
        margin: auto 0;
      }
      .change-card {
        min-height: ${vertical ? 195 : square ? 185 : 176}px;
        padding: ${vertical ? 34 : 30}px;
        border: 1px solid ${muted}2b;
        border-radius: 28px;
        background: ${surface};
        box-shadow: 0 26px 70px rgba(0,0,0,.18);
      }
      .change-value {
        color: ${primary};
        font-size: ${cardTitle}px;
        font-weight: 900;
        letter-spacing: -.035em;
      }
      .change-label {
        margin-top: 13px;
        color: ${text};
        font-size: ${cardBody}px;
        line-height: 1.38;
      }
      .outro-layout {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
      }
      .mark {
        display: grid;
        width: ${markSize}px;
        height: ${markSize}px;
        place-items: center;
        border-radius: 31px;
        background: ${primary};
        color: ${background};
        font-size: ${Math.round(markSize * 0.48)}px;
        font-weight: 950;
        box-shadow: 0 28px 80px ${primary}35;
      }
      .cta {
        margin-top: 34px;
        max-width: ${vertical ? 860 : 1200}px;
        font-size: ${vertical ? 76 : square ? 58 : 62}px;
        font-weight: 950;
        letter-spacing: -.055em;
        line-height: 1.02;
      }
      .supporting {
        margin-top: 22px;
        max-width: ${vertical ? 820 : 960}px;
        color: ${muted};
        font-size: ${vertical ? 28 : 24}px;
        line-height: 1.42;
      }
      .url {
        margin-top: 30px;
        padding: 15px 23px;
        border: 1px solid ${primary}66;
        border-radius: 999px;
        background: ${surface};
        color: ${primary};
        font-size: 21px;
        font-weight: 850;
      }
      .disclaimer {
        position: absolute;
        bottom: ${Math.round(safe * 1.18)}px;
        left: ${Math.round(safe * 1.35)}px;
        right: ${Math.round(safe * 1.35)}px;
        color: ${muted};
        font-size: 16px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="formbricks-${format}"
      data-start="0"
      data-duration="${duration}"
      data-fps="${fps}"
      data-width="${dimensions.width}"
      data-height="${dimensions.height}"
    >
      <section id="intro" class="clip" data-start="0" data-duration="8" data-track-index="1">
        <div class="format-pill">HYPERFRAMES · ${formatLabel}</div>
        <div class="scene intro-layout">
          <div>
            <div id="intro-eyebrow" class="eyebrow">${escapeHtml(spec.release.eyebrow)}</div>
            <div id="intro-product" class="product">${escapeHtml(spec.product.name)}</div>
            <h1 id="intro-title">${escapeHtml(spec.release.headline ?? spec.release.title)}</h1>
            <p id="intro-summary" class="summary">${escapeHtml(spec.release.summary)}</p>
          </div>
          <div id="intro-footer" class="intro-footer">
            <span>${escapeHtml(spec.product.descriptor ?? "Product release")}</span>
            <span class="version">v${escapeHtml(spec.product.version)}</span>
          </div>
        </div>
      </section>

      <section id="changes" class="clip" data-start="8" data-duration="10" data-track-index="1">
        <div class="format-pill">PUBLIC RELEASE NOTES</div>
        <div class="scene changes-layout">
          <div class="changes-kicker">What's changed</div>
          <div id="changes-title" class="changes-title">${escapeHtml(spec.release.title)}</div>
          <div class="cards">
            ${highlights}
          </div>
          <div id="changes-footer" class="changes-footer">
            <span>Source</span>
            <span>${escapeHtml(spec.product.repository ?? "public release notes")}</span>
          </div>
        </div>
      </section>

      <section id="outro" class="clip" data-start="18" data-duration="6" data-track-index="1">
        <div class="format-pill">CONCEPT PREVIEW</div>
        <div class="scene outro-layout">
          <div id="outro-mark" class="mark">${escapeHtml(spec.product.name.slice(0, 1).toUpperCase())}</div>
          <div id="outro-cta" class="cta">${escapeHtml(spec.cta.label)}</div>
          <div id="outro-supporting" class="supporting">${escapeHtml(spec.cta.supportingText)}</div>
          <div id="outro-url" class="url">${escapeHtml(spec.cta.url)}</div>
          <div class="disclaimer">Tailored preview from public release data · no customer, partnership or endorsement claim</div>
        </div>
      </section>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const timeline = gsap.timeline({paused: true});

      timeline
        .fromTo("#intro-eyebrow", {opacity: 0, y: 28}, {opacity: 1, y: 0, duration: .55, ease: "power3.out"}, .1)
        .fromTo("#intro-product", {opacity: 0, y: 34}, {opacity: 1, y: 0, duration: .7, ease: "power3.out"}, .28)
        .fromTo("#intro-title", {opacity: 0, y: 58}, {opacity: 1, y: 0, duration: .8, ease: "power3.out"}, .5)
        .fromTo("#intro-summary", {opacity: 0, y: 34}, {opacity: 1, y: 0, duration: .7, ease: "power2.out"}, .9)
        .fromTo("#intro-footer", {opacity: 0}, {opacity: 1, duration: .5}, 1.25)
        .to("#intro .scene", {opacity: 0, y: -26, duration: .5, ease: "power2.in"}, 7.35);

      timeline
        .fromTo("#changes-title", {opacity: 0, y: 34}, {opacity: 1, y: 0, duration: .65, ease: "power3.out"}, 8.15)
        .fromTo("#change-0", {opacity: 0, y: 38}, {opacity: 1, y: 0, duration: .65, ease: "power3.out"}, 8.45)
        .fromTo("#change-1", {opacity: 0, y: 38}, {opacity: 1, y: 0, duration: .65, ease: "power3.out"}, 8.7)
        .fromTo("#change-2", {opacity: 0, y: 38}, {opacity: 1, y: 0, duration: .65, ease: "power3.out"}, 8.95)
        .fromTo("#change-3", {opacity: 0, y: 38}, {opacity: 1, y: 0, duration: .65, ease: "power3.out"}, 9.2)
        .fromTo("#changes-footer", {opacity: 0}, {opacity: 1, duration: .5}, 9.55)
        .to("#changes .scene", {opacity: 0, y: -24, duration: .5, ease: "power2.in"}, 17.35);

      timeline
        .fromTo("#outro-mark", {opacity: 0, scale: .78, rotate: -7}, {opacity: 1, scale: 1, rotate: 0, duration: .75, ease: "back.out(1.5)"}, 18.1)
        .fromTo("#outro-cta", {opacity: 0, y: 38}, {opacity: 1, y: 0, duration: .7, ease: "power3.out"}, 18.45)
        .fromTo("#outro-supporting", {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: .6, ease: "power2.out"}, 18.8)
        .fromTo("#outro-url", {opacity: 0, scale: .94}, {opacity: 1, scale: 1, duration: .55, ease: "power2.out"}, 19.15)
        .to("#outro .scene", {opacity: .96, duration: .1}, 23.9);

      window.__timelines["formbricks-${format}"] = timeline;
    </script>
  </body>
</html>
`;
}

for (const format of formats) {
  const dir = join(outputRoot, format.name);
  mkdirSync(dir, {recursive: true});
  writeFileSync(join(dir, "index.html"), buildComposition(format.name, format.label));
}

console.log(
  `[hyperframes] generated ${formats.length} Formbricks compositions from ReleaseVideoSpec in ${outputRoot}`
);
