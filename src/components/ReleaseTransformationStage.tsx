type ReleaseTransformationStageProps = {
  repository: string
  version: string
  releaseTitle: string
  product: string
  accentLabel: string
}

export function ReleaseTransformationStage({
  repository,
  version,
  releaseTitle,
  product,
  accentLabel
}: ReleaseTransformationStageProps) {
  return (
    <aside className="stitch-player-wrap" aria-label="AgenFetch release video preview">
      <div className="floating-proof floating-proof-top">
        <span>🔥</span>
        <div><strong>Viral Reach Ready</strong><small>Reels • Shorts • TikTok</small></div>
      </div>
      <div className="floating-proof floating-proof-bottom">
        <span>⚡</span>
        <div><strong>Deterministic Code</strong><small>{product} {version} Proof</small></div>
      </div>

      <div className="stitch-player">
        <div className="player-windowbar">
          <div className="window-dots"><i /><i /><i /></div>
          <code>agenfetch-v0.3.1-preview.mp4</code>
          <span>9:16 MASTER</span>
        </div>

        <div className="player-canvas">
          <div className="player-grid" />
          <div className="player-topline">
            <div><b>AF</b><span>{product}</span></div>
            <em>RELEASE NOTES ✨</em>
          </div>

          <div className="player-center">
            <span className="release-source-card">● TAG {version} SHIP LOG</span>
            <h3>{releaseTitle}<br/><b>{accentLabel}</b></h3>
            <p>Seven subtitle languages, three subtitle catalogues and a local-first desktop workflow.</p>
            <div className="player-diff">
              <div><span>// {repository}</span><b>✦ {version}</b></div>
              <strong>+ multilingual subtitle catalogue</strong>
              <code>&gt; public release data → deterministic video artifact</code>
            </div>
          </div>

          <div className="player-hud">
            <div className="hud-row">
              <div className="wave"><i /><i /><i /><i /></div>
              <strong>PREVIEW ENGINE</strong>
              <span>00:14 / 00:24</span>
            </div>
            <div className="hud-progress"><i /></div>
            <div className="hud-meta"><b>FPS: 60 · H.264</b><b>AUDIO: ORIGINAL BED 🎵</b></div>
          </div>
        </div>

        <div className="player-footer">
          <span>✨ Live Artifact: AgenFetch v0.3.1</span>
          <a href="#proof">View all 3 formats →</a>
        </div>
      </div>
    </aside>
  )
}
