import { useEffect, useState } from 'react'

const stats = [
  { value: '10K+', label: 'Users Supported' },
  { value: '6', label: 'Addiction Types' },
  { value: '24/7', label: 'AI Support' },
  { value: '89%', label: 'Recovery Rate' },
]

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero__glow hero__glow--purple" />
      <div className="hero__glow hero__glow--green" />

      <div className={`hero__container container${visible ? ' hero--visible' : ''}`}>
        {/* Left — text */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            AI-Powered Recovery Platform
          </div>

          <h1 className="hero__title">
            Break Free From
            <br />
            <span className="gradient-text">Addiction</span> With Your
            <br />
            24/7 AI Companion
          </h1>

          <p className="hero__sub">
            QuitWise is a personalized AI companion that helps you quit addictions,
            manage cravings, improve mental well-being, prevent relapse, and
            maintain long-term recovery — all in one app.
          </p>

          <div className="hero__actions">
            <a href="#cta" className="btn btn--primary btn--lg">
              Start Free Today <span className="btn__arrow">→</span>
            </a>
            <a href="#how-it-works" className="btn btn--ghost btn--lg">
              See How It Works
            </a>
          </div>

          <div className="hero__stats">
            {stats.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-val">{s.value}</span>
                <span className="hero__stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — phone mock */}
        <div className="hero__visual">
          <div className="hero__orb" />
          <div className="hero__phone">
            <div className="hero__phone-notch" />
            <div className="hero__phone-screen">
              <div className="hero__chat-header">
                <div className="hero__chat-avatar">Q</div>
                <div>
                  <div className="hero__chat-name">QuitWise AI</div>
                  <div className="hero__chat-status">● Online · Always here</div>
                </div>
              </div>
              <div className="hero__chat-body">
                <div className="hero__msg hero__msg--ai">
                  🎉 Amazing! You&apos;re on a <strong>7-day streak</strong>!
                </div>
                <div className="hero__msg hero__msg--user">
                  I&apos;m feeling a craving right now…
                </div>
                <div className="hero__msg hero__msg--ai">
                  Let&apos;s breathe together. Inhale for 4… hold… exhale for 6 🧘
                </div>
              </div>
              <div className="hero__progress-bar-wrap">
                <div className="hero__progress-bar">
                  <div className="hero__progress-fill" style={{ width: '68%' }} />
                </div>
                <span className="hero__progress-label">Day 7 of 30 · 68% complete</span>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <div className="hero__chip hero__chip--1">🏆 30-Day Streak!</div>
          <div className="hero__chip hero__chip--2">📊 Mood Improving</div>
          <div className="hero__chip hero__chip--3">🚨 Crisis Support</div>
          <div className="hero__chip hero__chip--4">🧘 Meditation Done</div>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
      </div>
    </section>
  )
}
