import { FormEvent, useState } from "react";
import styled from "styled-components";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;

  display: grid;
  gap: 1.25rem;
`;

const HeaderRow = styled.div`
  max-width: 860px;
  width: 100%;
  margin: 0 auto;

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
  font-size: 0.92rem;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.text};
`;

const Card = styled.form`
  max-width: 860px;
  width: 100%;
  margin: 0 auto;

  display: grid;
  gap: 0.95rem;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  padding: 1.25rem;

  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
`;

const Field = styled.div`
  display: grid;
  gap: 0.4rem;

  label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 800;
  }

  input,
  textarea {
    padding: 0.85rem 1rem;
    border-radius: 12px;

    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};

    outline: none;
    font-weight: 700;

    &::placeholder {
      color: ${({ theme }) => theme.colors.muted};
      opacity: 0.85;
      font-weight: 600;
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
    }
  }

  textarea {
    min-height: 240px;
    resize: vertical;
    font-weight: 650;
    line-height: 1.45;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`;

const BtnPrimary = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border-color: transparent;
`;

const BtnDanger = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.bg};
  border-color: transparent;
`;

const ErrorText = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 700;
`;

export function PostCreate() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [turma, setTurma] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createPost({ title, author, disciplina, turma, content });
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Falha ao criar atividade");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Wrapper>
        <HeaderRow>
          <TitleBlock>
            <Title>Nova atividade</Title>
            <Subtitle>
              <strong>(*)</strong> Campos obrigatórios
            </Subtitle>
          </TitleBlock>

          <Actions>
            <SecondaryButton type="button" onClick={() => navigate(-1)}>
              <IoArrowBackOutline />
              Voltar
            </SecondaryButton>
          </Actions>
        </HeaderRow>

        <Card onSubmit={onSubmit}>
          <Field>
            <label htmlFor="title">Título*</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Revisão de frações"
            />
          </Field>

          <Field>
            <label htmlFor="author">Autor*</label>
            <input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Ex: coordenador@taskclass.com"
            />
          </Field>

          <Field>
            <label htmlFor="disciplina">Disciplina*</label>
            <input
              id="disciplina"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              required
              placeholder="Ex: Matemática"
            />
          </Field>

          <Field>
            <label htmlFor="turma">Turma</label>
            <input
              id="turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              placeholder="Ex: 1º Ano A"
            />
          </Field>

          <Field>
            <label htmlFor="content">Conteúdo*</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Descreva a atividade, orientações e critérios..."
            />
          </Field>

          {error && <ErrorText role="alert">{error}</ErrorText>}

          <Row>
            <BtnPrimary disabled={loading}>
              {loading ? "Publicando…" : "Publicar"}
            </BtnPrimary>

            <BtnDanger type="button" onClick={() => navigate(-1)}>
              Cancelar
            </BtnDanger>
          </Row>
        </Card>
      </Wrapper>
    </Screen>
  );
}