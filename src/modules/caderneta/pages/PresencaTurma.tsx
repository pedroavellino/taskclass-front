import { useEffect, useState } from "react";
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

const AttachmentButton = styled.button`
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.85rem;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.muted};

  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.07);
    color: ${({ theme }) => theme.colors.text};
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  width: min(520px, 100%);
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  padding: 1.25rem 1.25rem 1rem;
`;

const ModalTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  letter-spacing: 0.2px;
`;

const ModalText = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1rem;

  width: 100%;
  box-sizing: border-box;
  text-align: center;

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  font-weight: 900;
  text-decoration: none;

  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
  }
`;

const MutedHint = styled.p`
  margin: 1rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.92rem;
  font-style: italic;
`;

const CloseButton = styled(SecondaryButton)`
  width: 100%;
  margin-top: 0.75rem;
`;

type Aluno = {
  _id?: string;
  id?: string;
  nome: string;
  turmaId?: string;
};

export function PresencaTurma() {
  const { turmaId } = useParams();
  const navigate = useNavigate();

  const [presencasOriginais, setPresencasOriginais] = useState<
    Record<string, { id: string; status: string }>
  >({});
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [presencas, setPresencas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const [mostrarObs, setMostrarObs] = useState<Record<string, boolean>>({});

  const [justificativas, setJustificativas] = useState<
    Record<string, { motivo: string; arquivoUrl: string }>
  >({});
  const [justificativaAberta, setJustificativaAberta] = useState<{
    motivo: string;
    arquivoUrl?: string;
  } | null>(null);

  useEffect(() => {
    async function carregarAlunos() {
      if (!turmaId) return;
      try {
        const response = await api.getAlunosPorTurma(turmaId);
        setAlunos(response);
      } catch (err) {
        console.error("Erro ao carregar alunos", err);
      }
    }
    carregarAlunos();
  }, [turmaId]);

  useEffect(() => {
    async function carregarPresencas() {
      if (!turmaId) return;

      setObservacoes({});
      setMostrarObs({});
      setJustificativas({});

      try {
        const response = await api.getPresencas(turmaId, dataSelecionada);

        const mapaUI: Record<string, string> = {};
        const mapaOrig: Record<string, { id: string; status: string }> = {};
        const mapaObs: Record<string, string> = {};
        const mapaJustificativas: Record<
          string,
          { motivo: string; arquivoUrl: string }
        > = {};

        const lista = response.data || [];

        lista.forEach((p: any) => {
          const dataDaPresenca = p.data ? p.data.split("T")[0] : "";

          if (dataDaPresenca === dataSelecionada) {
            const idAluno = p.alunoId?._id || p.alunoId;
            const idPresenca = p._id || p.id;
            const statusUpper = String(p.status).toUpperCase();

            mapaUI[idAluno] = statusUpper;
            mapaOrig[idAluno] = { id: idPresenca, status: statusUpper };

            if (p.observacao) {
              mapaObs[idAluno] = p.observacao;
            }
            if (p.justificativa) {
              mapaJustificativas[idAluno] = {
                motivo: p.justificativa.motivo || p.motivoJustificativa,
                arquivoUrl: p.justificativa.arquivoUrl || p.urlAtestado,
              };
            }
          }
        });

        setPresencas(mapaUI);
        setPresencasOriginais(mapaOrig);
        setObservacoes(mapaObs);
        setJustificativas(mapaJustificativas);
      } catch (err) {
        console.log("Sem presenças para essa data");
        setPresencas({});
        setPresencasOriginais({});
        setObservacoes({});
        setJustificativas({});
      }
    }

    carregarPresencas();
  }, [turmaId, dataSelecionada]);

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
        "A presença deste aluno ainda não foi salva. Primeiro marque se ele faltou ou veio e clique no botão 'Salvar Presença' lá embaixo!"
      );
      return;
    }

    try {
      await api.atualizarPresenca(original.id, original.status.toLowerCase(), obsAtual);
      alert("Observação salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      alert("Erro ao salvar a observação. Verifique o console.");
    }
  }

  async function salvarPresenca() {
    if (!turmaId) return;
    setLoading(true);

    try {
      let realTurmaId = turmaId;
      if (alunos.length > 0 && alunos[0].turmaId) {
        const tId = alunos[0].turmaId as any;
        realTurmaId =
          typeof tId === "object" ? tId._id || tId.id || turmaId : tId;
      }

      for (const [alunoIdStr, status] of Object.entries(presencas)) {
        const original = presencasOriginais[alunoIdStr];
        const obsAtual = observacoes[alunoIdStr] || "";

        if (original && original.status === status) {
          continue;
        }

        if (original) {
          await api.atualizarPresenca(original.id, status.toLowerCase(), obsAtual);
        } else {
          const payload = {
            alunoId: alunoIdStr,
            turmaId: realTurmaId as string,
            data: dataSelecionada,
            status: status.toLowerCase(),
            observacao: obsAtual,
          };
          await api.salvarPresenca(payload);
        }
      }

      alert("Presença salva/atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao processar as presenças. Verifique o console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Wrapper>
        <TopBar>
          <TitleBlock>
            <Title>Caderneta</Title>
            <Subtitle>Turma {turmaId} • Selecione a data e marque a presença.</Subtitle>
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

        <List>
          {alunos.map((aluno) => {
            const id = aluno._id || aluno.id || "";

            return (
              <Row key={id}>
                <RowTop>
                  <StudentName>{aluno.nome}</StudentName>

                  <StatusButtons>
                    {justificativas[id] && (
                      <AttachmentButton
                        onClick={() => setJustificativaAberta(justificativas[id])}
                      >
                        📎 Ver justificativa
                      </AttachmentButton>
                    )}

                    <ChipButton
                      $tone="primary"
                      $active={presencas[id] === "PRESENTE"}
                      onClick={() => marcarPresenca(id, "PRESENTE")}
                    >
                      Presente
                    </ChipButton>

                    <ChipButton
                      $tone="danger"
                      $active={presencas[id] === "FALTA"}
                      onClick={() => marcarPresenca(id, "FALTA")}
                    >
                      Faltou
                    </ChipButton>

                    <ChipButton
                      $tone="warning"
                      $active={presencas[id] === "JUSTIFICADA"}
                      onClick={() => marcarPresenca(id, "JUSTIFICADA")}
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
                        setObservacoes((prev) => ({ ...prev, [id]: e.target.value }))
                      }
                    />

                    <SaveObsButton type="button" onClick={() => salvarObservacaoUnica(id)}>
                      Salvar observação
                    </SaveObsButton>
                  </ObservacaoContainer>
                )}
              </Row>
            );
          })}
        </List>

        <FooterBar>
          <SaveButton onClick={salvarPresenca} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Presença"}
          </SaveButton>
        </FooterBar>

        {justificativaAberta && (
          <ModalOverlay onClick={() => setJustificativaAberta(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Detalhes da justificativa</ModalTitle>

              <ModalText>
                <strong>Motivo:</strong>
                <br />
                {justificativaAberta.motivo}
              </ModalText>

              {justificativaAberta.arquivoUrl ? (
                <ModalLink
                  href={justificativaAberta.arquivoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  📥 Baixar arquivo anexo
                </ModalLink>
              ) : (
                <MutedHint>Nenhum arquivo foi anexado.</MutedHint>
              )}

              <CloseButton type="button" onClick={() => setJustificativaAberta(null)}>
                Fechar
              </CloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </Wrapper>
    </Screen>
  );
}