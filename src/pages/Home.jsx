import { useEffect, useMemo, useState } from 'react'
import LaunchCarousel from '../components/LaunchCarousel'
import DeveloperCard from '../components/DeveloperCard'
import LaunchCard from '../components/LaunchCard'
import RegionFilter from '../components/RegionFilter'
import { getAllDevelopers, getAllLaunches } from '../data/firestoreApi'

export default function Home() {
  const [launches, setLaunches] = useState([])
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState(null)
  const [developerId, setDeveloperId] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const [l, d] = await Promise.all([getAllLaunches(), getAllDevelopers()])
        setLaunches(l)
        setDevelopers(d)
      } catch (e) {
        console.error('Failed to load home data', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    return launches.filter((l) => {
      if (region && l.region !== region) return false
      if (developerId && l.developerId !== developerId) return false
      return true
    })
  }, [launches, region, developerId])

  const developersInRegion = useMemo(() => {
    if (!region) return []
    const ids = new Set(launches.filter((l) => l.region === region).map((l) => l.developerId))
    return developers.filter((d) => ids.has(d.id))
  }, [region, launches, developers])

  function handleSelectRegion(r) {
    setRegion(r)
    setDeveloperId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Hero / dynamic carousel of every published launch */}
      <section>
        {loading ? (
          <div className="h-[420px] md:h-[520px] rounded-2xl bg-surface animate-pulse" />
        ) : (
          <LaunchCarousel launches={launches} />
        )}
      </section>

      {/* Developers strip */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">Browse by Developer</h2>
            <p className="text-mist text-sm mt-1">
              Tap a developer to see only their launches — no noise from anyone else.
            </p>
          </div>
        </div>
        {developers.length === 0 ? (
          <p className="text-mist text-sm">No developers added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {developers.map((d) => (
              <DeveloperCard key={d.id} developer={d} />
            ))}
          </div>
        )}
      </section>

      {/* Region + developer filter */}
      <section>
        <h2 className="text-xl md:text-2xl font-display font-bold mb-5">Find Launches by Region</h2>
        <RegionFilter
          selectedRegion={region}
          onSelectRegion={handleSelectRegion}
          developersInRegion={developersInRegion}
          selectedDeveloper={developerId}
          onSelectDeveloper={setDeveloperId}
        />

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 && !loading && (
            <p className="text-mist text-sm col-span-full">No launches match this filter yet.</p>
          )}
          {filtered.map((l) => (
            <LaunchCard key={l.id} launch={l} />
          ))}
        </div>
      </section>
    </div>
  )
}
