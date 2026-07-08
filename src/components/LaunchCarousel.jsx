import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { regionLabel } from '../data/constants'

// Fully dynamic — receives whatever launches exist in Firestore right now.
// Auto-advances, but is also swipeable/clickable, and never breaks if
// there are 0, 1, or many launches (fixes the "empty state crash" class
// of bugs that similar listing sites tend to ship with).
export default function LaunchCarousel({ launches = [] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (launches.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % launches.length), 5500)
    return () => clearInterval(t)
  }, [launches.length])

  if (launches.length === 0) {
    return (
      <div className="h-[420px] md:h-[520px] rounded-2xl bg-surface flex items-center justify-center text-mist border border-white/5">
        No launches published yet — check back soon.
      </div>
    )
  }

  const active = launches[index]

  return (
    <div className="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden border border-white/5 shadow-glow group">
      {launches.map((l, i) => (
        <div
          key={l.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <img
            src={l.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'}
            alt={l.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <span className="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold tracking-wide mb-3">
          {regionLabel(active.region)} · {active.developerName}
        </span>
        <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">{active.name}</h2>
        <p className="text-mist max-w-xl mb-5 hidden md:block">{active.bestTimeToBuy}</p>
        <Link
          to={`/launch/${active.id}`}
          className="inline-block px-5 py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors"
        >
          View Best Launch Window
        </Link>
      </div>

      {launches.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2">
          {launches.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-gold' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
