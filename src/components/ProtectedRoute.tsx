import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/AuthContext'
import type { UserRole } from '@/types'

type Props = {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (roles && roles.length > 0) {
    const allowed = roles.includes(user.role)
    if (!allowed) return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
