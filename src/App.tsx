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
import { useAuth } from './modules/auth/AuthContext'

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
`

function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  const { user } = useAuth();


  if (loc.pathname === '/login') {
    return <Container>{children}</Container>;
  }


  if (!user) {
    return (
      <>
        <HeaderGeral />
        <Container>{children}</Container>
      </>
    );
  }


  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostRead />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/create" element={<PostCreate />} />
          <Route path="/edit/:id" element={<PostEdit />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
