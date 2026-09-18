import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

const steps = [
  {
    number: '01',
    icon: '📱',
    title: 'Register & Select Addiction',
    desc: 'Create your account and choose your addiction type — alcohol, tobacco, drugs, gambling, gaming, or social media.',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'Complete AI Assessment',
    desc: 'Answer a short questionnaire about your history, triggers, and goals. Our AI builds a complete understanding of your situation.',
  },
  {
    number: '03',
    icon: '🎯',
    title: 'Receive Your Quit Plan',
    desc: 'Get a fully personalized recovery roadmap with daily tasks, milestones, and strategies crafted uniquely for you.',
  },
  {
    number: '04',
    icon: '📅',
    title: 'Daily Tasks & Meditation',
    desc: 'Follow your plan, complete mindfulness exercises, journal your thoughts, and build healthy habits every single day.',
  },
  {
    number: '05',
    icon: '📈',
    title: 'Track Progress & Celebrate',
    desc: 'Watch your health metrics improve, earn achievement badges, and celebrate every milestone toward sustained recovery.',
  },
]

export default function HowItWorks() {
  const ref = useIntersectionObserver()
  return (
    <section className="section section--alt" id="how-it-works">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">
            Your Recovery Journey, <span className="gradient-text">Step by Step</span>
          </h2>
          <p className="section-sub">
            A simple, guided process that takes you from struggling to thriving in five clear steps.
          </p>
        </div>

        <div className="steps">
          {steps.map((step, i) => (
            <StepItem key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepItem({ step, index, isLast }) {
  const ref = useIntersectionObserver()
  return (
    <div className={`step fade-up${!isLast ? ' step--connected' : ''}`} ref={ref} style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="step__left">
        <div className="step__num-wrap">
          <span className="step__num">{step.number}</span>
        </div>
        {!isLast && <div className="step__line" />}
      </div>
      <div className="step__body">
        <div className="step__icon">{step.icon}</div>
        <div className="step__text">
          <h3 className="step__title">{step.title}</h3>
          <p className="step__desc">{step.desc}</p>
        </div>
      </div>
    </div>
  )
}
