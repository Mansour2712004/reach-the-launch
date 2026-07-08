import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteLaunch, getAllLaunches } from '../data/firestoreApi'
import { regionLabel } from '../data/constants'

export default function AdminLaunches() {
  const [launches, setLaunches] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      setLaunches(await getAllLaunches())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    await deleteLaunch(id)
    load()
  }

  if (loading) return <div className="h-48 rounded-xl bg-surface animate-pulse" />

  if (launches.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-mist mb-4">No launches yet.</p>
        <Link to="/admin/launches/new" className="text-gold hover:underline">Add your first launch</Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead className="bg-surface text-mist text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Developer</th>
            <th className="px-4 py-3">Region</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {launches.map((l) => (
            <tr key={l.id} className="border-t border-white/5">
              <td className="px-4 py-3 font-medium">{l.name}</td>
              <td className="px-4 py-3 text-mist">{l.developerName}</td>
              <td className="px-4 py-3 text-mist">{regionLabel(l.region)}</td>
              <td className="px-4 py-3 text-mist">{l.priceStart || '—'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3 justify-end">
                  <Link to={`/admin/launches/${l.id}/edit`} className="text-teal hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(l.id, l.name)} className="text-red-400 hover:underline">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
