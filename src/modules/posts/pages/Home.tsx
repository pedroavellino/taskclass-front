import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "@/services/api";
import type { Post } from "@/types";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Hero = styled.div`
  padding: 2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }

  p {
    margin: 0.5rem 0 0;
    opacity: 0.85;
    font-size: 0.95rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: #2563eb;
  color: white;
  transition: 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #0f172a;
  transition: 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;


const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const TableWrap = styled.div`
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(16,24,40,.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    text-align: left;
    font-weight: 700;
    font-size: .9rem;
    padding: 1rem;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    background: #f8fafc;
  }

  tbody td {
    padding: 1rem;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
  }

  tbody tr:last-child td { border-bottom: none; }

  tbody tr {
    cursor: pointer;
    transition: 0.15s;
  }

  tbody tr:hover {
    background: #f1f5ff;
  }
`;

const Empty = styled.div`
  padding: 2rem;
  color: ${({theme}) => theme.colors.muted};
`;

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
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

  function openView(p: Post) {
    navigate(`/post/${p.id}`);
  }

  return (
    <Page>

      <Hero>
  <div>
    <h1>Atividades Educacionais</h1>
    <p>Gerencie, visualize e organize suas atividades e presenças.</p>
  </div>

  <Actions>
    <PrimaryButton onClick={() => navigate("/create")}>
      + Nova atividade
    </PrimaryButton>

    <SecondaryButton onClick={() => navigate("/turmas")}>
      Turmas
    </SecondaryButton>
  </Actions>
</Hero>


      <Section>
        <SearchInput
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Descrição</th>
                <th>Disciplina</th>
                <th>Autor</th>
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
                <tr key={p.id}
                  onClick={() => openView(p)}>
                  <td style={{fontWeight:600}}>{p.title}</td>
                  <td>{p.content.slice(0, 40)}...</td>
                  <td>{p.disciplina ?? "—"}</td>
                  <td>{p.author ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Section>

    </Page>
  );
}
