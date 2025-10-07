// src/components/Header.tsx
import styled from "styled-components";
import { useAuth } from "@/modules/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({theme}) => theme.colors.card};
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: .75rem 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
`;

const Left = styled.div`
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  color: ${({theme}) => theme.colors.text};
  font-weight: 600;
  opacity: .9;
  svg { width: 20px; height: 20px; }
`;

const Center = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  font-weight: 800;
  svg { width: 24px; height: 24px; }
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  cursor: pointer;
  &:hover { box-shadow: 0 0 0 3px rgba(59,91,253,.15); }
  svg { width: 18px; height: 18px; }
`;

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <Bar role="navigation" aria-label="barra superior">
      <Inner>
        <Left>
          {/* Ícone perfil */}
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.76 0 5-2.69 5-6s-2.24-5-5-5-5 2.69-5 6 2.24 5 5 5zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/>
          </svg>
          <span>{user?.name ?? "Professor"}</span>
        </Left>

        <Center aria-label="TaskClass">
          {/* Chapéu de formatura */}
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3L1 8l11 5 9-4.09V14h2V8L12 3zM3 13v3c0 .55.45 1 1 1h7v-2H5v-2H3z" />
          </svg>
          <span>TaskClass</span>
        </Center>

        <Right>
          <IconButton onClick={handleLogout} aria-label="Sair">
            {/* Ícone logout */}
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 17l1.41-1.41L8.83 13H21v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 19h6v-2H4V7h6V5H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </IconButton>
        </Right>
      </Inner>
    </Bar>
  );
}
