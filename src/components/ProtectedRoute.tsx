import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/AuthContext'

export function ProtectedRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return <Outlet />
}
