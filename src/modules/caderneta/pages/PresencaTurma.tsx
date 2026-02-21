import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { api } from "@/services/api"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const BackButton = styled.button`
  background: #1e293b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:hover { background: #0f172a; }
`
const DateInput = styled.input`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
`
const Table = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`
const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const StatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`
const StatusButton = styled.button<{ $active?: boolean; $danger?: boolean; $info?: boolean; $warning?: boolean }>`
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  border: 1px solid ${({ $danger, $info, $warning }) => 
    $danger ? "#dc2626" : $warning ? "#f59e0b" : $info ? "#6366f1" : "#2563eb"};
  
  background: ${({ $active, $danger, $info, $warning }) =>
    $active 
      ? ($danger ? "#dc2626" : $warning ? "#f59e0b" : $info ? "#6366f1" : "#2563eb") 
      : "white"};
      
  color: ${({ $active }) => ($active ? "white" : undefined)};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
`
const SaveButton = styled.button`
  align-self: flex-end;
  background: #1e293b;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0f172a; }
`
const ObservacaoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #94a3b8;
`
const ObservacaoInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  font-size: 0.9rem;
  &:focus { outline: none; border-color: #6366f1; }
`
const BotaoAtestado = styled.button`
  background: #f8fafc;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
  &:hover { background: #e2e8f0; color: #1e293b; }
`
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`
const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
`

type Aluno = {
  _id?: string
  id?: string
  nome: string
  turmaId?: string
}

