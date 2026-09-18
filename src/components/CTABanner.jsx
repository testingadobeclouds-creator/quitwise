import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

export default function CTABanner() {
  const ref = useIntersectionObserver()
  return (
    <section className="cta-banner" id="cta">
      <div className="cta-banner__glow cta-banner__glow--left" />
      <div className="cta-banner__glow cta-banner__glow--right" />
      <div className="container">
        <div className="cta-banner__inner fade-up" ref={ref}>
          <div className="cta-banner__badge">🌿 Free to Get Started</div>
          <h2 className="cta-banner__title">
            Start Your Recovery Journey <span className="gradient-text">Today</span>
          </h2>
          <p className="cta-banner__sub">
            Join thousands of people who are reclaiming their lives with QuitWise.
            Your 24/7 AI companion is ready whenever you are — no judgment, just support.
          </p>
          <div className="cta-banner__actions">
            <a href="#" className="btn btn--primary btn--xl">
              Get Early Access — It&apos;s Free
            </a>
            <a href="#features" className="btn btn--ghost btn--xl">
              Explore Features
            </a>
          </div>
          <p className="cta-banner__note">
            No credit card required · Cancel anytime · Private &amp; secure
          </p>
        </div>
      </div>
    </section>
  )
}
