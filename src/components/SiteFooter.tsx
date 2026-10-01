import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer className="stitch-footer">
      <div className="stitch-footer-main">
        <div className="stitch-footer-brand">
          <div className="footer-title"><BrandMark /><strong>Release Video Engine</strong></div>
          <p>A Trigenys product experiment.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#proof">Proof</a>
          <a href="#how-it-works">How it works</a>
          <a href="#templates">Templates</a>
          <a href="#contact">Early Access</a>
          <a href="#faq">FAQ</a>
          <a href="https://github.com/EagleFox31/agenfetch-desktop/releases/tag/v0.3.1" target="_blank" rel="noreferrer">AgenFetch v0.3.1 Source →</a>
        </nav>
      </div>
      <div className="stitch-footer-meta">
        <p>Public demonstrations are built from public release data and do not imply a customer, partnership or endorsement relationship.</p>
        <span>© 2026 Release Video Engine</span>
      </div>
    </footer>
  )
}
