import { FormEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { api } from "@/services/api";
import { useNavigate, useParams } from "react-router-dom";
import type { Post } from "@/types";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;

  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Content = styled.div`
  width: 100%;
  max-width: 820px;
  margin: 0 auto;

  display: grid;
  gap: 1rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
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
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.text};
`;

const PrimaryButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  border-color: transparent;
`;

const FormCard = styled.form`
  width: 100%;

  border-radius: 18px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);

  padding: 1.2rem 1.15rem;

  display: grid;
  gap: 0.9rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  letter-spacing: 0.15px;
`;

const Field = styled.div`
  display: grid;
  gap: 0.4rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.92rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  font-weight: 800;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.85;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  resize: vertical;
  min-height: 220px;
  font-family: inherit;
  font-size: 0.92rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.85;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.95rem;
`;

const FooterBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
`;

type UpdatePostPayload = {
  title: string;
  author: string;
  content: string;
  disciplina: string;
};

export function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = useMemo(() => (id ? String(id) : ""), [id]);

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!postId) return;
      try {
        const p = await api.getPost(postId);
        if (!alive) return;
        setPost(p as any);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ? String(e.message) : String(e));
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [postId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!postId || !post) return;

    setSaving(true);
    setError(null);

    try {
      const payload: UpdatePostPayload = {
        title: post.title,
        author: post.author,
        content: post.content,
        disciplina: post.disciplina,
      };

      await api.updatePost(postId, payload);
      navigate("/admin");
    } catch (err: any) {
      setError(err?.message || "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Wrapper>
        <Content>
          <TopBar>
            <TitleBlock>
              <Title>Editar Post</Title>
              <Subtitle>Ajuste as informações e salve as alterações.</Subtitle>
            </TitleBlock>

            <Actions>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                ← Voltar
              </SecondaryButton>
            </Actions>
          </TopBar>

          {!post ? (
            <Subtitle>Carregando...</Subtitle>
          ) : (
            <FormCard onSubmit={onSubmit}>
              <CardTitle>Dados do Post</CardTitle>

              <Field>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  required
                  disabled={saving}
                  placeholder="Digite o título..."
                />
              </Field>

              <Field>
                <Label htmlFor="disciplina">Disciplina</Label>
                <Input
                  id="disciplina"
                  value={post.disciplina}
                  onChange={(e) =>
                    setPost({ ...post, disciplina: e.target.value })
                  }
                  required
                  disabled={saving}
                  placeholder="Ex: História"
                />
              </Field>

              <Field>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={post.author}
                  onChange={(e) => setPost({ ...post, author: e.target.value })}
                  required
                  disabled={saving}
                  placeholder="Ex: Prof. João"
                />
              </Field>

              <Field>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  required
                  disabled={saving}
                  placeholder="Escreva o conteúdo da atividade..."
                />
              </Field>

              {error && <ErrorText role="alert">{error}</ErrorText>}

              <FooterBar>
                <PrimaryButton disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </PrimaryButton>
              </FooterBar>
            </FormCard>
          )}
        </Content>
      </Wrapper>
    </Screen>
  );
}