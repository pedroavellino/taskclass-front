import styled from 'styled-components'
import { Link } from 'react-router-dom'
import type { Post } from '@/types'

const Card = styled.article`
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  border-radius: ${({theme}) => theme.radius};
  padding: 1rem;
  display: grid;
  gap: .5rem;
`

export function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
      <small>por {post.author}</small>
      <p>{post.summary ?? post.content?.slice(0, 140) + '...'}</p>
      <Link to={`/post/${post.id}`} aria-label={`Ler post ${post.title}`}>Ler mais →</Link>
    </Card>
  )
}
