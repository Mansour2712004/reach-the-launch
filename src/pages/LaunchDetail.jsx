import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLaunchById } from '../data/firestoreApi'
import { regionLabel } from '../data/constants'
import ContactForm from '../components/ContactForm'
import { useSEO } from '../hooks/useSEO'

export default function LaunchDetail() {
  const { id } = useParams()
  const [launch, setLaunch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        setLaunch(await getLaunchById(id))
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  useSEO({
    title: launch?.name,
    description: launch
      ? `${launch.name} by ${launch.developerName} in ${regionLabel(launch.region)}. ${launch.bestTimeToBuy || launch.description || ''}`.slice(0, 160)
      : undefined,
    keywords: launch?.keywords,
    image: launch?.coverImage,
  })

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10"><div className="h-96 rounded-2xl bg-surface animate-pulse" /></div>
  }

  if (!launch) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-mist mb-4">This launch could not be found.</p>
        <Link to="/launches" className="text-gold hover:underline">Back to all launches</Link>
      </div>
    )
  }

  const gallery = launch.gallery?.length ? launch.gallery : [launch.coverImage].filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl overflow-hidden h-72 md:h-[420px] border border-white/5">
          <img src={gallery[activeImage] || ''} alt={launch.name} className="w-full h-full object-cover" />
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-3 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === activeImage ? 'border-gold' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-teal/15 text-teal text-xs font-semibold mb-3">
            {regionLabel(launch.region)}
          </span>
          <h1 className="text-2xl md:text-4xl font-display font-bold mb-2">{launch.name}</h1>
          <Link to={`/developers/${launch.developerId}`} className="text-mist hover:text-gold text-sm">
            by {launch.developerName}
          </Link>
        </div>

        {launch.bestTimeToBuy && (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-5">
            <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-1">Best Time to Buy</p>
            <p className="text-white">{launch.bestTimeToBuy}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          {launch.priceStart && (
            <div className="bg-surface border border-white/5 rounded-xl p-4">
              <p className="text-xs text-mist mb-1">Starting Price</p>
              <p className="font-semibold">{launch.priceStart}</p>
            </div>
          )}
          {launch.launchStart && (
            <div className="bg-surface border border-white/5 rounded-xl p-4">
              <p className="text-xs text-mist mb-1">Launch Window</p>
              <p className="font-semibold">
                {launch.launchStart}{launch.launchEnd ? ` – ${launch.launchEnd}` : ''}
              </p>
            </div>
          )}
          {launch.unitTypes?.length > 0 && (
            <div className="bg-surface border border-white/5 rounded-xl p-4">
              <p className="text-xs text-mist mb-1">Unit Types</p>
              <p className="font-semibold text-sm">{launch.unitTypes.join(', ')}</p>
            </div>
          )}
        </div>

        {launch.description && (
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">About the Project</h2>
            <p className="text-mist leading-relaxed whitespace-pre-line">{launch.description}</p>
          </div>
        )}

        {launch.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {launch.keywords.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full bg-surface2 border border-white/10 text-xs text-mist">
                {k}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-24 h-fit">
        <h2 className="font-display font-semibold text-lg mb-4">Interested in this launch?</h2>
        <ContactForm launchId={launch.id} launchName={launch.name} />
      </div>
    </div>
  )
}
