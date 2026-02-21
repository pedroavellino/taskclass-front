import { Link } from 'react-router-dom'
import { useAuth } from '@/modules/auth/AuthContext'

export default function Unauthorized() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: 24 }}>
      <h2>Acesso negado</h2>
      <p>Seu perfil não tem permissão para acessar esta página.</p>

      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <Link to="/">Voltar</Link>
        {user ? <button onClick={logout}>Sair</button> : <Link to="/login">Login</Link>}
      </div>
    </div>
  )
}