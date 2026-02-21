import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "@/services/api";

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
  gap: 1.25rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  font-weight: 800;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }
`;

const List = styled.div`
  display: grid;
  gap: 0.9rem;
`;

const Row = styled.div`
  position: relative;
  padding: 1rem 1.05rem;
  border-radius: 18px;

  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);

  transition: transform 0.12s ease, filter 0.15s ease, box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.03);
    box-shadow: 0 26px 68px rgba(0, 0, 0, 0.55);
  }
`;

const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StudentName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  letter-spacing: 0.1px;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ChipButton = styled.button<{
  $active?: boolean;
  $tone?: "primary" | "danger" | "warning";
}>`
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.85rem;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.text};

  transition: transform 0.02s ease, filter 0.15s ease, border-color 0.15s ease,
    background 0.15s ease, color 0.15s ease;

  ${({ $active, $tone, theme }) =>
    $active &&
    `
      border-color: transparent;
      background: ${
        $tone === "danger"
          ? theme.colors.danger
          : $tone === "warning"
          ? "#f59e0b"
          : theme.colors.primary
      };
      color: ${theme.colors.bg};
  `}

  &:hover {
    filter: brightness(1.06);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ObservacaoContainer = styled.div`
  margin-top: 0.9rem;
  display: grid;
  gap: 0.75rem;

  padding: 0.95rem 1rem;
  border-radius: 14px;

  background: ${({ theme }) => theme.colors.card2};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const ObservacaoInput = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  resize: vertical;
  min-height: 70px;
  font-family: inherit;
  font-size: 0.92rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.85;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }
`;

const SaveObsButton = styled(PrimaryButton)`
  padding: 0.6rem 1rem;
  border-radius: 12px;
  justify-self: end;
`;

const FooterBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
`;

const SaveButton = styled(PrimaryButton)`
  padding: 0.85rem 1.25rem;
`;

const EmptyHint = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
`;

type Aluno = {
  id?: string | number;
  _id?: string;
  nome: string;
  turmaId?: string | number | { id?: string | number; _id?: string | number };
};

type PresencaOrig = { id: string; status: string };

const STATUS = {
  PRESENTE: "Presente",
  FALTOU: "Faltou",
  JUSTIFICADA: "Justificada",
} as const;

function toISODateOnly(value: string) {
  return String(value).slice(0, 10); 
}

function normalizeId(v: any) {
  return String(v ?? "");
}

export function PresencaTurma() {
  const { turmaId } = useParams();
  const navigate = useNavigate();

  const turmaIdStr = useMemo(() => (turmaId ? String(turmaId) : ""), [turmaId]);

  const [turmaNome, setTurmaNome] = useState<string>("");

  const [presencasOriginais, setPresencasOriginais] = useState<
    Record<string, PresencaOrig>
  >({});
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [presencas, setPresencas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const [mostrarObs, setMostrarObs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;

    async function carregarTurma() {
      if (!turmaIdStr) return;
      try {
        const t: any = await api.getTurma(turmaIdStr);
        if (!alive) return;
        setTurmaNome(String(t?.nome ?? ""));
      } catch {
        if (!alive) return;
        setTurmaNome("");
      }
    }

    carregarTurma();
    return () => {
      alive = false;
    };
  }, [turmaIdStr]);

  useEffect(() => {
    let alive = true;

    async function carregarAlunos() {
      if (!turmaIdStr) return;
      try {
        const response = await api.getAlunosPorTurma(turmaIdStr);
        if (!alive) return;
        setAlunos(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Erro ao carregar alunos", err);
        if (!alive) return;
        setAlunos([]);
      }
    }

    carregarAlunos();
    return () => {
      alive = false;
    };
  }, [turmaIdStr]);

  async function recarregarPresencas() {
    if (!turmaIdStr) return;

    setObservacoes({});
    setMostrarObs({});

    try {
      const lista = await api.getPresencasPorTurmaEData(turmaIdStr, dataSelecionada);

      const mapaUI: Record<string, string> = {};
      const mapaOrig: Record<string, PresencaOrig> = {};
      const mapaObs: Record<string, string> = {};

      (Array.isArray(lista) ? lista : []).forEach((p: any) => {
        const alunoId = normalizeId(p.alunoId);
        const presencaId = normalizeId(p.id ?? p._id);
        const dataOnly = toISODateOnly(p.data);

        if (!alunoId || !presencaId) return;
        if (dataOnly !== dataSelecionada) return;

        const status = String(p.status ?? "");
        mapaUI[alunoId] = status;
        mapaOrig[alunoId] = { id: presencaId, status };

        if (p.observacao) mapaObs[alunoId] = String(p.observacao);
      });

      setPresencas(mapaUI);
      setPresencasOriginais(mapaOrig);
      setObservacoes(mapaObs);
    } catch {
      setPresencas({});
      setPresencasOriginais({});
      setObservacoes({});
    }
  }

  useEffect(() => {
    recarregarPresencas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaIdStr, dataSelecionada]);

  function marcarPresenca(alunoId: string, status: string) {
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: status,
    }));
  }

  function toggleObs(alunoId: string) {
    setMostrarObs((prev) => ({
      ...prev,
      [alunoId]: !prev[alunoId],
    }));
  }

  async function salvarObservacaoUnica(alunoId: string) {
    const obsAtual = observacoes[alunoId] || "";
    const original = presencasOriginais[alunoId];

    if (!original) {
      alert(
        "A presença deste aluno ainda não foi salva. Primeiro marque e clique em 'Salvar Presença'!"
      );
      return;
    }

    try {
      await api.atualizarPresenca(original.id, { observacao: obsAtual });
      alert("Observação salva com sucesso!");
      await recarregarPresencas();
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      alert("Erro ao salvar a observação. Verifique o console.");
    }
  }

  async function salvarPresenca() {
    if (!turmaIdStr) return;
    setLoading(true);

    try {
      for (const [alunoId, status] of Object.entries(presencas)) {
        const original = presencasOriginais[alunoId];
        const obsAtual = observacoes[alunoId] || "";

        if (original && original.status === status) continue;

        if (original) {
          await api.atualizarPresenca(original.id, {
            status,
            observacao: obsAtual,
          });
        } else {
          await api.salvarPresenca({
            alunoId,
            turmaId: turmaIdStr,
            data: dataSelecionada,
            status,
            observacao: obsAtual,
          });
        }
      }

      alert("Presença salva/atualizada com sucesso!");
      await recarregarPresencas();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao processar as presenças. Verifique o console.");
    } finally {
      setLoading(false);
    }
  }

  const subtituloTurma =
    turmaNome?.trim()
      ? `Turma ${turmaNome} • Selecione a data e marque a presença.`
      : `Selecione a data e marque a presença.`;

  return (
    <Screen>
      <Wrapper>
        <TopBar>
          <TitleBlock>
            <Title>Caderneta</Title>
            <Subtitle>{subtituloTurma}</Subtitle>
          </TitleBlock>

          <Actions>
            <SecondaryButton onClick={() => navigate("/turmas")}>
              ← Voltar
            </SecondaryButton>

            <DateInput
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </Actions>
        </TopBar>

        {alunos.length === 0 ? (
          <EmptyHint>Nenhum aluno encontrado para esta turma.</EmptyHint>
        ) : (
          <List>
            {alunos.map((aluno) => {
              const id = String(aluno._id ?? aluno.id ?? "");
              if (!id) return null;

              return (
                <Row key={id}>
                  <RowTop>
                    <StudentName>{aluno.nome}</StudentName>

                    <StatusButtons>
                      <ChipButton
                        $tone="primary"
                        $active={presencas[id] === STATUS.PRESENTE}
                        onClick={() => marcarPresenca(id, STATUS.PRESENTE)}
                      >
                        Presente
                      </ChipButton>

                      <ChipButton
                        $tone="danger"
                        $active={presencas[id] === STATUS.FALTOU}
                        onClick={() => marcarPresenca(id, STATUS.FALTOU)}
                      >
                        Faltou
                      </ChipButton>

                      <ChipButton
                        $tone="warning"
                        $active={presencas[id] === STATUS.JUSTIFICADA}
                        onClick={() => marcarPresenca(id, STATUS.JUSTIFICADA)}
                      >
                        Justificada
                      </ChipButton>

                      <ChipButton
                        $tone="primary"
                        $active={mostrarObs[id] || !!observacoes[id]}
                        onClick={() => toggleObs(id)}
                      >
                        Observação
                      </ChipButton>
                    </StatusButtons>
                  </RowTop>

                  {(mostrarObs[id] || observacoes[id]) && (
                    <ObservacaoContainer>
                      <ObservacaoInput
                        placeholder="Adicione uma observação (comportamento, nota, aviso)..."
                        value={observacoes[id] || ""}
                        onChange={(e) =>
                          setObservacoes((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                      />

                      <SaveObsButton
                        type="button"
                        onClick={() => salvarObservacaoUnica(id)}
                      >
                        Salvar observação
                      </SaveObsButton>
                    </ObservacaoContainer>
                  )}
                </Row>
              );
            })}
          </List>
        )}

        <FooterBar>
          <SaveButton onClick={salvarPresenca} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Presença"}
          </SaveButton>
        </FooterBar>
      </Wrapper>
    </Screen>
  );
}