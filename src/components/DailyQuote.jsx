// Curated wellness & recovery quotes — one per day (rotates by day-of-year)
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Every day is a new beginning. Take a deep breath and start again.", author: "Unknown" },
  { text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You are stronger than your addiction.", author: "QuitWise" },
  { text: "One day at a time. One breath at a time. One step at a time.", author: "QuitWise" },
  { text: "Healing is not linear, but every step forward counts.", author: "QuitWise" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  { text: "The present moment is the only time over which we have dominion.", author: "Thich Nhat Hanh" },
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Strength does not come from winning. It comes from struggle and choice to never surrender.", author: "Arnold Schwarzenegger" },
  { text: "The beautiful journey of today can only begin when we learn to let go of yesterday.", author: "Steve Maraboli" },
  { text: "Your body is your most priceless possession. Take care of it.", author: "Jack LaLanne" },
  { text: "Progress, not perfection.", author: "AA Philosophy" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Happiness is not something you postpone for the future; it is something you design for the present.", author: "Jim Rohn" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "To heal a wound you need to stop touching it.", author: "Unknown" },
  { text: "Sometimes you have to step outside of the person you've been, and remember the person you were meant to be.", author: "Unknown" },
  { text: "Every morning we are born again. What we do today is what matters most.", author: "Buddha" },
  { text: "The ocean doesn't apologize for its depth, and the mountains don't seek forgiveness for the space they take up.", author: "Becca Lee" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "You are enough. You have always been enough. You will always be enough.", author: "QuitWise" },
]

// Nature images from Unsplash (specific curated photo IDs)
const NATURE_IMAGES = [
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80', // forest
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', // mountains
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80', // peaceful lake
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80', // sunrise
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80', // green forest
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=80', // misty mountains
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80', // waterfall
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80', // valley
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', // calm sea
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', // mountain peak
]

function getDayIndex(arr) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return dayOfYear % arr.length
}

export default function DailyQuote() {
  const quote  = QUOTES[getDayIndex(QUOTES)]
  const imgUrl = NATURE_IMAGES[getDayIndex(NATURE_IMAGES)]

  return (
    <section className="daily-quote" id="daily-quote">
      <div
        className="daily-quote__bg"
        style={{ backgroundImage: `url(${imgUrl})` }}
      />
      <div className="daily-quote__overlay" />
      <div className="container daily-quote__inner">
        <div className="daily-quote__tag">✨ Daily Inspiration</div>
        <blockquote className="daily-quote__text">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <cite className="daily-quote__author">— {quote.author}</cite>
        <p className="daily-quote__note">
          A new quote to inspire your recovery journey, every single day.
        </p>
      </div>
    </section>
  )
}
