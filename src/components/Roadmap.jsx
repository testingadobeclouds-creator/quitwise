import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const roadmap = [
  {
    icon: '⌚',
    title: 'Health & Wearable Integration',
    desc: 'Sync with Apple Watch, Fitbit, and health apps to track heart rate, sleep, and physical recovery metrics.',
    quarter: 'Q1 2025',
    status: 'upcoming',
  },
  {
    icon: '🎙️',
    title: 'AI Voice Counseling',
    desc: 'Talk to your AI counselor naturally with voice conversations for a more human and connected experience.',
    quarter: 'Q2 2025',
    status: 'upcoming',
  },
  {
    icon: '👨‍⚕️',
    title: 'Doctor & Rehab Connections',
    desc: 'Connect directly with verified medical professionals and certified rehabilitation organizations through the app.',
    quarter: 'Q2 2025',
    status: 'upcoming',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Family Monitoring Dashboard',
    desc: 'Give loved ones a window into your recovery journey with progress sharing, milestones, and alert notifications.',
    quarter: 'Q3 2025',
    status: 'planned',
  },
  {
    icon: '🏛️',
    title: 'Government Partnerships',
    desc: 'Integrate with national health programs and government recovery initiatives for broader societal impact.',
    quarter: 'Q4 2025',
    status: 'planned',
  },
  {
    icon: '🌐',
    title: 'Anonymous Support Communities',
    desc: 'Join private, moderated communities of people on similar recovery journeys — completely safe and anonymous.',
    quarter: 'Q4 2025',
    status: 'planned',
  },
]

export default function Roadmap() {
  const ref = useIntersectionObserver()
  return (
    <section className="section section--alt" id="roadmap">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">Roadmap</span>
          <h2 className="section-title">
            What&apos;s <span className="gradient-text">Coming Next</span>
          </h2>
          <p className="section-sub">
            We&apos;re just getting started. Here&apos;s what&apos;s on the horizon for QuitWise.
          </p>
        </div>

        <div className="roadmap-grid">
          {roadmap.map((item, i) => (
            <RoadmapCard key={item.title} item={item} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RoadmapCard({ item, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div className={`roadmap-card fade-up roadmap-card--${item.status}`} ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <div className="roadmap-card__header">
        <span className="roadmap-card__icon">{item.icon}</span>
        <span className="roadmap-card__quarter">{item.quarter}</span>
      </div>
      <h3 className="roadmap-card__title">{item.title}</h3>
      <p className="roadmap-card__desc">{item.desc}</p>
      <div className={`roadmap-card__status roadmap-card__status--${item.status}`}>
        {item.status === 'upcoming' ? '🔧 In Development' : '📋 Planned'}
      </div>
    </div>
  )
}
