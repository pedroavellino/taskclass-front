import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

type Turma = {
  id: string
  nome: string
  ano: string
  turno: string
  totalAlunos: number
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const Title = styled.h2`
  margin: 0;
`

const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  background: #1e293b;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0f172a;
  }
`

const SearchInput = styled.input`
  margin-bottom: 1rem;
  padding: 0.7rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`

const Card = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  h3 {
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
  }
`

export function Turmas() {
  const navigate = useNavigate()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    setTurmas([
      { id: "1", nome: "1º Ano A", ano: "2026", turno: "Manhã", totalAlunos: 28 },
      { id: "2", nome: "2º Ano B", ano: "2026", turno: "Tarde", totalAlunos: 25 },
      { id: "3", nome: "3º Ano C", ano: "2026", turno: "Noite", totalAlunos: 30 },
    ])
  }, [])

  const filtered = turmas.filter(t =>
    t.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Wrapper>
      <HeaderRow>
    <Title>Minhas Turmas</Title>

    <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button onClick={() => navigate("/")}>
        ← Voltar
        </Button>

    <Button>
        + Nova Turma
        </Button>
    </div>
    </HeaderRow>

      <SearchInput
        placeholder="Buscar turma..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid>
        {filtered.map((turma) => (
          <Card key={turma.id} onClick={() => navigate(`/turmas/${turma.id}/presenca`)
}>
            <h3>{turma.nome}</h3>
            <p>Ano: {turma.ano}</p>
            <p>Turno: {turma.turno}</p>
            <p>{turma.totalAlunos} alunos</p>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  )
}
