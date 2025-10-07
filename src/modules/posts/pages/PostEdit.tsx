import { FormEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { api } from '@/services/api'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post } from '@/types'

const Card = styled.form`
  max-width: 680px;
  margin: 1rem auto;
  display: grid;
  gap: .75rem;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  padding: 1.2rem;
  border-radius: ${({theme}) => theme.radius};
`

const Field = styled.div`
  display: grid; gap: .25rem;
  input, textarea {
    padding: .7rem .9rem;
    border-radius: 10px;
    border: 1px solid ${({theme}) => theme.colors.border};
    background: #f2f4fa;
    color: ${({theme}) => theme.colors.text};
  }
  textarea { min-height: 220px; }
`
const Button = styled.button`
  padding: .8rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.primary};
  color: #0b0f1a;
  font-weight: 600;
  cursor: pointer
`

export function PostEdit() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) api.getPost(id).then(setPost).catch(e=>setError(String(e)))
  }, [id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id || !post) return
    setLoading(true); setError(null)
    try {
      await api.updatePost(id, { title: post.title, author: post.author, content: post.content,  disciplina: post.disciplina })
      navigate(`/admin`)
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar')
    } finally {
      setLoading(false)
    }
  }

  if (!post) return <p>Carregando...</p>

  return (
    <Card onSubmit={onSubmit}>
      <h2>Editar Post</h2>
      <Field>
        <label htmlFor="title">Título</label>
        <input id="title" value={post.title} onChange={e=>setPost({...post, title: e.target.value})} required />
      </Field>
      <Field>
        <label htmlFor="disciplina">Disciplina</label>
        <input id="disciplina" value={post.disciplina} onChange={e=>setPost({...post, disciplina: e.target.value})} required />
      </Field>
      <Field>
        <label htmlFor="author">Autor</label>
        <input id="author" value={post.author} onChange={e=>setPost({...post, author: e.target.value})} required />
      </Field>
      <Field>
        <label htmlFor="content">Conteúdo</label>
        <textarea id="content" value={post.content} onChange={e=>setPost({...post, content: e.target.value})} required />
      </Field>
      {error && <p role="alert" style={{color:'#ff8080'}}>{error}</p>}
      <Button disabled={loading}>{loading ? 'Salvando...' : 'Salvar alterações'}</Button>
    </Card>
  )
}
