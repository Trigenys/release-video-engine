import type {
  CardSection as CardSectionConfig,
  FaqSection as FaqSectionConfig,
  ProcessSection as ProcessSectionConfig
} from '../types'

export function CardSection({
  config
}: {
  config: CardSectionConfig
  kind: 'services' | 'features'
}) {
  const icons = ['✦', '⚡', '◫']
  return (
    <section className="stitch-benefits-section" id="capabilities">
      <div className="stitch-section-head">
        <div>
          <p className="stitch-section-label">Section 04 // Core Benefits</p>
          <h2>Release marketing without the<br/><span>manual video grind.</span></h2>
          <p>{config.title}</p>
        </div>
      </div>
      <div className="benefit-grid">
        {config.items.map((item, index) => (
          <article className={'benefit-card benefit-' + index} key={item.title}>
            <span className="benefit-icon">{icons[index] ?? '✦'}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <small>{String(index + 1).padStart(2, '0')} / repeatable system</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ProcessSection({ config }: { config: ProcessSectionConfig }) {
  const visual = [
    ['github.com/org/product', 'release/v0.3.1'],
    ['#FF4370', '#4361EE', '#A8E82E'],
    ['9:16', '1:1', '16:9']
  ]

  return (
    <section className="stitch-process-section" id="how-it-works">
      <div className="stitch-section-head">
        <div>
          <p className="stitch-section-label label-cobalt">Section 02 // The Transformation</p>
          <h2>From changelog to launch asset.<br/><span>No timeline required.</span></h2>
          <p>{config.title}</p>
        </div>
      </div>
      <div className="stitch-process-grid">
        {config.steps.map((step, index) => (
          <article className={'stitch-step step-' + index} key={step.title}>
            <div className="step-top"><span>{String(index + 1).padStart(2, '0')}</span><em>STEP</em></div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className={'step-visual step-visual-' + index}>
              {index === 0 && <>
                <code>{visual[index][0]}</code><strong>{visual[index][1]}</strong>
              </>}
              {index === 1 && <div className="swatch-row">{visual[index].map(v=><i key={v} style={{background:v}} title={v}/>)}</div>}
              {index === 2 && <div className="ratio-row">{visual[index].map(v=><span key={v}>{v}</span>)}</div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FaqSection({ config }: { config: FaqSectionConfig }) {
  return (
    <section className="stitch-faq-section" id="faq">
      <div className="stitch-section-head faq-head">
        <div>
          <p className="stitch-section-label label-cobalt">Section 06 // Frequently Asked Questions</p>
          <h2>Clear answers before you request access.</h2>
          <p>Accurate, hype-free answers about the rendering pipeline and experiment scope.</p>
        </div>
      </div>
      <div className="faq-list stitch-faq-list">
        {config.items.map((item) => (
          <details className="faq-item stitch-faq-item" key={item.question}>
            <summary>{item.question}<span>+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
