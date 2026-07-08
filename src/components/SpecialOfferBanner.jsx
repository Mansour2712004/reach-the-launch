import { Link } from 'react-router-dom'

// Renders nothing at all if no offer is set — the section fully disappears
// from the homepage the moment the admin deletes it, no empty gap left behind.
export default function SpecialOfferBanner({ offer }) {
  if (!offer) return null

  return (
    <section className="relative rounded-2xl overflow-hidden border border-gold/30" style={{ background: 'linear-gradient(135deg, rgba(212,175,106,0.14), rgba(31,182,166,0.08))' }}>
      <div className="grid md:grid-cols-2 items-center">
        {offer.image && (
          <div className="h-56 md:h-full">
            <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-10">
          <span className="inline-block px-3 py-1 rounded-full bg-gold text-ink text-xs font-bold tracking-wide mb-4">
            SPECIAL OFFER
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">{offer.title}</h2>
          {offer.description && <p className="text-mist mb-6 leading-relaxed">{offer.description}</p>}
          {offer.ctaLink && (
            <Link
              to={offer.ctaLink}
              className="inline-block px-5 py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors"
            >
              {offer.ctaText || 'Learn More'}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
