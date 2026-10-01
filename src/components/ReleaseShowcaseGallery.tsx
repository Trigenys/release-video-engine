const formats = [
  {
    id: 'vertical',
    number: '01',
    ratio: '9:16',
    label: 'TikTok, Reels, Shorts',
    resolution: '1080×1920',
    className: 'proof-coral',
    title: 'Multilingual subtitles',
    copy: 'Built for thumb-stopping vertical release storytelling.',
    image: '/showcases/agenfetch-v031-vertical.svg'
  },
  {
    id: 'square',
    number: '02',
    ratio: '1:1',
    label: 'LinkedIn & X Feed',
    resolution: '1080×1080',
    className: 'proof-cobalt',
    title: 'Seven languages. One release.',
    copy: 'Balanced feed hierarchy for muted autoplay and launch posts.',
    image: '/showcases/agenfetch-v031-vertical.svg'
  },
  {
    id: 'landscape',
    number: '03',
    ratio: '16:9',
    label: 'YouTube & Product Launches',
    resolution: '1920×1080',
    className: 'proof-lime',
    title: 'One source, channel-ready output',
    copy: 'Wide-format framing for changelogs, docs and product launches.',
    image: '/showcases/agenfetch-v031-vertical.svg'
  }
] as const

export function ReleaseShowcaseGallery() {
  return (
    <section className="stitch-proof-section" id="proof">
      <div className="stitch-sheet" id="showcase">
        <div className="stitch-section-head proof-head">
          <div>
            <p className="stitch-section-label">Section 01 // Real Proof</p>
            <h2>One real release.<br/><span>Three launch-ready formats.</span></h2>
            <p>
              We parsed the public GitHub release for <strong>AgenFetch v0.3.1</strong>.
              Without touching a video editor, structured release notes compiled into
              three coordinated video formats.
            </p>
          </div>
          <div className="proof-source">
            <a href="https://github.com/EagleFox31/agenfetch-desktop/releases/tag/v0.3.1" target="_blank" rel="noreferrer">
              View source release on GitHub (v0.3.1) →
            </a>
            <span>● Remotion deterministic render engine</span>
          </div>
        </div>

        <div className="proof-format-grid">
          {formats.map((format) => (
            <article className={'proof-format-card ' + format.className} key={format.id}>
              <div className="proof-format-head">
                <div><strong>{format.number} // {format.ratio}</strong><span>{format.label}</span></div>
                <em>{format.resolution}</em>
              </div>
              <div className={'showcase-media proof-media proof-media-' + format.id}>
                <img src={format.image} alt={'AgenFetch v0.3.1 preview in ' + format.ratio} loading="lazy" decoding="async" />
                <div className="proof-overlay">
                  <span>AGENFETCH v0.3.1</span>
                  <h3>{format.title}</h3>
                  <p>{format.copy}</p>
                </div>
              </div>
              <div className="proof-format-copy">
                <strong>✦ {format.copy}</strong>
                <p>Same public release payload, adapted to the channel instead of cropped after the fact.</p>
              </div>
            </article>
          ))}
        </div>

        <div className="proof-footnote">
          <span>⚡ Deterministic</span>
          <span>🎨 Brand-configurable</span>
          <span>📐 3 aspect ratios</span>
          <span>Public demo — not a customer or endorsement.</span>
        </div>
      </div>
    </section>
  )
}
