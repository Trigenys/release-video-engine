import type { CSSProperties } from 'react'

type ReleaseTransformationStageProps = {
  repository: string
  version: string
  releaseTitle: string
  product: string
  accentLabel: string
}

const formats = [
  { id: 'vertical', ratio: '9:16', label: 'Reels · Shorts' },
  { id: 'square', ratio: '1:1', label: 'LinkedIn · X' },
  { id: 'landscape', ratio: '16:9', label: 'Launch · Web' }
] as const

export function ReleaseTransformationStage({
  repository,
  version,
  releaseTitle,
  product,
  accentLabel
}: ReleaseTransformationStageProps) {
  return (
    <aside className="release-stage" aria-label="Release transformed into three branded video formats">
      <span className="sr-only">
        A GitHub release is transformed through a reusable brand system into vertical,
        square and landscape launch videos.
      </span>

      <div className="release-stage-glow release-stage-glow-a" aria-hidden="true" />
      <div className="release-stage-glow release-stage-glow-b" aria-hidden="true" />

      <div className="release-source-card" aria-hidden="true">
        <div className="source-card-topline">
          <span className="source-dot" />
          <span>GitHub release</span>
          <span className="source-status">live</span>
        </div>
        <strong>{repository}</strong>
        <div className="source-release-row">
          <span className="source-tag">{version}</span>
          <span>{releaseTitle}</span>
        </div>
        <div className="source-lines">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="brand-engine-card" aria-hidden="true">
        <div className="brand-engine-icon">R</div>
        <div>
          <span>Brand system</span>
          <strong>One release. One visual language.</strong>
        </div>
        <div className="brand-swatches">
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="release-output-stack" aria-hidden="true">
        {formats.map((format, index) => (
          <article
            className={`release-output release-output-${format.id}`}
            key={format.id}
            style={{ '--output-index': index } as CSSProperties}
          >
            <div className="output-frame">
              <div className="output-noise" />
              <div className="output-topline">
                <span>{product}</span>
                <span>{format.ratio}</span>
              </div>
              <div className="output-kicker">Release {version}</div>
              <strong>{accentLabel}</strong>
              <div className="output-motion-bars">
                <span />
                <span />
                <span />
              </div>
              <div className="output-footer">
                <span>brand-safe</span>
                <i />
                <span>ready to publish</span>
              </div>
            </div>
            <div className="output-label">
              <b>{format.ratio}</b>
              <span>{format.label}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="release-stage-caption" aria-hidden="true">
        <span>release.json</span>
        <i />
        <span>brand tokens</span>
        <i />
        <span>3 renders</span>
      </div>
    </aside>
  )
}
