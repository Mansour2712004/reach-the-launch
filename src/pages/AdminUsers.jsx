import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers, setUserPermissions, setUserRole } from '../data/firestoreApi'

const PERMISSION_OPTIONS = [
  { key: 'launches', label: 'Launches' },
  { key: 'developers', label: 'Developers' },
  { key: 'offers', label: 'Special Offer' },
  { key: 'submissions', label: 'Contact Submissions' },
]

export default function AdminUsers() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      setUsers(await getAllUsers())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleToggleAdmin(u) {
    setSavingId(u.id)
    try {
      const nextRole = u.role === 'admin' ? 'user' : 'admin'
      await setUserRole(u.id, nextRole)
      await load()
    } finally {
      setSavingId(null)
    }
  }

  async function handleTogglePermission(u, key) {
    setSavingId(u.id)
    try {
      const current = u.permissions || { launches: false, developers: false, submissions: false, offers: false }
      const next = { ...current, [key]: !current[key] }
      await setUserPermissions(u.id, next)
      await load()
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <div className="h-48 rounded-xl bg-surface animate-pulse" />

  return (
    <div className="space-y-4">
      <p className="text-mist text-sm">
        Promote a user to Admin, then switch on exactly what they're allowed to touch. Every
        permission starts off until you turn it on.
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-surface text-mist text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5 align-top">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-mist">{u.email}</td>
                <td className="px-4 py-3 text-mist capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  {u.role === 'admin' ? (
                    <div className="flex flex-wrap gap-3">
                      {PERMISSION_OPTIONS.map((p) => (
                        <label key={p.key} className="flex items-center gap-1.5 text-xs text-mist cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(u.permissions?.[p.key])}
                            disabled={savingId === u.id}
                            onChange={() => handleTogglePermission(u, p.key)}
                            className="accent-gold"
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  ) : u.role === 'superadmin' ? (
                    <span className="text-xs text-gold">All permissions (Super Admin)</span>
                  ) : (
                    <span className="text-xs text-mist/50">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.role !== 'superadmin' && u.id !== currentUser.uid && (
                    <button onClick={() => handleToggleAdmin(u)} disabled={savingId === u.id} className="text-teal text-sm hover:underline disabled:opacity-60">
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
