import { manifest } from './config'
import { Hero } from './sections/Hero'
import { FinalCta } from './sections/FinalCta'
import { EarlyAccessSection } from './sections/EarlyAccessSection'
import { ReleaseShowcaseGallery } from './components/ReleaseShowcaseGallery'
import { CreativeTemplateExplorer } from './components/CreativeTemplateExplorer'
import { SiteFooter } from './components/SiteFooter'
import { MotionReveal } from './motion/MotionReveal'
import {
  CardSection,
  FaqSection,
  ProcessSection,
  TrustSection
} from './sections/DynamicSections'
import type { SectionKind } from './types'

function renderSection(section: SectionKind) {
  switch (section) {
    case 'hero':
      return <Hero manifest={manifest} />
    case 'trust':
      return <TrustSection config={manifest.content.trust} />
    case 'services':
      return <CardSection config={manifest.content.services} kind="services" />
    case 'features':
      return <CardSection config={manifest.content.features} kind="features" />
    case 'process':
      return <ProcessSection config={manifest.content.process} />
    case 'faq':
      return <FaqSection config={manifest.content.faq} />
    case 'contact':
      return <EarlyAccessSection />
    case 'final-cta':
      return <FinalCta config={manifest.content.finalCta} language={manifest.project.language} />
    case 'testimonials':
    case 'pricing':
      return null
  }
}

export default function App() {
  const className = [
    'site',
    'recipe-' + manifest.design.recipe,
    'palette-' + manifest.brand.palette,
    'typography-' + manifest.brand.typography,
    'density-' + manifest.design.density,
    'motion-' + manifest.motion.level
  ].join(' ')

  return (
    <main className={className}>
      {manifest.sections.map((section, index) => {
        const content = (
          <>
            {renderSection(section)}
            {section === 'trust' && (
              <>
                <ReleaseShowcaseGallery />
                <CreativeTemplateExplorer />
              </>
            )}
          </>
        )

        if (section === 'hero') {
          return (
            <div className={'section-slot section-slot-' + section} key={section}>
              {content}
            </div>
          )
        }

        return (
          <MotionReveal
            className={'section-slot section-slot-' + section}
            delayMs={Math.min(index * 24, 96)}
            key={section}
          >
            {content}
          </MotionReveal>
        )
      })}
      <SiteFooter />
    </main>
  )
}
