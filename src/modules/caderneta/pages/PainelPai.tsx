import { useState, useEffect } from "react"
import styled from "styled-components"
import { api } from "@/services/api"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`
const Header = styled.div`
  background: #1e293b;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const DateInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-weight: bold;
  color: #1e293b;
  font-size: 1rem;
  cursor: pointer;
`
const CardStatus = styled.div<{ $status: string }>`
  background: white;
  border: 1px solid ${({ $status }) => 
    $status === "FALTA" ? "#fee2e2" : 
    $status === "PRESENTE" ? "#dcfce7" : 
    $status === "FIM_DE_SEMANA" ? "#f3f4f6" : "#e2e8f0"};
    
  border-left: 5px solid ${({ $status }) => 
    $status === "FALTA" ? "#ef4444" : 
    $status === "PRESENTE" ? "#22c55e" : 
    $status === "FIM_DE_SEMANA" ? "#9ca3af" : "#94a3b8"};
    
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`
const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Badge = styled.span<{ $status: string }>`
  background: ${({ $status }) => 
    $status === "FALTA" ? "#fee2e2" : 
    $status === "PRESENTE" ? "#dcfce7" : 
    $status === "FIM_DE_SEMANA" ? "#e5e7eb" : "#f1f5f9"};
    
  color: ${({ $status }) => 
    $status === "FALTA" ? "#991b1b" : 
    $status === "PRESENTE" ? "#166534" : 
    $status === "FIM_DE_SEMANA" ? "#4b5563" : "#475569"};
    
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
`
const ObservacaoBox = styled.div`
  background: #f8fafc;
  border-left: 4px solid #6366f1;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 0.5rem;
`
const ObservacaoTitle = styled.p`
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
`
const ObservacaoText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #1e293b;
  font-style: italic;
`
const FormJustificativa = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #cbd5e1;
`
const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  &:focus { outline: none; border-color: #3b82f6; }
`
const FileInput = styled.input`
  font-size: 0.9rem;
  &::file-selector-button {
    background: #e2e8f0;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-right: 10px;
  }
`
const SendButton = styled.button`
  align-self: flex-end;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #2563eb; }
`

export function PainelPai() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0])
  const [motivo, setMotivo] = useState("")
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusExibicao, setStatusExibicao] = useState("SEM_REGISTRO")
  const [observacaoExibicao, setObservacaoExibicao] = useState("")
  const [presencaIdReal, setPresencaIdReal] = useState("")

  const ALUNO_ID = "699356f947beff9a86501d7c" 
  const TURMA_ID = "6993552847beff9a86501d6a"

  const dataFormatada = new Date(dataSelecionada + "T00:00:00")
  const diaDaSemana = dataFormatada.getDay() 
  const isFimDeSemana = diaDaSemana === 0 || diaDaSemana === 6 

  useEffect(() => {
    async function buscarDadosDoEder() {
      if (isFimDeSemana) {
        setStatusExibicao("FIM_DE_SEMANA")
        setObservacaoExibicao("")
        return
      }

      try {
        const response = await api.getPresencas(TURMA_ID, dataSelecionada)
        const lista = response.data || []

        const presencaDoEder = lista.find((p: any) => 
          (p.alunoId?._id === ALUNO_ID || p.alunoId === ALUNO_ID) && 
          (p.data && p.data.split('T')[0] === dataSelecionada)
        )

        if (presencaDoEder) {
          setStatusExibicao(presencaDoEder.status.toUpperCase())
          setObservacaoExibicao(presencaDoEder.observacao || "")
          setPresencaIdReal(presencaDoEder._id || presencaDoEder.id)
        } else {
          setStatusExibicao("SEM_REGISTRO")
          setObservacaoExibicao("")
          setPresencaIdReal("")
        }

      } catch (error) {
        console.error("Erro ao buscar presença do aluno:", error)
        setStatusExibicao("SEM_REGISTRO")
        setObservacaoExibicao("")
      }
    }
    buscarDadosDoEder()

  }, [dataSelecionada, isFimDeSemana])

  async function handleEnviarJustificativa() {
    if (!motivo || !arquivo || !presencaIdReal) {
      alert("Por favor, preencha o motivo, anexe o atestado e certifique-se de que há uma falta registrada.")
      return
    }

    setLoading(true)
    try {
      await api.enviarJustificativa(presencaIdReal, ALUNO_ID, motivo, arquivo)
      alert("Justificativa e atestado enviados com sucesso!")
      setMotivo("")
      setArquivo(null)
    } catch (error) {
      console.error("Erro ao enviar:", error)
      alert("Erro ao enviar o arquivo. O Elias já criou a rota POST /justificativas?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <div>
          <h2 style={{ margin: 0 }}>Área do Responsável</h2>
          <p style={{ margin: 0, marginTop: '5px', color: '#cbd5e1' }}>Consultando: Eder Santos</p>
        </div>
        
        <DateInput
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
      </Header>

      <CardStatus $status={statusExibicao}>
        <RowTop>
          <div>
            <h4 style={{ margin: 0, color: '#1e293b' }}>
              Status do Dia: {dataSelecionada.split('-').reverse().join('/')}
            </h4>
          </div>
          
          <Badge $status={statusExibicao}>
            {statusExibicao === "FALTA" && "❌ FALTOU"}
            {statusExibicao === "PRESENTE" && "✔️ PRESENTE"}
            {statusExibicao === "FIM_DE_SEMANA" && "🏖️ FIM DE SEMANA"}
            {statusExibicao === "SEM_REGISTRO" && "⏳ AGUARDANDO CHAMADA"}
          </Badge>
        </RowTop>

        {observacaoExibicao && statusExibicao !== "FIM_DE_SEMANA" && (
          <ObservacaoBox>
            <ObservacaoTitle>📝 Observação do Professor:</ObservacaoTitle>
            <ObservacaoText>"{observacaoExibicao}"</ObservacaoText>
          </ObservacaoBox>
        )}

        {statusExibicao === "FALTA" && (
          <FormJustificativa>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
              Deseja justificar esta falta?
            </p>
            
            <TextArea
              placeholder="Digite o motivo (Ex: Estava com febre, consulta médica...)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />

            <div>
              <FileInput 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
            </div>

            <SendButton 
              onClick={handleEnviarJustificativa} 
              disabled={loading || !motivo || !arquivo}
            >
              {loading ? "Enviando..." : "Enviar Justificativa"}
            </SendButton>
          </FormJustificativa>
        )}
      </CardStatus>
    </Container>
  )
}