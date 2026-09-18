import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// Curated nature/wellness Unsplash photos
const photos = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Mountain sunrise' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', alt: 'Sunlit forest' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', alt: 'Calm lake' },
  { url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80', alt: 'Morning run' },
  { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', alt: 'Healthy food' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600&q=80', alt: 'Misty mountains' },
]

export default function NatureStrip() {
  const ref = useIntersectionObserver()
  return (
    <section className="nature-strip" id="lifestyle">
      <div className="container">
        <div className="section-header fade-up" ref={ref}>
          <span className="section-tag">Healthy Living</span>
          <h2 className="section-title">
            Recovery Means <span className="gradient-text">Rediscovering Life</span>
          </h2>
          <p className="section-sub">
            Beyond quitting — it&apos;s about reconnecting with nature, health, and joy.
          </p>
        </div>
        <div className="nature-strip__grid">
          {photos.map((p, i) => (
            <NaturePhoto key={p.url} photo={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function NaturePhoto({ photo, delay }) {
  const ref = useIntersectionObserver()
  return (
    <div className="nature-photo fade-up" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <img src={photo.url} alt={photo.alt} loading="lazy" />
      <div className="nature-photo__overlay">
        <span>{photo.alt}</span>
      </div>
    </div>
  )
}
