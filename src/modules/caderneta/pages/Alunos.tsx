import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api, type Aluno, type Turma } from "@/services/api";

const Screen = styled.div`
  min-height: calc(100dvh - 64px);
  background: ${({ theme }) => theme.colors.bg};
`;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: grid;
  gap: 1rem;
`;

const HeaderRow = styled.div`
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

const Card = styled.div`
  padding: 1rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Select = styled.select`
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
  }

  th {
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 900;
    font-size: 0.8rem;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
`;

const InfoLine = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;


const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
`;

const Modal = styled.div`
  width: min(720px, 100%);
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1rem;
  display: grid;
  gap: 0.9rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;

  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Section = styled.div`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 900;
  font-size: 0.82rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-top: 0.25rem;
`;

const Field = styled.div`
  display: grid;
  gap: 0.35rem;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 700;
  }

  input,
  select {
    width: 100%;
    padding: 0.85rem 0.95rem;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    outline: none;
  }
`;

function getTurmaIdOfAluno(a: any): string | null {
  const t = a?.turmaId;
  if (!t) return null;
  if (typeof t === "string" || typeof t === "number") return String(t);
  if (typeof t === "object") return String(t._id ?? t.id ?? "");
  return null;
}

function getTurmaLabel(t: any): string {
  if (!t) return "—";
  const nome = t.nome ?? "";
  const ano = t.ano ?? "";
  return `${nome}${ano ? ` (${ano})` : ""}`;
}

function isValidEmail(value: string) {
  const email = value.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function Alunos() {
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmaFilter, setTurmaFilter] = useState<string>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openNew, setOpenNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [matricula, setMatricula] = useState("");
  const [turmaId, setTurmaId] = useState<string>("");

  const [alunoNome, setAlunoNome] = useState("");
  const [alunoEmail, setAlunoEmail] = useState("");
  const [alunoSenha, setAlunoSenha] = useState("");

  const [respNome, setRespNome] = useState("");
  const [respEmail, setRespEmail] = useState("");
  const [respSenha, setRespSenha] = useState("");

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [turmasBack, alunosBack] = await Promise.all([
        api.getTurmas({ limit: 50, page: 1 }),
        api.getAlunos(),
      ]);
      setTurmas(turmasBack);
      setAlunos(alunosBack);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!alive) return;
      await loadAll();
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (turmaFilter === "ALL") return alunos;

    return alunos.filter((a: any) => {
      const id = getTurmaIdOfAluno(a);
      return id === turmaFilter;
    });
  }, [alunos, turmaFilter]);

  function resetModal() {
    setMatricula("");
    setTurmaId("");

    setAlunoNome("");
    setAlunoEmail("");
    setAlunoSenha("");

    setRespNome("");
    setRespEmail("");
    setRespSenha("");

    setModalError(null);
    setSaving(false);
  }

  function openModal() {
    resetModal();
    // se já estiver filtrando por uma turma, pré-seleciona
    if (turmaFilter !== "ALL") setTurmaId(turmaFilter);
    setOpenNew(true);
  }

  async function handleCreateAluno() {
    // validações mínimas
    if (!matricula.trim()) return setModalError("Informe a matrícula.");
    if (!turmaId) return setModalError("Selecione a turma.");

    if (!alunoNome.trim()) return setModalError("Informe o nome do aluno.");
    if (!isValidEmail(alunoEmail)) return setModalError("Informe um e-mail válido do aluno.");
    if (alunoSenha.trim().length < 4) return setModalError("A senha do aluno deve ter pelo menos 4 caracteres.");

    if (!respNome.trim()) return setModalError("Informe o nome do responsável.");
    if (!isValidEmail(respEmail)) return setModalError("Informe um e-mail válido do responsável.");
    if (respSenha.trim().length < 4) return setModalError("A senha do responsável deve ter pelo menos 4 caracteres.");

    setSaving(true);
    setModalError(null);

    try {
      const alunoUser: any = await api.createUser({
        nome: alunoNome.trim(),
        email: alunoEmail.trim(),
        senha: alunoSenha,
        role: "aluno",
      });
      const alunoUserId = String(alunoUser?._id ?? alunoUser?.id ?? "");

      if (!alunoUserId) throw new Error("Não foi possível obter o id do usuário do aluno.");

      const respUser: any = await api.createUser({
        nome: respNome.trim(),
        email: respEmail.trim(),
        senha: respSenha,
        role: "responsavel",
      });
      const respUserId = String(respUser?._id ?? respUser?.id ?? "");
      if (!respUserId) throw new Error("Não foi possível obter o id do usuário do responsável.");

      await api.createAluno({
        userId: alunoUserId,
        responsavelId: respUserId,
        matricula: matricula.trim(),
        turmaId,
      });

      setOpenNew(false);
      await loadAll();
    } catch (e: any) {
      setModalError(e?.message ?? "Erro ao criar aluno");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Wrapper>
        <HeaderRow>
          <TitleBlock>
            <Title>Gerenciar Alunos</Title>
            <Subtitle>Filtre por turma e cadastre novos alunos.</Subtitle>
          </TitleBlock>

          <Actions>
            <SecondaryButton type="button" onClick={() => navigate("/turmas")}>
              ← Voltar para Turmas
            </SecondaryButton>

            <PrimaryButton type="button" onClick={openModal}>
              + Novo Aluno
            </PrimaryButton>
          </Actions>
        </HeaderRow>

        <Card>
          <Row>
            <InfoLine>Filtro</InfoLine>
            <Select value={turmaFilter} onChange={(e) => setTurmaFilter(e.target.value)}>
              <option value="ALL">Todas as turmas</option>
              {turmas.map((t: any) => (
                <option key={String(t.id)} value={String(t.id)}>
                  {t.nome} ({t.ano})
                </option>
              ))}
            </Select>
          </Row>
        </Card>

        <Card>
          {loading && <InfoLine>Carregando alunos…</InfoLine>}
          {!loading && error && <InfoLine>{error}</InfoLine>}
          {!loading && !error && filtered.length === 0 && <InfoLine>Nenhum aluno encontrado.</InfoLine>}

          {!loading && !error && filtered.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Turma</th>
                  <th>Responsável</th>
                  <th>Conta do aluno</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a: any) => (
                  <tr key={String(a.id)}>
                    <td>{a.matricula}</td>
                    <td>{getTurmaLabel(a.turmaId)}</td>
                    <td>{String(a.responsavelId ?? "—")}</td>
                    <td>{String(a.userId ?? "—")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {openNew && (
          <Backdrop onClick={() => !saving && setOpenNew(false)}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Novo Aluno</ModalTitle>

              {modalError && <InfoLine style={{ color: "#FF5A5F", fontWeight: 900 }}>{modalError}</InfoLine>}

              <FormGrid>
                <Section>Dados do aluno</Section>

                <Field>
                  <label>Matrícula</label>
                  <input value={matricula} onChange={(e) => setMatricula(e.target.value)} disabled={saving} />
                </Field>

                <Field>
                  <label>Turma</label>
                  <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} disabled={saving}>
                    <option value="">Selecione…</option>
                    {turmas.map((t) => (
                      <option key={String(t.id)} value={String(t.id)}>
                        {t.nome} ({t.ano})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <label>Nome do aluno</label>
                  <input value={alunoNome} onChange={(e) => setAlunoNome(e.target.value)} disabled={saving} />
                </Field>

                <Field>
                  <label>E-mail do aluno</label>
                  <input
                    value={alunoEmail}
                    onChange={(e) => setAlunoEmail(e.target.value)}
                    disabled={saving}
                    placeholder="aluno@escola.com"
                  />
                </Field>

                <Field>
                  <label>Senha do aluno</label>
                  <input
                    value={alunoSenha}
                    onChange={(e) => setAlunoSenha(e.target.value)}
                    disabled={saving}
                    placeholder="mínimo 4 caracteres"
                    type="password"
                  />
                </Field>

                <div />

                <Section>Dados do responsável</Section>

                <Field>
                  <label>Nome do responsável</label>
                  <input value={respNome} onChange={(e) => setRespNome(e.target.value)} disabled={saving} />
                </Field>

                <Field>
                  <label>E-mail do responsável</label>
                  <input
                    value={respEmail}
                    onChange={(e) => setRespEmail(e.target.value)}
                    disabled={saving}
                    placeholder="responsavel@familia.com"
                  />
                </Field>

                <Field>
                  <label>Senha do responsável</label>
                  <input
                    value={respSenha}
                    onChange={(e) => setRespSenha(e.target.value)}
                    disabled={saving}
                    placeholder="mínimo 4 caracteres"
                    type="password"
                  />
                </Field>
              </FormGrid>

              <Actions style={{ justifyContent: "flex-end" }}>
                <SecondaryButton type="button" onClick={() => setOpenNew(false)} disabled={saving}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="button" onClick={handleCreateAluno} disabled={saving}>
                  {saving ? "Salvando…" : "Criar"}
                </PrimaryButton>
              </Actions>
            </Modal>
          </Backdrop>
        )}
      </Wrapper>
    </Screen>
  );
}