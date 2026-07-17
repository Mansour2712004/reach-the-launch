import { useEffect, useState } from 'react'
import DeveloperCard from '../components/DeveloperCard'
import { getAllDevelopers } from '../data/firestoreApi'
import { useSEO } from '../hooks/useSEO'

export default function Developers() {
  useSEO({
    title: 'Real Estate Developers in Egypt',
    description: 'Browse every real estate developer on Reach The Launch and see only their current launches.',
    keywords: ['شركات مطورين عقاريين', 'developers Egypt real estate', 'real estate companies Egypt'],
  })

  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setDevelopers(await getAllDevelopers())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Developers</h1>
        <p className="text-mist text-sm mt-1">Pick a developer to see only their launches.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-surface animate-pulse" />)}
        </div>
      ) : developers.length === 0 ? (
        <p className="text-mist text-sm">No developers added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {developers.map((d) => <DeveloperCard key={d.id} developer={d} />)}
        </div>
      )}
    </div>
  )
}