export function PresencaTurma() {
  const { turmaId } = useParams()
  const navigate = useNavigate()
  
  const [presencasOriginais, setPresencasOriginais] = useState<Record<string, { id: string, status: string }>>({})
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0])
  const [presencas, setPresencas] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const [observacoes, setObservacoes] = useState<Record<string, string>>({})
  const [mostrarObs, setMostrarObs] = useState<Record<string, boolean>>({})
  
  const [justificativas, setJustificativas] = useState<Record<string, { motivo: string, arquivoUrl: string }>>({})
  const [justificativaAberta, setJustificativaAberta] = useState<{ motivo: string, arquivoUrl?: string } | null>(null)

  useEffect(() => {
    async function carregarAlunos() {
      if (!turmaId) return;
      try {
        const response = await api.getAlunosPorTurma(turmaId)
        setAlunos(response)
      } catch (err) {
        console.error("Erro ao carregar alunos", err)
      }
    }
    carregarAlunos()
  }, [turmaId])

  useEffect(() => {
    async function carregarPresencas() {
      if (!turmaId) return;

      setObservacoes({}); 
      setMostrarObs({});
      setJustificativas({});
      
      try {
        const response = await api.getPresencas(turmaId, dataSelecionada)

        const mapaUI: Record<string, string> = {}
        const mapaOrig: Record<string, { id: string, status: string }> = {}
        const mapaObs: Record<string, string> = {} 
        const mapaJustificativas: Record<string, { motivo: string, arquivoUrl: string }> = {}

        const lista = response.data || []

        lista.forEach((p: any) => {
          const dataDaPresenca = p.data ? p.data.split('T')[0] : "";

          if (dataDaPresenca === dataSelecionada) {
            const idAluno = p.alunoId?._id || p.alunoId
            const idPresenca = p._id || p.id
            const statusUpper = p.status.toUpperCase()

            mapaUI[idAluno] = statusUpper
            mapaOrig[idAluno] = { id: idPresenca, status: statusUpper } 
            
            if (p.observacao) {
              mapaObs[idAluno] = p.observacao
            }
            if (p.justificativa) {
               mapaJustificativas[idAluno] = {
                 motivo: p.justificativa.motivo || p.motivoJustificativa,
                 arquivoUrl: p.justificativa.arquivoUrl || p.urlAtestado
               }
            }
          }
        })

        setPresencas(mapaUI) 
        setPresencasOriginais(mapaOrig) 
        setObservacoes(mapaObs) 
        setJustificativas(mapaJustificativas)

      } catch (err) {
        console.log("Sem presenças para essa data")
        setPresencas({})
        setPresencasOriginais({})
        setObservacoes({})
        setJustificativas({})
      }
    }

    carregarPresencas()
  }, [turmaId, dataSelecionada])

  function marcarPresenca(alunoId: string, status: string) {
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: status,
    }))
  }

  function toggleObs(alunoId: string) {
    setMostrarObs((prev) => ({
      ...prev,
      [alunoId]: !prev[alunoId]
    }))
  }

  async function salvarObservacaoUnica(alunoId: string) {
    const obsAtual = observacoes[alunoId] || "";
    const original = presencasOriginais[alunoId];

    if (!original) {
      alert("A presença deste aluno ainda não foi salva. Primeiro marque se ele faltou ou veio e clique no botão 'Salvar Presença' lá embaixo!");
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
    setLoading(true)
    
    try {
      let realTurmaId = turmaId;
      if (alunos.length > 0 && alunos[0].turmaId) {
        const tId = alunos[0].turmaId as any;
        realTurmaId = typeof tId === 'object' ? (tId._id || tId.id || turmaId) : tId;
      }

      for (const [alunoIdStr, status] of Object.entries(presencas)) {
        const original = presencasOriginais[alunoIdStr]
        const obsAtual = observacoes[alunoIdStr] || ""

        if (original && original.status === status) {
          continue; 
        }

        if (original) {
          await api.atualizarPresenca(original.id, status.toLowerCase(), obsAtual)
        } else {
          const payload = {
            alunoId: alunoIdStr,
            turmaId: realTurmaId as string,
            data: dataSelecionada,
            status: status.toLowerCase(),
            observacao: obsAtual 
          }
          await api.salvarPresenca(payload)
        }
      }

      alert("Presença salva/atualizada com sucesso!")
      
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao processar as presenças. Verifique o console.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <TopBar>
        <BackButton onClick={() => navigate("/turmas")}>
          ← Voltar
        </BackButton>

        <DateInput
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
      </TopBar>

      <h2>Caderneta da Turma {turmaId}</h2>

      <Table>
        {alunos.map((aluno) => {
          const id = aluno._id || aluno.id || '';
          
          return (
            <Row key={id}>
              <RowTop>
                <span>{aluno.nome}</span>

                <StatusButtons>
                  {justificativas[id] && (
                     <BotaoAtestado onClick={() => setJustificativaAberta(justificativas[id])}>
                        📎 Ver Justificativa
                     </BotaoAtestado>
                  )}
                
                  <StatusButton
                    $active={presencas[id] === "PRESENTE"}
                    onClick={() => marcarPresenca(id, "PRESENTE")}
                  >
                    Presente
                  </StatusButton>

                  <StatusButton
                    $danger
                    $active={presencas[id] === "FALTA"}
                    onClick={() => marcarPresenca(id, "FALTA")}
                  >
                    Faltou
                  </StatusButton>
                
                  <StatusButton
                    $warning
                    $active={presencas[id] === "JUSTIFICADA"}
                    onClick={() => marcarPresenca(id, "JUSTIFICADA")}
                  >
                    Justificada
                  </StatusButton>

                  <StatusButton
                    $info
                    $active={mostrarObs[id] || !!observacoes[id]}
                    onClick={() => toggleObs(id)}
                  >
                   Observação
                  </StatusButton>
                </StatusButtons>
              </RowTop>

              {(mostrarObs[id] || observacoes[id]) && (
                <ObservacaoContainer>
                  <ObservacaoInput
                    placeholder="Adicione uma observação (comportamento, nota, aviso)..."
                    value={observacoes[id] || ""}
                    onChange={(e) => setObservacoes(prev => ({ ...prev, [id]: e.target.value }))}
                  />
                  
                  <button
                    onClick={() => salvarObservacaoUnica(id)}
                    style={{
                      alignSelf: 'flex-end',
                      padding: '0.4rem 1rem',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      marginTop: '0.5rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                  >
                   Salvar Observação
                  </button>
                </ObservacaoContainer>
              )}
            </Row>
          )
        })}
      </Table>

      <SaveButton onClick={salvarPresenca} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Presença"}
      </SaveButton>

      {justificativaAberta && (
        <ModalOverlay onClick={() => setJustificativaAberta(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Detalhes da Justificativa</h3>
            
            <p style={{ color: '#475569', lineHeight: '1.5' }}>
              <strong>Motivo:</strong><br/>
              {justificativaAberta.motivo}
            </p>

            {justificativaAberta.arquivoUrl ? (
              <a href={justificativaAberta.arquivoUrl} target="_blank" rel="noreferrer" style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.6rem 1.2rem',
                background: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                📥 Baixar Arquivo Anexo
              </a>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '1rem' }}>
                Nenhum arquivo foi anexado.
              </p>
            )}

            <button
              onClick={() => setJustificativaAberta(null)}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '1rem',
                padding: '0.6rem',
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#475569'
              }}
            >
              Fechar
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}