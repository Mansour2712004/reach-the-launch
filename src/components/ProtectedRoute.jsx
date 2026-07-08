import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// requireRole: undefined = just needs to be logged in
// requireRole: 'admin' = admin or superadmin
// requireRole: 'superadmin' = superadmin only
// requirePermission: 'launches' | 'developers' | 'submissions' — superadmin
// always passes; a regular admin needs that specific permission switched on.
export default function ProtectedRoute({ children, requireRole, requirePermission }) {
  const { currentUser, isAdmin, isSuperAdmin, permissions } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (requireRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />
  }
  if (requireRole === 'superadmin' && !isSuperAdmin) {
    return <Navigate to="/" replace />
  }
  if (requirePermission && !isSuperAdmin && !permissions[requirePermission]) {
    return <Navigate to="/admin" replace />
  }
  return children
}
