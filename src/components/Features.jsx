import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const features = [
  {
    icon: '🤖',
    title: 'AI Chat Consultant',
    desc: 'Personalized 24/7 counseling powered by advanced AI — always available, never judgmental.',
    accent: '#7C3AED',
  },
  {
    icon: '🎯',
    title: 'Personalized Quit Plans',
    desc: 'AI-generated recovery plans tailored to your addiction type, personal history, and lifestyle.',
    accent: '#10B981',
  },
  {
    icon: '📔',
    title: 'Daily Journal & Challenges',
    desc: 'Track thoughts, complete daily challenges, and build healthy habits one day at a time.',
    accent: '#F59E0B',
  },
  {
    icon: '🧘',
    title: 'Meditation & Breathing',
    desc: 'Guided mindfulness sessions and breathing exercises to manage stress and quiet cravings.',
    accent: '#3B82F6',
  },
  {
    icon: '📊',
    title: 'Mood & Health Tracking',
    desc: 'Monitor your emotional state, sleep quality, and physical health improvements over time.',
    accent: '#EC4899',
  },
  {
    icon: '🏆',
    title: 'Achievements & Streaks',
    desc: 'Celebrate milestones with badges and streak rewards that keep your motivation soaring.',
    accent: '#F59E0B',
  },
  {
    icon: '🚨',
    title: 'Emergency Craving Support',
    desc: 'Instant crisis tools during intense cravings: hotlines, exercises, and AI crisis guidance.',
    accent: '#EF4444',
  },
  {
    icon: '👥',
    title: 'Community & Progress Reports',
    desc: 'Connect with others in recovery, share progress, and access detailed health reports.',
    accent: '#10B981',
  },
]

export default function Features() {
  const ref = useIntersectionObserver()
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">Features</span>
          <h2 className="section-title">
            Everything You Need to <span className="gradient-text">Recover & Thrive</span>
          </h2>
          <p className="section-sub">
            A complete toolkit designed by recovery experts and powered by cutting-edge AI.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <FeatureCard key={f.title} item={f} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ item, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div className="feature-card fade-up" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <div className="feature-card__icon-wrap" style={{ '--accent': item.accent }}>
        <span className="feature-card__icon">{item.icon}</span>
      </div>
      <h3 className="feature-card__title">{item.title}</h3>
      <p className="feature-card__desc">{item.desc}</p>
    </div>
  )
}
