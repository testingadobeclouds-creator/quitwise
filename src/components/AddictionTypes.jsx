import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const addictions = [
  {
    icon: '🍺',
    name: 'Alcohol',
    desc: 'Overcome alcohol dependency with personalized detox support, trigger identification, and craving management strategies.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    icon: '🚬',
    name: 'Tobacco',
    desc: 'Quit smoking or vaping with nicotine craving alerts, habit replacement techniques, and real-time health milestones.',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
  },
  {
    icon: '💊',
    name: 'Drugs',
    desc: 'Find a safe path through substance recovery with AI guidance, community peer support, and emergency crisis tools.',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
  },
  {
    icon: '🎰',
    name: 'Gambling',
    desc: 'Break the gambling cycle with financial recovery tools, behavioral therapy techniques, and compulsion trigger tracking.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: '🎮',
    name: 'Gaming',
    desc: 'Establish healthy boundaries, replace compulsive habits with rewarding activities, and rediscover real-world connections.',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: '📱',
    name: 'Social Media',
    desc: 'Reclaim your attention and mental health from social media addiction with screen time insights and digital detox plans.',
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
  },
]

export default function AddictionTypes() {
  const ref = useIntersectionObserver()
  return (
    <section className="section" id="addictions">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">Addiction Types</span>
          <h2 className="section-title">
            Support for <span className="gradient-text">Every Addiction</span>
          </h2>
          <p className="section-sub">
            Whether it&apos;s substances, behaviors, or digital habits — QuitWise has a tailored program for you.
          </p>
        </div>

        <div className="addiction-grid">
          {addictions.map((a, i) => (
            <AddictionCard key={a.name} item={a} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AddictionCard({ item, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div
      className="addiction-card fade-up"
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, '--card-color': item.color, '--card-bg': item.bg }}
    >
      <div className="addiction-card__top">
        <div className="addiction-card__icon">{item.icon}</div>
        <h3 className="addiction-card__name">{item.name}</h3>
      </div>
      <p className="addiction-card__desc">{item.desc}</p>
      <div className="addiction-card__cta">
        Get Support <span>→</span>
      </div>
    </div>
  )
}
