import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// requireRole: undefined = just needs to be logged in
// requireRole: 'admin' = admin or superadmin
// requireRole: 'superadmin' = superadmin only
export default function ProtectedRoute({ children, requireRole }) {
  const { currentUser, isAdmin, isSuperAdmin } = useAuth()
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
  return children
}
