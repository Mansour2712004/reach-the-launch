import { useEffect, useState } from 'react'
import { deleteContactSubmission, getAllContactSubmissions, updateContactSubmission } from '../data/firestoreApi'

export default function AdminSubmissions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      setSubs(await getAllContactSubmissions())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleToggleDone(sub) {
    setBusyId(sub.id)
    try {
      await updateContactSubmission(sub.id, { done: !sub.done })
      setSubs((prev) => prev.map((s) => (s.id === sub.id ? { ...s, done: !s.done } : s)))
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(sub) {
    if (!window.confirm(`Delete the submission from "${sub.name}"? This cannot be undone.`)) return
    setBusyId(sub.id)
    try {
      await deleteContactSubmission(sub.id)
      setSubs((prev) => prev.filter((s) => s.id !== sub.id))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <div className="h-48 rounded-xl bg-surface animate-pulse" />

  if (subs.length === 0) {
    return <p className="text-mist py-16 text-center">No contact submissions yet.</p>
  }

  // Newest is listed first, but numbered so the very first submission ever
  // received is always #1 (oldest = 1, climbing upward over time).
  const total = subs.length

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead className="bg-surface text-mist text-left">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Unit Type</th>
            <th className="px-4 py-3">Preferred Date</th>
            <th className="px-4 py-3">Regarding</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s, i) => {
            const number = total - i
            const rowStyle = s.done ? { textDecoration: 'line-through', opacity: 0.5 } : undefined
            return (
              <tr key={s.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-mist" style={rowStyle}>{number}</td>
                <td className="px-4 py-3 font-medium" style={rowStyle}>{s.name}</td>
                <td className="px-4 py-3 text-mist" style={rowStyle}>{s.phone}</td>
                <td className="px-4 py-3 text-mist" style={rowStyle}>{s.unitType}</td>
                <td className="px-4 py-3 text-mist" style={rowStyle}>{s.preferredDate || '—'}</td>
                <td className="px-4 py-3 text-mist" style={rowStyle}>{s.launchName || 'General Inquiry'}</td>
                <td className="px-4 py-3 text-mist" style={rowStyle}>{s.userEmail}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 justify-end whitespace-nowrap">
                    <button
                      onClick={() => handleToggleDone(s)}
                      disabled={busyId === s.id}
                      className="text-teal hover:underline disabled:opacity-60"
                    >
                      {s.done ? 'Undo' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      disabled={busyId === s.id}
                      className="text-red-400 hover:underline disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
