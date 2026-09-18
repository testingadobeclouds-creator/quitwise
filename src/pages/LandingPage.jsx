import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Problem from '../components/Problem'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import AddictionTypes from '../components/AddictionTypes'
import UniqueAspects from '../components/UniqueAspects'
import NatureStrip from '../components/NatureStrip'
import DailyQuote from '../components/DailyQuote'
import Roadmap from '../components/Roadmap'
import CTABanner from '../components/CTABanner'
import Footer from '../components/Footer'
import AIChat from '../components/AIChat'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <AddictionTypes />
        <UniqueAspects />
        <NatureStrip />
        <DailyQuote />
        <Roadmap />
        <CTABanner />
      </main>
      <Footer />
      {/* Floating AI chat bubble */}
      <AIChat />
    </>
  )
}
