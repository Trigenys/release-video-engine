import type { ReleaseShowcase } from "../data/releaseShowcases";

export function ShowcaseMediaPreview({
  showcase
}: {
  showcase: ReleaseShowcase;
}) {
  return (
    <div className={`showcase-media showcase-media-${showcase.format.replace(":", "x")}`}>
      <img
        src={showcase.previewSrc}
        alt={`${showcase.product} ${showcase.releaseTag} release-video preview in ${showcase.format}`}
        loading="lazy"
        decoding="async"
      />
      <div className="showcase-media-badge">{showcase.format}</div>
    </div>
  );
}
