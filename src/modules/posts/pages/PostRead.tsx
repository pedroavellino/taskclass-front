import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/services/api'
import type { Post } from '@/types'
import styled from 'styled-components'

const Article = styled.article`
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  border-radius: ${({theme}) => theme.radius};
  padding: 1rem;
  display: grid;
  gap: .75rem;
`

export function PostRead() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (id) api.getPost(id).then(setPost)
  }, [id])

  if (!post) return <p>Carregando...</p>

  return (
    <Article>
      <h1>{post.title}</h1>
      <small>por {post.author}</small>
      <div aria-label="conteúdo do post">
        <p style={{whiteSpace:'pre-wrap'}}>{post.content}</p>
      </div>
    </Article>
  )
}
