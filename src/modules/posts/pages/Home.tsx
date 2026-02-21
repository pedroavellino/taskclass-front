import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: grid;
  gap: 1.25rem;
`;

const Hero = styled.div`
  position: relative;
  padding: 1.35rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.card},
    ${({ theme }) => theme.colors.bg}
  );

  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);

  color: ${({ theme }) => theme.colors.text};

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;

  &::before {
    content: "";
    position: absolute;
    top: -80px;
    right: -60px;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.primary} 0%,
      transparent 70%
    );
    opacity: 0.12;
    pointer-events: none;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    letter-spacing: 0.2px;
    font-weight: 900;
    position: relative;
    z-index: 1;
  }

  p {
    margin: 0.35rem 0 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.95rem;
    line-height: 1.35;
    position: relative;
    z-index: 1;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ButtonBase = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.02s ease, filter 0.15s ease, background 0.15s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    filter: brightness(1.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border-color: transparent;
`;

const SecondaryButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.text};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.35);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1rem 1.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: 0.2px;
  }

  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const CardBody = styled.div`
  padding: 1.1rem;
`;

const EmptyState = styled.div`
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem 0.25rem;
  color: ${({ theme }) => theme.colors.muted};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.98rem;
    font-weight: 900;
  }

  p {
    margin: 0;
    line-height: 1.45;
    font-size: 0.92rem;
  }
`;

const HintRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Hint = styled.div`
  padding: 0.45rem 0.6rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
  font-weight: 800;
`;

const QuickActions = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const ActionTile = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card2};
  cursor: pointer;
  transition: transform 0.02s ease, box-shadow 0.15s ease, filter 0.15s ease;

  &:hover {
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    filter: brightness(1.06);
  }
  &:active {
    transform: translateY(1px);
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    font-weight: 900;
    margin-bottom: 0.15rem;
  }

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.88rem;
    line-height: 1.35;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const Stat = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card2};
  border-radius: 14px;
  padding: 0.85rem 0.9rem;

  small {
    display: block;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 900;
    font-size: 0.78rem;
    letter-spacing: 0.2px;
    margin-bottom: 0.25rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.2rem;
    font-weight: 900;
  }
`;

export function Home() {
  const navigate = useNavigate();

  const totalAtividades = 0;
  const turmasAtivas = 0;

  return (
    <Screen>
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

        <ContentGrid>
          <Card>
            <CardHeader>
              <h2>Atividades</h2>
              <span>Organize o que vai ser aplicado</span>
            </CardHeader>

            <CardBody>
              <EmptyState>
                <strong>Nenhuma atividade cadastrada ainda</strong>
                <p>
                  Comece criando sua primeira atividade. Depois você poderá
                  editar, visualizar e acompanhar tudo por aqui.
                </p>

                <HintRow>
                  <Hint>Título + disciplina</Hint>
                  <Hint>Descrição</Hint>
                  <Hint>Presenças por turma</Hint>
                </HintRow>

                <div>
                  <PrimaryButton onClick={() => navigate("/create")}>
                    Criar primeira atividade
                  </PrimaryButton>
                </div>
              </EmptyState>
            </CardBody>
          </Card>

          <div style={{ display: "grid", gap: "1.25rem" }}>
            <Card>
              <CardHeader>
                <h2>Resumo</h2>
                <span>Visão rápida</span>
              </CardHeader>
              <CardBody>
                <StatGrid>
                  <Stat>
                    <small>ATIVIDADES</small>
                    <strong>{totalAtividades}</strong>
                  </Stat>
                  <Stat>
                    <small>TURMAS</small>
                    <strong>{turmasAtivas}</strong>
                  </Stat>
                </StatGrid>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2>Ações rápidas</h2>
                <span>Atalhos</span>
              </CardHeader>
              <CardBody>
                <QuickActions>
                  <ActionTile onClick={() => navigate("/create")}>
                    <strong>Nova atividade</strong>
                    <span>Criar uma atividade para seus alunos</span>
                  </ActionTile>

                  <ActionTile onClick={() => navigate("/turmas")}>
                    <strong>Turmas</strong>
                    <span>Ver turmas e registrar presença</span>
                  </ActionTile>

                  <ActionTile onClick={() => navigate("/admin")}>
                    <strong>Admin</strong>
                    <span>Gerenciar e revisar conteúdos</span>
                  </ActionTile>
                </QuickActions>
              </CardBody>
            </Card>
          </div>
        </ContentGrid>
      </Page>
    </Screen>
  );
}