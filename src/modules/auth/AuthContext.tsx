import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/types/index'
import { storage } from '@/services/api'
import { MOCK_USERS_DATA } from '@/services/mockUsers'

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
        const parsedUser = JSON.parse(userCache);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
        storage.clear();
        localStorage.removeItem('fiap.user');
      }
    }
  }, []);

  async function login(email: string, password: string) {
    const foundUser = MOCK_USERS_DATA.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const fakeToken = `mock-token-${foundUser.id}`;


      storage.setToken(fakeToken);
      
      const userWithoutPassword: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
      };

      localStorage.setItem('fiap.user', JSON.stringify(userWithoutPassword));

      setUser(userWithoutPassword);
      return;

    } else {
      throw new Error('Seu e-mail e/ou senha estão errados.');
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
