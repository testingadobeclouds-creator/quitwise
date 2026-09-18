import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const problems = [
  {
    icon: '😔',
    title: 'No Continuous Motivation',
    desc: 'Most apps fail to keep users engaged after the first week, leading to early dropout and relapse.',
  },
  {
    icon: '🎯',
    title: 'Generic, One-Size-Fits-All Plans',
    desc: "Cookie-cutter programs don't account for individual triggers, addiction history, or personal goals.",
  },
  {
    icon: '⏰',
    title: 'No Real-Time Craving Support',
    desc: "Cravings strike at 2 AM. Traditional counseling isn't available when you need it most.",
  },
  {
    icon: '💰',
    title: 'Unaffordable Counseling',
    desc: 'Professional therapy is expensive and inaccessible for most people who need recovery support.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'No Family Involvement',
    desc: 'Recovery happens in isolation without tools to involve loved ones in the healing journey.',
  },
  {
    icon: '📉',
    title: 'Poor Relapse Prevention',
    desc: 'Without smart monitoring, warning signs go unnoticed and users fall back into addiction.',
  },
]

export default function Problem() {
  const ref = useIntersectionObserver()
  return (
    <section className="section section--alt" id="problem">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">The Problem</span>
          <h2 className="section-title">
            Why Recovery Is Hard <span className="gradient-text">Without the Right Support</span>
          </h2>
          <p className="section-sub">
            Existing solutions leave critical gaps that lead to frustration, isolation, and relapse.
          </p>
        </div>

        <div className="problem-grid">
          {problems.map((p, i) => (
            <ProblemCard key={p.title} item={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemCard({ item, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div className="problem-card fade-up" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <div className="problem-card__icon">{item.icon}</div>
      <h3 className="problem-card__title">{item.title}</h3>
      <p className="problem-card__desc">{item.desc}</p>
    </div>
  )
}
