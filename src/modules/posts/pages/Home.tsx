// src/modules/posts/pages/Home.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "@/services/api";
import type { Post } from "@/types";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 1rem 0;
  h1 { margin: 0; font-size: 1.75rem; }
`;

const NewButton = styled.button`
  padding: .6rem .9rem;
  border-radius: 10px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background-color: #020086;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;

const TableWrap = styled.div`
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(16,24,40,.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th {
    text-align: left;
    font-weight: 700;
    font-size: .95rem;
    color: ${({theme}) => theme.colors.muted};
    padding: .9rem 1rem;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    background: #fafbff;
  }
  tbody td {
    padding: .9rem 1rem;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr {
    cursor: pointer;
    outline: none;
  }
  tbody tr:hover {
    background: #f6f7ff;
  }
  tbody tr:focus-visible {
    box-shadow: inset 0 0 0 2px ${({theme}) => theme.colors.ring};
  }
`;

const Empty = styled.div`
  padding: 2rem;
  color: ${({theme}) => theme.colors.muted};
`;

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return "—"; }
}

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let on = true;
    setLoading(true); setError(null);
    api.getPosts().then((data) => {
      if (on) setPosts(data);
    }).catch((e:any) => setError(e.message || "Erro ao carregar"))
      .finally(() => setLoading(false));
    return () => { on = false; };
  }, []);

  function openEdit(p: Post) {
    navigate(`/edit/${p.id}`);
  }
  function newActivity() {
    navigate(`/create`);
  }

  return (
    <Page>
      <TitleRow>
        <h1>Lista de atividades</h1>
        <NewButton onClick={newActivity}>Nova atividade</NewButton>
      </TitleRow>

      <TableWrap role="region" aria-label="Lista de atividades">
        <Table>
          <thead>
            <tr>
              <th style={{width:'45%'}}>Título</th>
              <th style={{width:'20%'}}>Data de Entrega</th>
              <th style={{width:'20%'}}>Disciplina</th>
              <th style={{width:'15%'}}>Autor</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4}><Empty>Carregando…</Empty></td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={4}><Empty role="alert">{error}</Empty></td></tr>
            )}
            {!loading && !error && posts.length === 0 && (
              <tr><td colSpan={4}><Empty>Nenhuma atividade ainda.</Empty></td></tr>
            )}
            {!loading && !error && posts.map((p) => (
              <tr key={p.id} tabIndex={0}
                  onClick={() => openEdit(p)}
                  onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') openEdit(p) }}>
                <td style={{fontWeight:600}}>{p.title}</td>
                {/* usamos createdAt por enquanto como "Data de entrega";
                   quando seu back trouxer "dueDate", basta trocar para p.dueDate */}
                <td>{formatDate(p.createdAt)}</td>
                <td>{p.disciplina ?? "—"}</td>
                <td>{p.author ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  );
}
