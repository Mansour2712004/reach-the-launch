import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import LaunchCard from '../components/LaunchCard'
import { getLaunchesByDeveloper } from '../data/firestoreApi'

export default function DeveloperPage() {
  const { id } = useParams()
  const [developer, setDeveloper] = useState(null)
  const [launches, setLaunches] = useState([])
  const [loading, setLoading] = useState(true)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const [devSnap, devLaunches] = await Promise.all([
          getDoc(doc(collection(db, 'developers'), id)),
          getLaunchesByDeveloper(id),
        ])
        setDeveloper(devSnap.exists() ? { id: devSnap.id, ...devSnap.data() } : null)
        setLaunches(devLaunches)
        setLogoFailed(false)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const showLogo = developer?.logo && !logoFailed

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {loading ? (
        <div className="h-24 rounded-xl bg-surface animate-pulse" />
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
            {showLogo ? (
              <img
                src={developer.logo}
                alt={developer?.name}
                className="w-full h-full object-cover"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="text-gold font-display font-bold text-lg">{developer?.name?.[0]}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-display font-bold">{developer?.name || 'Developer'}</h1>
            <p className="text-mist text-sm mt-1">{developer?.description}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loading && launches.length === 0 && (
          <p className="text-mist text-sm col-span-full">This developer has no launches yet.</p>
        )}
        {launches.map((l) => <LaunchCard key={l.id} launch={l} />)}
      </div>
    </div>
  )
}
