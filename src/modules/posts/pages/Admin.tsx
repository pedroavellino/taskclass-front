import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { api } from '@/services/api'
import type { Post } from '@/types'
import { Link } from 'react-router-dom'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({theme}) => theme.colors.card};
  border-radius: ${({theme}) => theme.radius};
  overflow: hidden;
  border: 1px solid ${({theme}) => theme.colors.border};
  th, td {
    padding: .75rem .9rem;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    text-align: left;
  }
  tr:last-child td { border-bottom: none; }
`

const Actions = styled.div`
  display: inline-flex;
  gap: .5rem;
  a, button {
    padding: .4rem .7rem;
    border-radius: 8px;
    border: 1px solid ${({theme}) => theme.colors.border};
    background: #0f1630;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
  }
`

export function Admin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true); setError(null)
    try {
      const data = await api.getPosts()
      setPosts(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  async function onDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return
    await api.deletePost(id)
    refresh()
  }

  return (
    <div>
      <h2>Administração</h2>
      {error && <p role="alert" style={{color:'#ff8080'}}>{error}</p>}
      {loading && <p>Carregando...</p>}
      <Table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>
                <Actions>
                  <Link to={`/edit/${p.id}`}>Editar</Link>
                  <button onClick={() => onDelete(p.id)}>Excluir</button>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
