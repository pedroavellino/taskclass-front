import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "@/services/api";
import type { Post } from "@/types";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: grid;
  gap: 1.25rem;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 0.25rem;

  h1 {
    margin: 0;
    font-size: 1.55rem;
    font-weight: 900;
    letter-spacing: 0.2px;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.95rem;
    line-height: 1.35;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ButtonBase = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;

  transition: transform 0.02s ease, filter 0.15s ease, background 0.15s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    filter: brightness(1.06);
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackButton = styled(ButtonBase)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.text};
`;

const NewButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border-color: transparent;
`;

const SearchRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 520px;

  padding: 0.85rem 1rem;
  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  outline: none;
  font-weight: 700;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.85;
    font-weight: 650;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }
`;

const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    text-align: left;
    font-weight: 900;
    font-size: 0.9rem;
    letter-spacing: 0.2px;

    color: ${({ theme }) => theme.colors.muted};
    padding: 0.9rem 1rem;

    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.card2};
  }

  tbody td {
    padding: 0.95rem 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
    color: ${({ theme }) => theme.colors.text};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    cursor: pointer;
    outline: none;
  }

  tbody tr:hover td {
    background: rgba(255, 255, 255, 0.03);
  }

  tbody tr:focus-visible td {
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.ring};
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
      width: 60% !important;
      text-align: left !important;
    }

    thead th:nth-child(5),
    tbody td:nth-child(5) {
      width: 40% !important;
      text-align: right !important;
    }
  }
`;

const Empty = styled.div`
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  font-weight: 700;
`;

const ActionsCell = styled.td`
  width: 10%;
`;

const ActionsWrap = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};

  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger : theme.colors.muted};

  cursor: pointer;
  font-size: 1.05rem;

  transition: transform 0.02s ease, filter 0.15s ease, border-color 0.15s ease;

  &:hover {
    filter: brightness(1.08);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }

  @media (max-width: 650px) {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 0.95rem;
  }
`;

export function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const navigate = useNavigate();

  const colSpan = 5;

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
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let on = true;
    setLoading(true);
    setError(null);

    api
      .getPosts(debouncedSearchTerm)
      .then((data) => {
        if (on) setPosts(data);
      })
      .catch((e: any) => setError(e.message || "Erro ao carregar as atividades."))
      .finally(() => setLoading(false));

    return () => {
      on = false;
    };
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
    <Screen>
      <Page>
        <TopBar>
          <TitleBlock>
            <h1>Lista de atividades</h1>
            <p>Gerencie, revise e acesse rapidamente suas atividades.</p>
          </TitleBlock>

          <Actions>
            <BackButton type="button" onClick={() => navigate("/")}>
              <IoArrowBackOutline />
              Voltar
            </BackButton>

            <NewButton onClick={newActivity}>+ Nova atividade</NewButton>
          </Actions>
        </TopBar>

        <SearchRow>
          <SearchInput
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchRow>

        <TableWrap role="region" aria-label="Lista de atividades">
          <Table>
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Título</th>
                <th style={{ width: "35%" }}>Descrição</th>
                <th style={{ width: "20%" }}>Disciplina</th>
                <th style={{ width: "15%" }}>Autor</th>
                <th style={{ width: "10%", textAlign: "right" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={colSpan}>
                    <Empty>Carregando…</Empty>
                  </td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td colSpan={colSpan}>
                    <Empty role="alert">{error}</Empty>
                  </td>
                </tr>
              )}

              {!loading && !error && posts.length === 0 && (
                <tr>
                  <td colSpan={colSpan}>
                    <Empty>Nenhuma atividade ainda.</Empty>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                posts.map((p) => (
                  <tr
                    key={p.id}
                    tabIndex={0}
                    onClick={() => openView(p)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openView(p);
                    }}
                    aria-label={`Abrir atividade ${p.title}`}
                    title="Abrir atividade"
                  >
                    <td style={{ fontWeight: 900 }}>{p.title}</td>
                    <td>{p.content ? `${p.content.slice(0, 45)}…` : "—"}</td>
                    <td>{p.disciplina ?? "—"}</td>
                    <td>{p.author ?? "—"}</td>

                    <ActionsCell onClick={(e) => e.stopPropagation()}>
                      <ActionsWrap>
                        <ActionButton
                          type="button"
                          onClick={() => openEdit(p)}
                          aria-label={`Editar atividade ${p.title}`}
                          title="Editar"
                        >
                          ✏️
                        </ActionButton>

                        <ActionButton
                          type="button"
                          $danger
                          onClick={() => handleDelete(p.id)}
                          aria-label={`Excluir atividade ${p.title}`}
                          title="Excluir"
                        >
                          🗑️
                        </ActionButton>
                      </ActionsWrap>
                    </ActionsCell>
                  </tr>
                ))}
            </tbody>
          </Table>
        </TableWrap>
      </Page>
    </Screen>
  );
}