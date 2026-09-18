import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const aspects = [
  {
    icon: '🧠',
    title: 'AI Motivation Engine',
    desc: 'Adapts to your behavior patterns in real time and sends perfectly timed motivational nudges exactly when you need them most.',
    tag: 'Personalized',
  },
  {
    icon: '🔮',
    title: 'Smart Relapse Prevention',
    desc: 'Predictive AI continuously monitors your risk factors and triggers early intervention before a relapse can occur.',
    tag: 'Predictive',
  },
  {
    icon: '❤️',
    title: 'Health Recovery Timeline',
    desc: 'A visual timeline showing exactly how your body and mind heal over days, weeks, and months of sustained recovery.',
    tag: 'Motivating',
  },
  {
    icon: '🧘',
    title: 'AI Meditation Coach',
    desc: 'Personalized mindfulness and breathing sessions that dynamically adapt to your current stress level and emotional state.',
    tag: 'Adaptive',
  },
  {
    icon: '🚨',
    title: 'Emergency Help Button',
    desc: 'One-tap access to crisis support, guided breathing exercises, and professional hotlines during the most intense craving moments.',
    tag: 'Life-saving',
  },
]

export default function UniqueAspects() {
  const ref = useIntersectionObserver()
  return (
    <section className="section section--alt" id="unique">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">What Sets Us Apart</span>
          <h2 className="section-title">
            Uniquely <span className="gradient-text">Built for Recovery</span>
          </h2>
          <p className="section-sub">
            Five innovations that make QuitWise unlike anything else in the recovery space.
          </p>
        </div>

        <div className="unique-grid">
          {aspects.map((a, i) => (
            <UniqueCard key={a.title} item={a} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  )
}

function UniqueCard({ item, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div className="unique-card fade-up" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <div className="unique-card__top">
        <span className="unique-card__icon">{item.icon}</span>
        <span className="unique-card__tag">{item.tag}</span>
      </div>
      <h3 className="unique-card__title">{item.title}</h3>
      <p className="unique-card__desc">{item.desc}</p>
    </div>
  )
}
