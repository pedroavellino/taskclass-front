import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/types/index'
import { storage } from '@/services/api'

type Ctx = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

type JwtPayload = {
  sub: string
  email: string
  role: string
  iat?: number
  exp?: number
}

const AuthContext = createContext<Ctx | null>(null)

function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')

  // Base64URL -> Base64
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')

  const json = atob(padded)
  return JSON.parse(json) as JwtPayload
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(storage.key)
    if (!token) return

    try {
      const payload = decodeJwtPayload(token)

      const userData: User = {
        id: payload.sub,
        name: payload.email,
        email: payload.email,
        role: payload.role,
      }

      localStorage.setItem('fiap.user', JSON.stringify(userData))
      setUser(userData)
    } catch (e) {
      storage.clear()
      localStorage.removeItem('fiap.user')
      setUser(null)
    }
  }, [])

  async function login(email: string, password: string) {
    const response = await fetch(
      'https://task-class-api-latest.onrender.com/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      },
    )

    if (!response.ok) {
      throw new Error('Seu e-mail e/ou senha estão errados.')
    }

    const data = await response.json()
    storage.setToken(data.access_token)

    const payload = decodeJwtPayload(data.access_token)

    const userData: User = {
      id: payload.sub,
      name: payload.email,
      email: payload.email,
      role: payload.role,
    }

    localStorage.setItem('fiap.user', JSON.stringify(userData))
    setUser(userData)
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