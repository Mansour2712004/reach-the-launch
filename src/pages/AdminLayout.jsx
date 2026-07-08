import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { isSuperAdmin, profile, permissions } = useAuth()

  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-gold text-ink' : 'text-mist hover:text-white hover:bg-surface2'
    }`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold">Admin Panel</h1>
        <p className="text-mist text-sm mt-1">
          Signed in as {profile?.name} · {isSuperAdmin ? 'Super Admin' : 'Admin'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
        <NavLink to="/admin" end className={tabClass}>Overview</NavLink>
        {permissions.launches && (
          <>
            <NavLink to="/admin/launches" className={tabClass}>Launches</NavLink>
            <NavLink to="/admin/launches/new" className={tabClass}>Add Launch</NavLink>
          </>
        )}
        {permissions.developers && <NavLink to="/admin/developers" className={tabClass}>Developers</NavLink>}
        {permissions.offers && <NavLink to="/admin/special-offer" className={tabClass}>Special Offer</NavLink>}
        {permissions.submissions && <NavLink to="/admin/submissions" className={tabClass}>Contact Submissions</NavLink>}
        {isSuperAdmin && <NavLink to="/admin/users" className={tabClass}>Manage Admins</NavLink>}
      </div>

      <Outlet />
    </div>
  )
}
