import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";
import { useAuth } from "@/modules/auth/AuthContext";

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

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
`;

const Modal = styled.div`
  width: min(520px, 100%);
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
`;

const Field = styled.div`
  display: grid;
  gap: 0.35rem;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 700;
  }

  input {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    outline: none;
  }
`;

export function Turmas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCoordenacao = user?.role === "coordenacao";

  const [turmas, setTurmas] = useState<TurmaUI[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal nova turma
  const [openNew, setOpenNew] = useState(false);
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [saving, setSaving] = useState(false);

  async function loadTurmas() {
    setLoading(true);
    setError(null);

    try {
      const turmasBack = await api.getTurmas({ limit: 50, page: 1 });
      const alunosBack = await api.getAlunos();

      const countByTurma = new Map<string, number>();

      if (Array.isArray(alunosBack)) {
        for (const a of alunosBack) {
          const turmaIdRaw = (a as any).turmaId;
          const turmaId =
            typeof turmaIdRaw === "string"
              ? turmaIdRaw
              : turmaIdRaw?._id
                ? String(turmaIdRaw._id)
                : null;

          if (!turmaId) continue;
          countByTurma.set(turmaId, (countByTurma.get(turmaId) ?? 0) + 1);
        }
      }

      const ui: TurmaUI[] = Array.isArray(turmasBack)
        ? turmasBack.map((t: any) => {
            const turmaId = String(t.id ?? t._id ?? "");
            return {
              id: turmaId,
              nome: String(t.nome ?? ""),
              ano: String(t.ano ?? ""),
              totalAlunos: countByTurma.get(turmaId) ?? 0,
            };
          })
        : [];

      setTurmas(ui);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar turmas");
      setTurmas([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      await loadTurmas();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return turmas.filter((t) => t.nome.toLowerCase().includes(q));
  }, [turmas, search]);

  async function handleCreateTurma() {
    const anoNum = Number(ano);
    if (!nome.trim()) {
      setError("Informe o nome da turma.");
      return;
    }
    if (!Number.isFinite(anoNum) || anoNum < 2000 || anoNum > 2100) {
      setError("Informe um ano válido.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.createTurma({ nome: nome.trim(), ano: anoNum });
      setOpenNew(false);
      setNome("");
      setAno(String(new Date().getFullYear()));
      await loadTurmas();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao criar turma");
    } finally {
      setSaving(false);
    }
  }

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

            {isCoordenacao && (
              <PrimaryButton type="button" onClick={() => setOpenNew(true)}>
                + Nova Turma
              </PrimaryButton>
            )}
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

        {openNew && (
          <Backdrop onClick={() => !saving && setOpenNew(false)}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <Title style={{ fontSize: "1.05rem" }}>Nova Turma</Title>

              <Field>
                <label>Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: 3º Ano A"
                  disabled={saving}
                />
              </Field>

              <Field>
                <label>Ano</label>
                <input
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  placeholder="2026"
                  disabled={saving}
                />
              </Field>

              <Actions style={{ justifyContent: "flex-end" }}>
                <SecondaryButton
                  type="button"
                  onClick={() => setOpenNew(false)}
                  disabled={saving}
                >
                  Cancelar
                </SecondaryButton>

                <PrimaryButton
                  type="button"
                  onClick={handleCreateTurma}
                  disabled={saving}
                >
                  {saving ? "Salvando…" : "Criar"}
                </PrimaryButton>
              </Actions>
            </Modal>
          </Backdrop>
        )}
      </Wrapper>
    </Screen>
  );
}