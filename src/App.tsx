import { manifest } from './config'
import { Hero } from './sections/Hero'
import { FinalCta } from './sections/FinalCta'
import { EarlyAccessSection } from './sections/EarlyAccessSection'
import { ReleaseShowcaseGallery } from './components/ReleaseShowcaseGallery'
import { CreativeTemplateExplorer } from './components/CreativeTemplateExplorer'
import { SiteFooter } from './components/SiteFooter'
import { MotionReveal } from './motion/MotionReveal'
import { CardSection, FaqSection, ProcessSection } from './sections/DynamicSections'

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
      <Hero manifest={manifest} />

      <MotionReveal className="section-slot">
        <ReleaseShowcaseGallery />
      </MotionReveal>

      <MotionReveal className="section-slot" delayMs={24}>
        <ProcessSection config={manifest.content.process} />
      </MotionReveal>

      <MotionReveal className="section-slot" delayMs={48}>
        <CreativeTemplateExplorer />
      </MotionReveal>

      <MotionReveal className="section-slot" delayMs={72}>
        <CardSection config={manifest.content.features} kind="features" />
      </MotionReveal>

      <MotionReveal className="section-slot" delayMs={72}>
        <EarlyAccessSection />
      </MotionReveal>

      <MotionReveal className="section-slot" delayMs={72}>
        <FaqSection config={manifest.content.faq} />
      </MotionReveal>

      <MotionReveal className="section-slot" delayMs={72}>
        <FinalCta config={manifest.content.finalCta} language={manifest.project.language} />
      </MotionReveal>

      <SiteFooter />
    </main>
  )
}
