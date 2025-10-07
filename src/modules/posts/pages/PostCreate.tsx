// src/modules/posts/pages/PostCreate.tsx
import { FormEvent, useState } from 'react'
import styled from 'styled-components'
import { api } from '@/services/api'
import { useNavigate } from 'react-router-dom'

const Card = styled.form`
  max-width: 860px;
  margin: 1.5rem auto;
  display: grid;
  gap: .9rem;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  padding: 1.5rem;
  border-radius: ${({theme}) => theme.radius};
  box-shadow: 0 10px 30px rgba(16,24,40,.06);
`
const Field = styled.div`
  display: grid; gap: .35rem;
  label { font-size: .9rem; color: ${({theme}) => theme.colors.muted}; font-weight: 600; }
  input, textarea {
    padding: .85rem 1rem;
    border-radius: 10px;
    border: 1px solid ${({theme}) => theme.colors.border};
    background: #f3f6ff;
    color: ${({theme}) => theme.colors.text};
  }
  textarea { min-height: 220px; }
`
const Row = styled.div`
  display: flex; gap: .75rem; margin-top: .25rem;
  flex-wrap: wrap;
`
const BtnPrimary = styled.button`
  padding: .9rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.primary};
  color: #fff; font-weight: 700; cursor: pointer;
`
const BtnGhost = styled.button`
  padding: .9rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: #ffd0d5; color: #3c0d15; font-weight: 700; cursor: pointer;
`

export function PostCreate() {
  // ESTADO DOS CAMPOS
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [disciplina, setDisciplina] = useState('')  // <-- novo
  const [turma, setTurma] = useState('')            // <-- novo (opcional)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // SUBMISSÃO (envia todos os campos que o back espera)
  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.createPost({ title, author, disciplina, turma, content })
      navigate('/posts') // volta para a lista
    } catch (err: any) {
      setError(err.message || 'Falha ao criar atividade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card onSubmit={onSubmit}>
      <h2 style={{marginTop:0}}>Nova atividade</h2>

      {/* --- AQUI É O "JSX do formulário" --- */}
      <Field>
        <label htmlFor="title">Título</label>
        <input id="title" value={title} onChange={e=>setTitle(e.target.value)} required />
      </Field>

      <Field>
        <label htmlFor="author">Autor</label>
        <input id="author" value={author} onChange={e=>setAuthor(e.target.value)} required />
      </Field>

      <Field>
        <label htmlFor="disciplina">Disciplina</label>
        <input id="disciplina" value={disciplina} onChange={e=>setDisciplina(e.target.value)} required />
      </Field>

      <Field>
        <label htmlFor="turma">Turma</label>
        <input id="turma" value={turma} onChange={e=>setTurma(e.target.value)} />
      </Field>

      <Field>
        <label htmlFor="content">Conteúdo</label>
        <textarea id="content" value={content} onChange={e=>setContent(e.target.value)} required />
      </Field>

      {error && <p role="alert" style={{color:'#b42318'}}>{error}</p>}

      <Row>
        <BtnPrimary disabled={loading}>{loading ? 'Publicando…' : 'Publicar'}</BtnPrimary>
        <BtnGhost type="button" onClick={()=>navigate(-1)}>Voltar</BtnGhost>
      </Row>
    </Card>
  )
}
