import { useEffect, useState } from 'react'
import { getAllContactSubmissions } from '../data/firestoreApi'

export default function AdminSubmissions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setSubs(await getAllContactSubmissions())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="h-48 rounded-xl bg-surface animate-pulse" />

  if (subs.length === 0) {
    return <p className="text-mist py-16 text-center">No contact submissions yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead className="bg-surface text-mist text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Unit Type</th>
            <th className="px-4 py-3">Preferred Date</th>
            <th className="px-4 py-3">Regarding</th>
            <th className="px-4 py-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s.id} className="border-t border-white/5">
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3 text-mist">{s.phone}</td>
              <td className="px-4 py-3 text-mist">{s.unitType}</td>
              <td className="px-4 py-3 text-mist">{s.preferredDate || '—'}</td>
              <td className="px-4 py-3 text-mist">{s.launchName || 'General Inquiry'}</td>
              <td className="px-4 py-3 text-mist">{s.userEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
