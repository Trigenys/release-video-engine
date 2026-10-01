import type { AppFactoryManifest } from '../types'
import { BrandMark } from '../components/BrandMark'
import { ReleaseTransformationStage } from '../components/ReleaseTransformationStage'
import { MotionReveal } from '../motion/MotionReveal'

export function Hero({ manifest }: { manifest: AppFactoryManifest }) {
  const config = manifest.content.hero

  return (
    <>
      <div className="stitch-ticker">
        <div className="stitch-ticker-inner">
          <div>
            <span className="live-dot"><i /></span>
            <strong>✨ CONCIERGE EARLY-ACCESS EXPERIMENT</strong>
            <span className="ticker-slash">/</span>
            <span className="ticker-proof">Live proof ready: <b>AgenFetch v0.3.1</b> 🎉</span>
          </div>
          <div className="ticker-right">
            <span>⚡ Remotion rendering</span>
            <a href="#contact">Request your build →</a>
          </div>
        </div>
      </div>

      <header className="stitch-nav-wrap">
        <nav className="stitch-nav">
          <a className="stitch-logo" href="#top" aria-label="Release Video Engine home">
            <BrandMark />
            <span>
              <span className="stitch-logo-title">
                Release Video Engine
                <small>VIBE</small>
              </span>
              <span className="stitch-logo-sub">GitHub Release <b>→</b> Video Pack 🍿</span>
            </span>
          </a>

          <div className="stitch-nav-links">
            <a href="#proof">Real Proof <em>v0.3.1</em></a>
            <a href="#how-it-works">How it works</a>
            <a href="#templates">Templates <i /></a>
            <a href="#faq">FAQ</a>
          </div>

          <a className="button button-primary stitch-nav-cta" href="#contact">
            Try it on my release <span aria-hidden="true">🚀</span>
          </a>
        </nav>
      </header>

      <section className="stitch-hero" id="top">
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="hero-blob hero-blob-c" />

        <div className="stitch-hero-grid">
          <MotionReveal className="stitch-hero-copy" origin="left">
            <div className="stitch-hero-eyebrow">
              <span>✨</span>
              <strong>FROM GITHUB RELEASE TO VIRAL LAUNCH VIDEOS</strong>
              <em>ZERO TIMELINE EDITING</em>
            </div>

            <h1>
              Your release notes
              <span className="stitch-hero-accent">
                deserve a launch.
                <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 9C50 3 150 2 197 8" />
                </svg>
              </span>
            </h1>

            <p className="stitch-hero-subtitle">
              Turn what you shipped into branded short-form videos for <strong>TikTok, Reels, LinkedIn and YouTube</strong>. One release, zero video editing headaches, three coordinated ready-to-share formats.
            </p>

            <div className="stitch-hero-actions">
              <a className="button button-primary stitch-primary-xl" href="#contact">
                Try it on my release <span>🚀</span>
              </a>
              <a className="button button-secondary stitch-secondary-xl" href="#proof">
                Watch the real proof <span>👀</span> <em>v0.3.1</em>
              </a>
            </div>

            <div className="format-pills">
              <strong>3 Instant Formats:</strong>
              <span className="pill-coral">📱 9:16 Vertical</span>
              <span className="pill-cobalt">💬 1:1 Square</span>
              <span className="pill-lime">📺 16:9 Landscape</span>
            </div>

            <div className="stitch-hero-metrics">
              <div><strong>100% ✨</strong><span>Brand Fidelity</span></div>
              <div><strong>3 Shapes</strong><span>Coordinated Set</span></div>
              <div><strong>0 Min</strong><span>Editing Required</span></div>
            </div>
          </MotionReveal>

          <MotionReveal className="stitch-hero-preview" origin="right" delayMs={90}>
            <ReleaseTransformationStage
              repository="EagleFox31/agenfetch-desktop"
              version="v0.3.1"
              releaseTitle="Multilingual subtitles"
              product="AgenFetch Desktop"
              accentLabel="Seven languages. One launch story."
            />
          </MotionReveal>
        </div>
      </section>
    </>
  )
}
