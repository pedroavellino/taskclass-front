import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Hero = styled.div`
  padding: 2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }

  p {
    margin: 0.5rem 0 0;
    opacity: 0.85;
    font-size: 0.95rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: #2563eb;
  color: white;
  transition: 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #0f172a;
  transition: 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

export function Home() {

  const navigate = useNavigate();


  return (
    <Page>

      <Hero>
  <div>
    <h1>Atividades Educacionais</h1>
    <p>Gerencie, visualize e organize suas atividades e presenças.</p>
  </div>

  <Actions>
    <PrimaryButton onClick={() => navigate("/create")}>
      + Nova atividade
    </PrimaryButton>

    <SecondaryButton onClick={() => navigate("/turmas")}>
      Turmas
    </SecondaryButton>
  </Actions>
</Hero>

    </Page>
  );
}
