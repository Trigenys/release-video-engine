import type { AppFactoryManifest } from '../types'

export function FinalCta({
  config
}: {
  config: AppFactoryManifest['content']['finalCta']
  language: AppFactoryManifest['project']['language']
}) {
  return (
    <section className="stitch-final-wrap" id="final-cta">
      <div className="stitch-final">
        <p className="final-pill">🚀 NEXT RELEASE READY</p>
        <h2>The next release is already content.<br/><span>Make it look like it.</span></h2>
        <p>{config.subtitle}</p>
        <div className="final-actions">
          <a className="button button-primary stitch-primary-xl" href="#contact">Try it on my release 🚀</a>
          <a className="button button-secondary stitch-secondary-xl" href="#proof">Review AgenFetch Proof ✨</a>
        </div>
      </div>
    </section>
  )
}
