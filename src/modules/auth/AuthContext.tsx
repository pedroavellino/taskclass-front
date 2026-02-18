import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/types/index'
import { storage } from '@/services/api'

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
      try {
        const parsedUser = JSON.parse(userCache)
        setUser(parsedUser)
      } catch (e) {
        storage.clear()
        localStorage.removeItem('fiap.user')
      }
    }
  }, [])

  async function login(email: string, password: string) {
    const response = await fetch(
      "https://task-class-api-latest.onrender.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      }
    )
    console.log("Status:", response.status)

    if (!response.ok) {
      throw new Error("Seu e-mail e/ou senha estão errados.")
    }

    const data = await response.json()

    storage.setToken(data.access_token)

    const userData: User = {
      id: email,
      name: email,
      email,
      role: "teacher", 
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
