import { useEffect, useMemo, useState } from 'react'
import LaunchCard from '../components/LaunchCard'
import RegionFilter from '../components/RegionFilter'
import { getAllDevelopers, getAllLaunches } from '../data/firestoreApi'
import { useSEO } from '../hooks/useSEO'

export default function AllLaunches() {
  useSEO({
    title: 'All Real Estate Launches',
    description: 'Browse every current property launch in Egypt — East Cairo, West Cairo, North Coast and Ain Sokhna, filterable by region and developer.',
    keywords: ['كل اللونشات العقارية', 'لونش عقاري جديد', 'all real estate launches Egypt', 'مشاريع عقارية 2026'],
  })

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">All Launches</h1>
        <p className="text-mist text-sm mt-1">Every project currently tracked on Reach The Launch.</p>
      </div>

      <RegionFilter
        selectedRegion={region}
        onSelectRegion={(r) => { setRegion(r); setDeveloperId(null) }}
        developersInRegion={developersInRegion}
        selectedDeveloper={developerId}
        onSelectDeveloper={setDeveloperId}
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 && <p className="text-mist text-sm col-span-full">No launches match this filter.</p>}
          {filtered.map((l) => (
            <LaunchCard key={l.id} launch={l} />
          ))}
        </div>
      )}
    </div>
  )
}
