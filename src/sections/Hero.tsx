import type { AppFactoryManifest } from '../types'
import { BrandMark } from '../components/BrandMark'
import { ReleaseTransformationStage } from '../components/ReleaseTransformationStage'
import { MotionReveal } from '../motion/MotionReveal'

function industryLabel(
  industry: AppFactoryManifest['strategy']['industry'],
  language: AppFactoryManifest['project']['language']
) {
  const labels = {
    legal: { fr: 'Conseil juridique', en: 'Legal counsel' },
    technology: { fr: 'Technologie', en: 'Technology' },
    finance: { fr: 'Services financiers', en: 'Financial services' },
    healthcare: { fr: 'Santé', en: 'Healthcare' },
    education: { fr: 'Éducation', en: 'Education' },
    logistics: { fr: 'Logistique', en: 'Logistics' },
    'real-estate': { fr: 'Immobilier', en: 'Real estate' },
    ecommerce: { fr: 'Commerce', en: 'Commerce' },
    hospitality: { fr: 'Hospitalité', en: 'Hospitality' },
    creative: { fr: 'Création', en: 'Creative work' },
    general: { fr: 'Services', en: 'Services' }
  }
  return labels[industry][language]
}

function goalLabel(
  goal: AppFactoryManifest['strategy']['goal'],
  language: AppFactoryManifest['project']['language']
) {
  const labels = {
    leads: { fr: 'Générer des demandes', en: 'Generate leads' },
    bookings: { fr: 'Prise de rendez-vous', en: 'Book consultations' },
    sales: { fr: 'Conversion', en: 'Drive sales' },
    signup: { fr: 'Inscription', en: 'Drive signups' },
    contact: { fr: 'Prise de contact', en: 'Start conversations' },
    awareness: { fr: 'Notoriété', en: 'Build awareness' }
  }
  return labels[goal][language]
}

function HeroTitle({ title }: { title: string }) {
  const accent = 'deserve a launch.'
  const normalized = title.toLowerCase()
  const accentIndex = normalized.indexOf(accent)

  if (accentIndex === -1) {
    return <>{title}</>
  }

  const before = title.slice(0, accentIndex).trim()
  const highlighted = title.slice(accentIndex)

  return (
    <>
      <span>{before}</span>
      <span className="hero-title-accent">{highlighted}</span>
    </>
  )
}

export function Hero({ manifest }: { manifest: AppFactoryManifest }) {
  const config = manifest.content.hero
  const { project, strategy, design } = manifest
  const supportingCards = manifest.sections.includes('services')
    ? manifest.content.services.items
    : manifest.content.features.items

  return (
    <section className={'hero-shell hero-' + design.recipe} id="top">
      <nav className="nav-shell">
        <a className="brand-lockup" href="#top" aria-label={project.name + ' home'}>
          <BrandMark />
          <span>
            <strong>{project.name}</strong>
            <small>Release → campaign</small>
          </span>
        </a>

        <div className="nav-links">
          <a href="#proof">Proof</a>
          <a href="#process">How it works</a>
          <a href="#templates">Templates</a>
          <a href="#faq">FAQ</a>
          <a className="button button-primary nav-cta" href="#contact">
            Try my release
          </a>
        </div>
      </nav>

      <div className="hero-grid">
        <MotionReveal className="hero-copy" origin="left">
          <div className="hero-signal-row">
            <p className="hero-signal">
              <span aria-hidden="true">✦</span>
              Concierge early-access experiment
            </p>
            <span className="hero-version-chip">AgenFetch v0.3.1 proof</span>
          </div>

          {config.eyebrow && <p className="eyebrow">{config.eyebrow}</p>}
          <h1>
            <HeroTitle title={config.title} />
          </h1>
          <p className="hero-subtitle">{config.subtitle}</p>

          <div className="hero-actions">
            <a className="button button-primary" href={config.primaryCta.href}>
              {config.primaryCta.label}
              <span aria-hidden="true">↗</span>
            </a>
            {config.secondaryCta && (
              <a className="button button-secondary" href={config.secondaryCta.href}>
                {config.secondaryCta.label}
                <span aria-hidden="true">◉</span>
              </a>
            )}
          </div>

          {design.recipe === 'saas' && (
            <div className="hero-metrics" aria-label="Product proof points">
              <div>
                <strong>100%</strong>
                <span>public release data</span>
              </div>
              <div>
                <strong>3</strong>
                <span>launch formats</span>
              </div>
              <div>
                <strong>0</strong>
                <span>timeline edits</span>
              </div>
            </div>
          )}
        </MotionReveal>

        {design.recipe === 'luxury' && (
          <aside
            className="hero-visual hero-editorial"
            aria-label={project.language === 'fr' ? 'Positionnement' : 'Positioning'}
          >
            <div className="editorial-monogram">{project.name.slice(0, 2).toUpperCase()}</div>
            <div className="editorial-rule" />
            <p>{project.language === 'fr' ? 'Positionnement' : 'Positioning'}</p>
            <strong>{industryLabel(strategy.industry, project.language)}</strong>
            <dl>
              <div>
                <dt>{project.language === 'fr' ? 'Public' : 'Audience'}</dt>
                <dd>{strategy.audience || (project.language === 'fr' ? 'Clients exigeants' : 'Discerning clients')}</dd>
              </div>
              <div>
                <dt>{project.language === 'fr' ? 'Objectif' : 'Goal'}</dt>
                <dd>{goalLabel(strategy.goal, project.language)}</dd>
              </div>
            </dl>
          </aside>
        )}

        {design.recipe === 'saas' && (
          <MotionReveal className="hero-stage-motion" origin="right" delayMs={90}>
            <ReleaseTransformationStage
              repository="EagleFox31/agenfetch-desktop"
              version="0.3.1"
              releaseTitle="Multilingual subtitles"
              product="AgenFetch"
              accentLabel="Seven languages. One launch story."
            />
          </MotionReveal>
        )}

        {design.recipe === 'corporate' && (
          <aside
            className="hero-visual hero-corporate"
            aria-label={project.language === 'fr' ? 'Capacités clés' : 'Key capabilities'}
          >
            <p className="hero-visual-kicker">{project.language === 'fr' ? 'Priorités' : 'Priorities'}</p>
            {supportingCards.slice(0, 3).map((item, index) => (
              <div className="corporate-row" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </aside>
        )}
      </div>
    </section>
  )
}
