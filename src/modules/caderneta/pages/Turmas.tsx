import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";

type TurmaUI = {
  id: string;
  nome: string;
  ano: string;
  totalAlunos: number;
};

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  letter-spacing: 0.2px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.92rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  align-items: center;
`;

const ButtonBase = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;

  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.02s ease, filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.text};
`;

const PrimaryButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border-color: transparent;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;
  outline: none;
  transition: 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.85;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const Card = styled.div`
  position: relative;
  padding: 1rem 1.05rem;
  border-radius: 18px;

  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);

  cursor: pointer;
  transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease,
    border-color 0.15s ease;

  /* glow sutil */
  &::before {
    content: "";
    position: absolute;
    top: -80px;
    right: -70px;
    width: 260px;
    height: 260px;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.primary} 0%,
      transparent 70%
    );
    opacity: 0.08;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    filter: brightness(1.04);
    border-color: rgba(77, 163, 255, 0.55);
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.55);
  }

  h3 {
    margin: 0 0 0.6rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 900;
    letter-spacing: 0.2px;
    position: relative;
    z-index: 1;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.9rem;
    line-height: 1.4;
    position: relative;
    z-index: 1;
  }

  p + p {
    margin-top: 0.15rem;
  }
`;

const InfoLine = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

export function Turmas() {
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<TurmaUI[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const turmasBack = await api.getTurmas();

        // Para cada turma, buscamos total de alunos
        const turmasComTotal: TurmaUI[] = await Promise.all(
          turmasBack.map(async (t: any) => {
            const turmaId = String(t.id ?? t._id ?? "");
            const alunos = await api.getAlunosPorTurma(turmaId);

            return {
              id: turmaId,
              nome: String(t.nome ?? ""),
              ano: String(t.ano ?? ""),
              // Turno não existe no banco atual -> placeholder
              turno: "—",
              totalAlunos: Array.isArray(alunos) ? alunos.length : 0,
            };
          })
        );

        if (!alive) return;
        setTurmas(turmasComTotal);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Erro ao carregar turmas");
        setTurmas([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return turmas.filter((t) => t.nome.toLowerCase().includes(q));
  }, [turmas, search]);

  return (
    <Screen>
      <Wrapper>
        <HeaderRow>
          <TitleBlock>
            <Title>Minhas Turmas</Title>
            <Subtitle>Pesquise e acesse a presença por turma.</Subtitle>
          </TitleBlock>

          <Actions>
            <SecondaryButton onClick={() => navigate("/")}>← Voltar</SecondaryButton>
            <PrimaryButton type="button">+ Nova Turma</PrimaryButton>
          </Actions>
        </HeaderRow>

        <SearchInput
          placeholder="Buscar turma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <InfoLine>Carregando turmas...</InfoLine>}
        {!loading && error && <InfoLine>{error}</InfoLine>}
        {!loading && !error && filtered.length === 0 && (
          <InfoLine>Nenhuma turma encontrada.</InfoLine>
        )}

        <Grid>
          {filtered.map((turma) => (
            <Card
              key={turma.id}
              onClick={() => navigate(`/turmas/${turma.id}/presenca`)}
            >
              <h3>{turma.nome}</h3>
              <p>Ano: {turma.ano}</p>
              <p>{turma.totalAlunos} alunos</p>
            </Card>
          ))}
        </Grid>
      </Wrapper>
    </Screen>
  );
}