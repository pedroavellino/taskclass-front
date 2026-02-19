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
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`
const StatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const StatusButton = styled.button<{ $active?: boolean; $danger?: boolean }>`
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  border: 1px solid ${({ $danger }) => ($danger ? "#dc2626" : "#2563eb")};
  background: ${({ $active, $danger }) =>
    $active ? ($danger ? "#dc2626" : "#2563eb") : "white"};
  color: ${({ $active }) => ($active ? "white" : undefined)};
  cursor: pointer;
  font-weight: 600;
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
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [presencas, setPresencas] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  
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

  // Carregar Presenças já existentes
  useEffect(() => {
    async function carregarPresencas() {
      if (!turmaId) return;
      try {
        const response = await api.getPresencas(turmaId, dataSelecionada)

        const mapaUI: Record<string, string> = {}
        const mapaOrig: Record<string, { id: string, status: string }> = {}

        const lista = response.data || []

        lista.forEach((p: any) => {
          // O Mongo salva a data assim: "2026-02-18T00:00:00.000Z"
          // O split('T')[0] corta tudo depois do T, deixando só "2026-02-18"
          const dataDaPresenca = p.data ? p.data.split('T')[0] : "";

          // O FILTRO MÁGICO: Só processa se a data bater com a do calendário
          if (dataDaPresenca === dataSelecionada) {
            const idAluno = p.alunoId?._id || p.alunoId
            const idPresenca = p._id || p.id
            const statusUpper = p.status.toUpperCase()

            mapaUI[idAluno] = statusUpper
            mapaOrig[idAluno] = { id: idPresenca, status: statusUpper } 
          }
        })

        setPresencas(mapaUI) 
        setPresencasOriginais(mapaOrig) 
      } catch (err) {
        console.log("Sem presenças para essa data")
        setPresencas({})
        setPresencasOriginais({})
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

  async function salvarPresenca() {
    if (!turmaId) return;
    setLoading(true)
    
    try {
      // Tenta extrair o Mongo ID da turma de forma blindada
      let realTurmaId = turmaId;
      if (alunos.length > 0 && alunos[0].turmaId) {
        const tId = alunos[0].turmaId as any;
        realTurmaId = typeof tId === 'object' ? (tId._id || tId.id || turmaId) : tId;
      }

      for (const [alunoIdStr, status] of Object.entries(presencas)) {
        const original = presencasOriginais[alunoIdStr]

        if (original && original.status === status) {
          continue; 
        }

        if (original) {
          await api.atualizarPresenca(original.id, status.toLowerCase())
        } else {
          
          const payload = {
            alunoId: alunoIdStr,
            turmaId: realTurmaId as string,
            data: dataSelecionada,
            status: status.toLowerCase(),
          }
          
          // A NOSSA LUPA: Vai mostrar exatamente o que estamos enviando
          console.log("Enviando POST (Criar Nova Presença):", payload);

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
              <span>{aluno.nome}</span>

              <StatusButtons>
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
              </StatusButtons>
            </Row>
          )
        })}
      </Table>

      <SaveButton onClick={salvarPresenca} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Presença"}
      </SaveButton>
    </Container>
  )
}