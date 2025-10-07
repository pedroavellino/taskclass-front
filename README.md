# FIAP Tech Challenge — Front-end (React + Vite)

Interface web para a aplicação de blogging do Tech Challenge (Fase 3 — Front-end).

## ✨ Stack
- React 18 + Vite (SWC)
- React Router v6
- styled-components
- TypeScript
- Fetch API (wrapper simples)
- Auth via JWT (contexto de autenticação)
- Docker (Nginx) + GitHub Actions (CI)

## 📁 Estrutura
```
src/
  components/          # Header, PostCard, SearchBar, ProtectedRoute
  modules/
    auth/              # AuthContext e Login
    posts/pages/       # Home, PostRead, PostCreate, PostEdit, Admin
  services/            # api.ts (HTTP)
  styles/              # tema e GlobalStyle
  types/               # tipos TS compartilhados
  App.tsx, main.tsx
```

## 🔧 Configuração
1) Node 20+
2) Copie `.env.example` para `.env` e configure:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_JWT_STORAGE_KEY=fiap.jwt
```
3) Instale deps e rode:
```
npm i
npm run dev
```
Acesse http://localhost:5173

## 🔐 Autenticação & Autorização
- `POST /auth/login` → `{ token, user }`
- O token é salvo em `localStorage` e incluído via `Authorization: Bearer ...`.
- Rotas protegidas: `/create`, `/edit/:id`, `/admin` (usam `<ProtectedRoute/>`).

## 🌐 Endpoints esperados do back-end
- `GET /posts?q=...` → lista
- `GET /posts/:id` → detalhe
- `POST /posts` → cria (autenticado)
- `PUT /posts/:id` → atualiza (autenticado)
- `DELETE /posts/:id` → exclui (autenticado)

> Adeque se seus endpoints diferirem.

## ♿ Acessibilidade
- Labels conectadas aos inputs.
- `role="alert"` para mensagens de erro.
- Contraste alto e navegação por teclado.

## 📱 Responsividade
- Grid fluido em `Home` (cards responsivos).
- Formulários com largura máxima e padding adequado.

## 🧪 Dicas de testes
- Prefira React Testing Library.
- Casos principais: login, filtro de busca, criação/edição/remoção de posts.

## 🐳 Docker
Build de produção:
```
npm run build
docker build -t fiap-blog-frontend:prod .
docker run -it --rm -p 8080:80 fiap-blog-frontend:prod
```
Acesse http://localhost:8080

## 🚀 CI/CD (GitHub Actions)
- Workflow: instala deps com cache, roda build e (opcional) builda imagem Docker.

## 📹 Apresentação (roteiro sugerido)
1) Objetivo e requisitos.
2) Arquitetura do front e rotas.
3) Demonstração: listar, ler, buscar, login, criar/editar/excluir, admin.
4) Acessibilidade e responsividade.
5) Decisões técnicas, aprendizados e próximos passos.

---

Feito para acelerar a etapa 3 do Tech Challenge. Ajuste à realidade do seu back-end e às regras da sua equipe.
