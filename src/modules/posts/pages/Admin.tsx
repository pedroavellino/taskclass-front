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

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  padding: .6rem .9rem;
  border-radius: 10px;
  border: 1px solid ${({theme}) => theme.colors.border};
  font-size: .95rem;
  width: 100%;
  max-width: 400px;
  &:focus {
    outline: none;
    border-color: #020086;
    box-shadow: 0 0 0 2px rgba(2,0,134,0.2);
  }
`;

const NewButton = styled.button`
  padding: .6rem .9rem;
  border-radius: 10px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background-color: #020086;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #00005e;
  }
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
    vertical-align: middle;
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

  @media (max-width: 650px) { 
    thead th:nth-child(2), 
    thead th:nth-child(3),
    thead th:nth-child(4) {
      display: none;
    }

    tbody td:nth-child(2),
    tbody td:nth-child(3),
    tbody td:nth-child(4) {
      display: none;
    }

    thead th:nth-child(1),
    tbody td:nth-child(1) {
      width: 50% !important;
      text-align: left !important;
    }

    thead th:nth-child(5),
    tbody td:nth-child(5) {
      width: 50% !important;
      text-align: left !important;
      justify-content: flex-end;
    }
  }
`;

const Empty = styled.div`
  padding: 2rem;
  color: ${({theme}) => theme.colors.muted};
  text-align: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: .4rem;
  margin: 0 .2rem;
  font-size: 1.1rem;
  color: ${({theme}) => theme.colors.muted};
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: #020086;
    transform: scale(1.1);
  }

  &.delete-button:hover {
    color: #dc3545;
  }

  &:focus {
    outline: 2px solid ${({theme}) => theme.colors.ring};
    border-radius: 4px;
  }

  @media (max-width: 650px) {
    padding: 0px;
    margin: 0px;
    font-size: 0.9rem;
  }
`;

const ActionsCell = styled.td`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`;

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return "—"; }
}

export function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const fetchPosts = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPosts(term);
      setPosts(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar as atividades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    let on = true; 
    setLoading(true);
    setError(null);

    api.getPosts(debouncedSearchTerm)
      .then((data) => {
        if (on) setPosts(data);
      })
      .catch((e:any) => setError(e.message || "Erro ao carregar as atividades."))
      .finally(() => setLoading(false));

    return () => { on = false; };
  }, [debouncedSearchTerm]);

  function openEdit(p: Post) {
    navigate(`/edit/${p.id}`);
  }
  function openView(p: Post) {
    navigate(`/post/${p.id}`);
  }
  function newActivity() {
    navigate(`/create`);
  }

  async function handleDelete(id: string) {
    if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
      try {
        await api.deletePost(id);
        fetchPosts(debouncedSearchTerm);
      } catch (e: any) {
        alert("Erro ao excluir a atividade: " + (e.message || ""));
      }
    }
  }

  return (
    <Page>
      <TitleRow>
        <h1>Lista de atividades</h1>
        <NewButton onClick={newActivity}>Nova atividade</NewButton>
      </TitleRow>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <TableWrap role="region" aria-label="Lista de atividades">
        <Table>
          <thead>
            <tr>
              <th style={{width:'30%'}}>Título</th>
              <th style={{width:'35%'}}>Descrição</th>
              <th style={{width:'20%'}}>Disciplina</th>
              <th style={{width:'15%'}}>Autor</th>
              <th style={{width:'10%', textAlign: 'center'}}>Ações</th>
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
              <tr key={p.id}>
                <td style={{fontWeight:600}} onClick={() => openView(p)} tabIndex={0}>{p.title}</td>
                <td>{p.content.slice(0, 40)}...</td>
                <td>{p.disciplina ?? "—"}</td>
                <td>{p.author ?? "—"}</td>
                <ActionsCell>
                  <ActionButton 
                    onClick={() => openEdit(p)} 
                    aria-label={`Editar atividade ${p.title}`}
                    title="Editar"
                  >
                    ✏️
                  </ActionButton>
                  <ActionButton 
                    className="delete-button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} 
                    aria-label={`Excluir atividade ${p.title}`}
                    title="Excluir"
                  >
                    🗑️
                  </ActionButton>
                </ActionsCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  );
}
