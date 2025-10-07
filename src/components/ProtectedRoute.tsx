import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/auth/AuthContext'

export function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
