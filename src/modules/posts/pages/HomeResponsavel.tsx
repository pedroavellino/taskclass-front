import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../auth/AuthContext";
import { useMemo } from "react";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeBlock = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Greeting = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.1rem;
`;

const GridMenu = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MenuCard = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2.5rem 1.5rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.card2};
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  font-size: 1.25rem;
`;

const CardDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
  text-align: center;
  line-height: 1.4;
`;

export function HomeResponsavel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const nomeExibicao = useMemo(() => {
    if (!user?.name) return "Responsável";
    
    if (user.name.includes('@')) {
      const parteAntesDoArroba = user.name.split('@')[0];
      return parteAntesDoArroba.charAt(0).toUpperCase() + parteAntesDoArroba.slice(1);
    }
    
    return user.name;
  }, [user?.name]);
  return (
    <Screen>
      <Wrapper>
        <WelcomeBlock>
          <Greeting>Olá, {nomeExibicao}</Greeting>
          <Subtitle>O que você deseja acompanhar hoje?</Subtitle>
        </WelcomeBlock>

        <GridMenu>
          <MenuCard onClick={() => navigate("/painel-pai")}>
            <IconWrapper>📅</IconWrapper>
            <CardTitle>Frequência Escolar</CardTitle>
            <CardDesc>
              Veja as presenças, faltas e envie justificativas de atestados médicos.
            </CardDesc>
          </MenuCard>

          <MenuCard onClick={() => navigate("/atividades")}>
            <IconWrapper>📝</IconWrapper>
            <CardTitle>Atividades e Notas</CardTitle>
            <CardDesc>
              Acompanhe as tarefas de casa, provas e o desempenho acadêmico.
            </CardDesc>
          </MenuCard>
        </GridMenu>
      </Wrapper>
    </Screen>
  );
}