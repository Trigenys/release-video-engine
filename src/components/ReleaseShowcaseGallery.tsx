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
    poster: '/showcases/agenfetch-v0.3.1-vertical.jpg',
    video: '/showcases/agenfetch-v0.3.1-vertical.mp4'
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
    poster: '/showcases/agenfetch-v0.3.1-square.jpg',
    video: '/showcases/agenfetch-v0.3.1-square.mp4'
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
    poster: '/showcases/agenfetch-v0.3.1-landscape.jpg',
    video: '/showcases/agenfetch-v0.3.1-landscape.mp4'
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
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={format.poster}
                  aria-label={'Play AgenFetch v0.3.1 release video in ' + format.ratio}
                  onPlay={(event) => {
                    const active = event.currentTarget;
                    active.closest('.proof-format-grid')?.querySelectorAll('video').forEach((video) => {
                      if (video !== active) video.pause();
                    });
                  }}
                >
                  <source src={format.video} type="video/mp4" />
                  Your browser does not support video playback.
                  <a href={format.video}>Download the {format.ratio} preview</a>.
                </video>
              </div>
              <div className="proof-format-copy">
                <h3>{format.title}</h3>
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
