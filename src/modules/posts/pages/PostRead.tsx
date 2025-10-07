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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  gap: 1rem; 

  @media (max-width: 650px) { 
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const DisciplineText = styled.small`
  font-size: 1.1em; 
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 650px) {
    white-space: normal;
    font-size: 1em;
  }
`;

export function PostRead() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (id) api.getPost(id).then(setPost)
  }, [id])

  if (!post) return <p>Carregando...</p>

  return (
    <Article>
      <HeaderContainer>
        <h1>{post.title}</h1>
        <DisciplineText>{post.disciplina}</DisciplineText>
      </HeaderContainer>
      <small>Por {post.author}</small>
      <div aria-label="conteúdo do post">
        <p style={{whiteSpace:'pre-wrap'}}>{post.content}</p>
      </div>
    </Article>
  )
}
