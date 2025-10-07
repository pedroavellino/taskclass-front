import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/types'
import { api, storage } from '@/services/api'

type Ctx = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
const AuthContext = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(storage.key)
    const userCache = localStorage.getItem('fiap.user')
    if (token && userCache) {
      try { setUser(JSON.parse(userCache)) } catch {}
    }
  }, [])

  async function login(email: string, password: string) {
  try {
    // quando você criar a rota no back, troque esta linha:
    await api.login(email, password)
  } catch {
    // MODO DEV TEMPORÁRIO — REMOVE ANTES DA ENTREGA
    if (import.meta.env.DEV) {
      const fake = {
        token: 'dev-token',
        user: { id: 'dev-1', name: 'Professor Demo', email, role: 'teacher' as const }
      }
      storage.setToken(fake.token)
      localStorage.setItem('fiap.user', JSON.stringify(fake.user))
      setUser(fake.user)
      return
    }
    throw new Error('Seu e-mail ou senha estão errados.')
  }
}
  function logout() {
    storage.clear()
    localStorage.removeItem('fiap.user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
