import { useState, useEffect} from "react";
import styled from "styled-components";
import { api } from "@/services/api";
import { useAuth } from "../../auth/AuthContext";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  font-size: 0.95rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  background: ${({ theme }) => theme.colors.card};
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 200px;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusCard = styled.div<{ $status: string }>`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: ${({ $status, theme }) => {
      const s = $status.toLowerCase();
      if (s === "falta") return theme.colors.danger;
      if (s === "presente") return theme.colors.primary;
      if (s === "justificada") return "#f59e0b";
      return theme.colors.muted;
    }};
  }
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatusLabel = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  font-size: 1.2rem;
`;

const Badge = styled.div<{ $status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.9rem;
  
  background: ${({ $status, theme }) => {
    const s = $status.toLowerCase();
    if (s === "falta") return `${theme.colors.danger}22`;
    if (s === "presente") return `${theme.colors.primary}22`;
    if (s === "justificada") return `#f59e0b22`;
    return theme.colors.card2;
  }};
  
  color: ${({ $status, theme }) => {
    const s = $status.toLowerCase();
    if (s === "falta") return theme.colors.danger;
    if (s === "presente") return theme.colors.primary;
    if (s === "justificada") return "#f59e0b";
    return theme.colors.text;
  }};
  
  border: 1px solid ${({ $status, theme }) => {
    const s = $status.toLowerCase();
    if (s === "falta") return theme.colors.danger;
    if (s === "presente") return theme.colors.primary;
    if (s === "justificada") return "#f59e0b";
    return theme.colors.border;
  }};
`;

const ObservacaoContainer = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.card2};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const ObservacaoTitle = styled.p`
  margin: 0 0 0.5rem 0;
  font-weight: 900;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
`;

const ObservacaoText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const FormJustificativa = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileInput = styled.input`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  
  &::file-selector-button {
    background: ${({ theme }) => theme.colors.card2};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 0.6rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 800;
    margin-right: 1rem;
    transition: filter 0.2s;
  }

  &::file-selector-button:hover {
    filter: brightness(1.1);
  }
`;

const SendButton = styled.button`
  align-self: flex-end;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 900;
  transition: transform 0.1s, filter 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const InfoLine = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
  text-align: center;
  padding: 2rem;
`;

export function PainelPai() {
  const { user } = useAuth();

  const [meusFilhos, setMeusFilhos] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [statusExibicao, setStatusExibicao] = useState("SEM_REGISTRO");
  const [observacaoExibicao, setObservacaoExibicao] = useState("");
  const [presencaIdReal, setPresencaIdReal] = useState("");
  const [justificativaEnviada, setJustificativaEnviada] = useState(false);

  const [motivo, setMotivo] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    let alive = true;
    async function carregarFilhos() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const todosAlunos = await api.getAlunos();
        if (!alive) return;

        const filhos = todosAlunos.filter((a: any) => {
          const respId = a.responsavelId?._id || a.responsavelId?.id || a.responsavelId;
          return String(respId) === String(user.id);
        });

        setMeusFilhos(filhos);

        if (filhos.length > 0) {
          setAlunoSelecionado((filhos[0] as any)._id || (filhos[0] as any).id);
        }
      } catch (error) {
        console.error("Erro ao carregar filhos:", error);
      } finally {
        if (alive) setLoading(false);
      }
    }
    carregarFilhos();
    return () => { alive = false; };
  }, [user]);

  useEffect(() => {
    async function buscarPresenca() {
      if (!alunoSelecionado || !dataSelecionada) return;

      const dataFormatada = new Date(dataSelecionada + "T00:00:00");
      const isFimDeSemana = dataFormatada.getDay() === 0 || dataFormatada.getDay() === 6;

      if (isFimDeSemana) {
        setStatusExibicao("FIM_DE_SEMANA");
        setObservacaoExibicao("");
        return;
      }

      try {
        const alunoObj = meusFilhos.find(f => (f._id || f.id) === alunoSelecionado);
        if (!alunoObj) return;

        const turmaId = typeof alunoObj.turmaId === 'object' ? (alunoObj.turmaId._id || alunoObj.turmaId.id) : alunoObj.turmaId;
        const presencasDaTurma = await api.getPresencasPorTurmaEData(turmaId, dataSelecionada);
        
        const presenca = presencasDaTurma.find((p: any) => {
           const idAlunoLista = p.alunoId?._id || p.alunoId?.id || p.alunoId;
           return String(idAlunoLista) === String(alunoSelecionado);
        });

        if (presenca) {
          setStatusExibicao(presenca.status);
          setObservacaoExibicao(presenca.observacao || "");
          setPresencaIdReal((presenca as any)._id || (presenca as any).id);
          setJustificativaEnviada(!!(presenca as any).justificativa);
        } else {
          setStatusExibicao("SEM_REGISTRO");
          setObservacaoExibicao("");
          setPresencaIdReal("");
          setJustificativaEnviada(false);
        }
      } catch (error) {
        console.error("Erro ao buscar presença do aluno:", error);
        setStatusExibicao("SEM_REGISTRO");
      }
    }

    buscarPresenca();
  }, [alunoSelecionado, dataSelecionada, meusFilhos]);

  async function handleEnviarJustificativa() {
    if (!motivo || !presencaIdReal) return;

    setEnviando(true);
    try {
      await api.atualizarPresenca(presencaIdReal, { 
        status: "justificada",
        justificativa: {
            motivo: motivo,
            arquivoUrl: arquivo ? "arquivo_pendente_de_upload.pdf" : null
        }
      } as any);
      alert("Justificativa enviada com sucesso!");
      setStatusExibicao("justificada");
      setJustificativaEnviada(true);
      setMotivo("");
      setArquivo(null);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao enviar a justificativa.");
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return <Screen><Wrapper><InfoLine>Buscando seus dados...</InfoLine></Wrapper></Screen>;
  }

  if (meusFilhos.length === 0) {
    return (
      <Screen>
        <Wrapper>
          <HeaderRow>
            <TitleBlock>
              <Title>Área do Responsável</Title>
              <Subtitle>Nenhum aluno encontrado vinculado ao seu perfil.</Subtitle>
            </TitleBlock>
          </HeaderRow>
        </Wrapper>
      </Screen>
    );
  }

  return (
    <Screen>
      <Wrapper>
        <HeaderRow>
          <TitleBlock>
            <Title>Área do Responsável</Title>
            <Subtitle>Acompanhe a frequência e os avisos do seu filho.</Subtitle>
          </TitleBlock>
        </HeaderRow>

        <Controls>
          <Field>
            <label>Aluno(a)</label>
            <Select 
              value={alunoSelecionado} 
              onChange={(e) => setAlunoSelecionado(e.target.value)}
            >
              {meusFilhos.map((filho) => (
                <option key={filho._id || filho.id} value={filho._id || filho.id}>
                  {filho.nome || (filho.userId && filho.userId.nome) || "Aluno"} 
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <label>Data</label>
            <DateInput
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </Field>
        </Controls>

        <StatusCard $status={statusExibicao}>
          <StatusHeader>
            <StatusLabel>
              Situação: {dataSelecionada.split('-').reverse().join('/')}
            </StatusLabel>
            
            <Badge $status={statusExibicao}>
              {statusExibicao.toLowerCase() === "falta" && "❌ FALTOU"}
              {statusExibicao.toLowerCase() === "presente" && "✔️ PRESENTE"}
              {statusExibicao.toLowerCase() === "justificada" && "📋 FALTA JUSTIFICADA"}
              {statusExibicao === "FIM_DE_SEMANA" && "🏖️ FIM DE SEMANA"}
              {statusExibicao === "SEM_REGISTRO" && "⏳ AGUARDANDO CHAMADA"}
            </Badge>
          </StatusHeader>

          {observacaoExibicao && statusExibicao !== "FIM_DE_SEMANA" && (
            <ObservacaoContainer>
              <ObservacaoTitle>Observação do Professor</ObservacaoTitle>
              <ObservacaoText>"{observacaoExibicao}"</ObservacaoText>
            </ObservacaoContainer>
          )}

          {statusExibicao.toLowerCase() === "falta" && !justificativaEnviada && (
            <FormJustificativa>
              <label style={{ fontWeight: 900, color: "#FFFFFF" }}>
                Deseja enviar uma justificativa para a escola?
              </label>
              
              <TextArea
                placeholder="Descreva o motivo (Ex: Estava com febre, consulta médica...)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={enviando}
              />

              <FileInput 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                disabled={enviando}
              />

              <SendButton 
                onClick={handleEnviarJustificativa} 
                disabled={enviando || !motivo}
              >
                {enviando ? "Enviando..." : "Enviar Justificativa"}
              </SendButton>
            </FormJustificativa>
          )}

          {justificativaEnviada && statusExibicao.toLowerCase() === "falta" && (
            <InfoLine style={{ padding: 0, textAlign: 'left', color: '#f59e0b', fontWeight: 'bold' }}>
              ✓ Você já enviou uma justificativa para esta falta.
            </InfoLine>
          )}

        </StatusCard>
      </Wrapper>
    </Screen>
  );
}