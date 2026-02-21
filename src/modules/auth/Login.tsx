import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Screen = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.bg};
  padding: 2rem;
`;

const Card = styled.form`
  width: min(520px, 100%);
  display: grid;
  gap: 1rem;
  padding: 1.35rem 1.35rem 0.9rem;
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
`;

const Header = styled.div`
  display: grid;
  place-items: center;
  gap: 0.4rem;
  padding-top: 0.25rem;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 800;
    letter-spacing: 0.2px;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.92rem;
  }
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme }) => theme.colors.text};
  }

  strong {
    font-weight: 900;
  }
`;

const FieldBlock = styled.div`
  display: grid;
  gap: 0.35rem;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 700;
  }

  input {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    outline: none;
  }

  input::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.8;
  }

  input:focus {
    border-color: ${({ theme }) => theme.colors.ring};
    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.22);
  }
`;

const Button = styled.button`
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card2};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  cursor: pointer;
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0.6rem 0 0.25rem;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  padding: 0.35rem 0.25rem 0.8rem;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.9;
  }
`;

export function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return

    const nextByRole: Record<string, string> = {
      coordenacao: '/turmas',
      professor: '/turmas',
      responsavel: '/painel-pai',
      aluno: '/',
    }

    navigate(nextByRole[user.role] ?? '/', { replace: true })
  }, [user, navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch {
      setError("Seu e-mail e/ou senha estão errados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Card onSubmit={onSubmit} aria-describedby={error ? "login-err" : undefined}>
        <Header>
          <Brand>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3L1 8l11 5 9-4.09V14h2V8L12 3zM3 13v3c0 .55.45 1 1 1h7v-2H5v-2H3z" />
            </svg>
            <strong>TaskClass</strong>
          </Brand>
          <h1>Bem-vindo de volta</h1>
          <p>Faça login para acessar a caderneta digital.</p>
        </Header>

        <div style={{ display: "grid", gap: "0.75rem", marginTop: ".25rem" }}>
          <FieldBlock>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="professor@escola.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </FieldBlock>

          <FieldBlock>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </FieldBlock>

          {error && (
            <p
              id="login-err"
              role="alert"
              style={{
                color: "#FF5A5F",
                margin: "0.25rem 0 0",
                fontWeight: 700,
              }}
            >
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </div>

        <Divider />

        <Footer aria-label="descrição da plataforma">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 2H8a2 2 0 00-2 2v16a2 2 0 012-2h10v2h2V4a2 2 0 00-2-2zm0 14H8a.99.99 0 00-1 .99V4a1 1 0 011-1h10v13z" />
          </svg>
          <span>Plataforma para gestão de atividades educacionais</span>
        </Footer>
      </Card>
    </Screen>
  );
}