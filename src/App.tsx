// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { HeaderGeral } from './components/HeaderGeral'
import { Home } from './modules/posts/pages/Home'
import { PostRead } from './modules/posts/pages/PostRead'
import { PostCreate } from './modules/posts/pages/PostCreate'
import { PostEdit } from './modules/posts/pages/PostEdit'
import { Admin } from './modules/posts/pages/Admin'
import { Login } from './modules/auth/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import styled from 'styled-components'
import React from 'react'

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
`

function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  let header = 'geral'
  if(loc.pathname.includes('/create') || loc.pathname.includes('/edit') || loc.pathname.includes('/admin')){
    header = 'header'
  } else if (loc.pathname === '/login'){
    header = ''
  }
  if (header === 'geral') {
    return (
      <>
        <HeaderGeral />
        <Container>{children}</Container>
      </>
    )
  } else if(header === ''){
    return <Container>{children}</Container>
  }
  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  )
}

export default function App() {
  return (
    <Layout>
      {/* Login como página inicial */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostRead />} />

        {/* Rotas protegidas */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/create" element={<PostCreate />} />
          <Route path="/edit/:id" element={<PostEdit />} />
          <Route path="/admin" element={<Admin />} />
        {/* </Route> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
