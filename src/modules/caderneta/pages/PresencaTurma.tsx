import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styled from "styled-components"

const BASE_URL = "https://task-class-api-latest.onrender.com"

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

  &:hover {
    background: #0f172a;
  }
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

const StatusButton = styled.button<{ active?: boolean; danger?: boolean }>`
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  border: 1px solid ${({ danger }) => (danger ? "#dc2626" : "#2563eb")};
  background: ${({ active, danger }) =>
    active
      ? danger
        ? "#dc2626"
        : "#2563eb"
      : "white"};
  color: ${({ active, danger }) =>
    active
      ? "white"
      : danger
      ? "#dc2626"
      : "#2563eb"};
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

  &:hover {
    background: #0f172a;
  }
`

type Aluno = {
  id: number
  nome: string
}

export function PresencaTurma() {
  const { turmaId } = useParams()
  const navigate = useNavigate()

  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [presencas, setPresencas] = useState<Record<number, string>>({})

  useEffect(() => {
    async function carregarAlunos() {
      const response = await fetch(`${BASE_URL}/alunos?turmaId=${turmaId}`)
      const data = await response.json()
      setAlunos(data)
    }

    carregarAlunos()
  }, [turmaId])

  
  useEffect(() => {
    async function carregarPresencas() {
      const response = await fetch(
        `${BASE_URL}/presencas?turmaId=${turmaId}&data=${dataSelecionada}`
      )

      if (!response.ok) {
        setPresencas({})
        return
      }

      const data = await response.json()

      const mapa: Record<number, string> = {}

      data.forEach((p: any) => {
        mapa[p.alunoId] = p.status
      })

      setPresencas(mapa)
    }

    carregarPresencas()
  }, [turmaId, dataSelecionada])

  function marcarPresenca(alunoId: number, status: string) {
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: status,
    }))
  }

  async function salvarPresenca() {
    const registros = alunos.map((aluno) => ({
      alunoId: aluno.id,
      turmaId: Number(turmaId),
      data: dataSelecionada,
      status: presencas[aluno.id] || null,
    }))

    await fetch(`${BASE_URL}/presencas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registros),
    })

    alert("Presença salva com sucesso!")
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
        {alunos.map((aluno) => (
          <Row key={aluno.id}>
            <span>{aluno.nome}</span>

            <StatusButtons>
              <StatusButton
                active={presencas[aluno.id] === "Presente"}
                onClick={() => marcarPresenca(aluno.id, "Presente")}
              >
                Presente
              </StatusButton>

              <StatusButton
                danger
                active={presencas[aluno.id] === "Faltou"}
                onClick={() => marcarPresenca(aluno.id, "Faltou")}
              >
                Faltou
              </StatusButton>
            </StatusButtons>
          </Row>
        ))}
      </Table>

      <SaveButton onClick={salvarPresenca}>
        Salvar Presença
      </SaveButton>
    </Container>
  )
}
