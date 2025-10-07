export type { Post } from '@/services/api'
export type Credentials = { email: string; password: string }
export type User = { id: string; name: string; email: string; role?: 'teacher'|'student' }
export type TokenResponse = { token: string; user: User }
