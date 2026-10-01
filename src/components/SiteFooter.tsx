import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <a className="brand-lockup" href="#top" aria-label="Release Video Engine home">
          <BrandMark />
          <span>
            <strong>Release Video Engine</strong>
            <small>GitHub release → launch content</small>
          </span>
        </a>
        <p>
          Built from real release data. Public demonstrations do not imply a
          customer, partnership or endorsement relationship.
        </p>
      </div>

      <nav className="site-footer-links" aria-label="Footer">
        <a href="#proof">Proof</a>
        <a href="#process">How it works</a>
        <a href="#templates">Templates</a>
        <a href="#contact">Early access</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div className="site-footer-meta">
        <span>© 2026 Release Video Engine</span>
        <span>Early-access experiment</span>
      </div>
    </footer>
  )
}
