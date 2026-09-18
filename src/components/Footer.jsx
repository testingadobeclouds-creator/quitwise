const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Addiction Types', href: '#addictions' },
    { label: 'Technology', href: '#technology' },
    { label: 'Roadmap', href: '#roadmap' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Crisis Hotlines', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <span>🌿</span> QuitWise
            </a>
            <p className="footer__tagline">
              Your personalized 24/7 AI companion for quitting addictions, managing cravings,
              and building a healthier life — one day at a time.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter" className="footer__social">𝕏</a>
              <a href="#" aria-label="Instagram" className="footer__social">📸</a>
              <a href="#" aria-label="LinkedIn" className="footer__social">💼</a>
              <a href="#" aria-label="Discord" className="footer__social">💬</a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer__col">
              <h4 className="footer__col-title">{category}</h4>
              <ul className="footer__col-links">
                {links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} QuitWise. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            QuitWise is a supportive tool and is not a substitute for professional medical advice.
            If you are in crisis, please contact emergency services.
          </p>
        </div>
      </div>
    </footer>
  )
}
