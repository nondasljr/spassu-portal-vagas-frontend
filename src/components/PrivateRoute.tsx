import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}
