import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers, setUserRole } from '../data/firestoreApi'

export default function AdminUsers() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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
    const nextRole = u.role === 'admin' ? 'user' : 'admin'
    await setUserRole(u.id, nextRole)
    load()
  }

  if (loading) return <div className="h-48 rounded-xl bg-surface animate-pulse" />

  return (
    <div className="space-y-4">
      <p className="text-mist text-sm">
        Promote a user to Admin to let them add/edit/delete launches and view contact submissions.
        Only you (Super Admin) can do this.
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-surface text-mist text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-mist">{u.email}</td>
                <td className="px-4 py-3 text-mist capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  {u.role !== 'superadmin' && u.id !== currentUser.uid && (
                    <button onClick={() => handleToggleAdmin(u)} className="text-teal hover:underline">
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
