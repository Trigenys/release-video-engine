import { releaseShowcases } from "../data/releaseShowcases";
import { ShowcaseMediaPreview } from "./ShowcaseMediaPreview";

export function ReleaseShowcaseGallery() {
  return (
    <section className="content-section showcase-section" id="showcase">
      <div className="showcase-heading">
        <div>
          <p className="eyebrow">Public release demonstrations</p>
          <h2>See what a release can become.</h2>
        </div>
        <p>
          Real public releases, translated into launch-ready visual directions.
          These projects are demonstrations only — not customers, endorsements or partnerships.
        </p>
      </div>

      <div className="showcase-grid">
        {releaseShowcases.map((showcase) => (
          <article className="showcase-card" key={showcase.id}>
            <ShowcaseMediaPreview showcase={showcase} />

            <div className="showcase-card-body">
              <div className="showcase-meta">
                <span>{showcase.templateName}</span>
                <span>{showcase.format}</span>
              </div>

              <div className="showcase-title-row">
                <div>
                  <p>{showcase.repository}</p>
                  <h3>{showcase.product} {showcase.releaseTag}</h3>
                </div>
                <span className="showcase-demo-label">public demo</span>
              </div>

              <p className="showcase-release-title">{showcase.releaseTitle}</p>
              <p className="showcase-summary">{showcase.summary}</p>

              <div className="showcase-actions">
                <a
                  className="showcase-link"
                  href={showcase.releaseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source release
                  <span aria-hidden="true">↗</span>
                </a>
                <span className="showcase-render-id" title={showcase.renderCompositionId}>
                  rendered preview
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="showcase-footnote">
        <span>9:16</span>
        <i />
        <span>1:1</span>
        <i />
        <span>16:9</span>
        <p>One release story, adapted for the channel instead of cropped after the fact.</p>
      </div>
    </section>
  );
}
