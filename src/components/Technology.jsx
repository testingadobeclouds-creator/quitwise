import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const techs = [
  {
    icon: '📱',
    name: 'Flutter / React Native',
    tagline: 'Cross-Platform Mobile',
    desc: 'Build once, run everywhere. Delivers a smooth, native-quality experience on both iOS and Android from a single codebase.',
    pills: ['iOS & Android', 'Hot Reload', 'Native Performance', 'Single Codebase'],
    color: '#3B82F6',
  },
  {
    icon: '🔥',
    name: 'Firebase',
    tagline: 'Real-Time Backend',
    desc: 'Google-grade infrastructure for real-time data sync, secure authentication, and cloud storage — keeping your progress always safe.',
    pills: ['Real-time Sync', 'Auth & Security', 'Cloud Storage', 'Offline Support'],
    color: '#F59E0B',
  },
  {
    icon: '🤖',
    name: 'OpenAI / Gemini API',
    tagline: 'AI Counseling Engine',
    desc: 'State-of-the-art large language models power deeply personalized counseling, smart insights, and adaptive recovery plans.',
    pills: ['GPT-4 / Gemini', 'Personalized AI', 'Natural Language', 'Context-Aware'],
    color: '#7C3AED',
  },
]

export default function Technology() {
  const ref = useIntersectionObserver()
  return (
    <section className="section" id="technology">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">Technology</span>
          <h2 className="section-title">
            Built on <span className="gradient-text">Cutting-Edge Technology</span>
          </h2>
          <p className="section-sub">
            Enterprise-grade infrastructure and the world&apos;s best AI models, deployed in your pocket.
          </p>
        </div>

        <div className="tech-grid">
          {techs.map((t, i) => (
            <TechCard key={t.name} item={t} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TechCard({ item, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div
      className="tech-card fade-up"
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, '--tech-color': item.color }}
    >
      <div className="tech-card__header">
        <span className="tech-card__icon">{item.icon}</span>
        <div>
          <div className="tech-card__tagline">{item.tagline}</div>
          <h3 className="tech-card__name">{item.name}</h3>
        </div>
      </div>
      <p className="tech-card__desc">{item.desc}</p>
      <div className="tech-card__pills">
        {item.pills.map(pill => (
          <span key={pill} className="tech-pill">{pill}</span>
        ))}
      </div>
    </div>
  )
}
