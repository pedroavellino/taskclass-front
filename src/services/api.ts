const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://task-class-api-latest.onrender.com";

const JWT_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "fiap.jwt";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(JWT_KEY);

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();

    let message = `HTTP ${res.status}`;
    try {
      const errorJson = JSON.parse(text);
      message = errorJson.message || message;
    } catch {
      message = text || message;
    }

    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

function unwrapList<T = any>(res: any): T[] {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  if (Array.isArray(res?.turmas)) return res.turmas as T[];
  if (Array.isArray(res?.alunos)) return res.alunos as T[];
  if (Array.isArray(res?.presencas)) return res.presencas as T[];
  if (Array.isArray(res?.justificativas)) return res.justificativas as T[];
  return [];
}

function unwrapObject<T = any>(res: any): T {
  if (res?.data && typeof res.data === "object") return res.data as T;
  return res as T;
}

type BackPost = {
  id?: string;
  titulo: string;
  conteudo: string;
  autor: string;
  disciplina: string;
  turma?: string;
  createdAt?: string;
};

export type Post = {
  id: string;
  title: string;
  author: string;
  content: string;
  summary?: string;
  createdAt?: string;
  disciplina?: string;
  turma?: string;
};

function toFront(bp: any): Post {
  return {
    id: String(bp.id ?? bp._id ?? ""),
    title: bp.titulo,
    author: bp.autor,
    content: bp.conteudo,
    createdAt: bp.createdAt,
    disciplina: bp.disciplina,
    turma: bp.turma,
  };
}

function toBack(p: Partial<Post>): BackPost {
  return {
    id: p.id,
    titulo: String(p.title ?? ""),
    autor: String(p.author ?? ""),
    conteudo: String(p.content ?? ""),
    disciplina: String(p.disciplina ?? ""),
    turma: p.turma,
  };
}

/** =========================
 *  TIPOS: CADERNETA
 *  ========================= */

export type Turma = {
  id: string | number;
  nome: string;
  ano: number | string;
  createdAt?: string;
  updatedAt?: string;
};

export type Aluno = {
  id: string | number;
  nome: string;
  matricula: string;
  turmaId: any;
  responsavelId?: string | number;
  createdAt?: string;
  updatedAt?: string;
};

export type PresencaStatus = "Presente" | "Faltou" | "Justificada" | string;

export type Presenca = {
  id: string | number;
  alunoId: string | number | any;
  turmaId: string | number | any;
  data: string;
  status: PresencaStatus;
  observacao?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Justificativa = {
  id: string | number;
  presencaId: string | number;
  alunoId: string | number;
  motivo: string;
  arquivo?: string;
  aprovado?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const api = {
  async login(email: string, senha: string) {
    const data: any = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });

    const token =
      data?.access_token ??
      data?.accessToken ??
      data?.token ??
      data?.jwt ??
      data?.data?.access_token ??
      data?.data?.token;

    if (!token) {
      throw new Error("Login não retornou token (access_token/token).");
    }

    storage.setToken(token);
    return data;
  },

  async getTurmas(): Promise<Turma[]> {
    const res: any = await request("/turmas");
    const list = unwrapList<any>(res);

    return list.map((t: any) => ({
      id: String(t.id ?? t._id ?? ""),
      nome: t.nome,
      ano: t.ano,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  },

  async getTurma(turmaId: string): Promise<Turma> {
    const res: any = await request(`/turmas/${turmaId}`);
    const t: any = unwrapObject<any>(res);

    return {
      id: String(t.id ?? t._id ?? turmaId),
      nome: t.nome,
      ano: t.ano,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  },

  async getAlunos(): Promise<Aluno[]> {
    const res: any = await request("/alunos");
    const list = unwrapList<any>(res);

    return list.map((a: any) => ({
      id: String(a.id ?? a._id ?? ""),
      nome: a.nome,
      matricula: a.matricula,
      turmaId: a.turmaId,
      responsavelId: a.responsavelId,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  },

  async getAlunosPorTurma(turmaId: string): Promise<Aluno[]> {
    const alunos = await this.getAlunos();
    const turmaIdStr = String(turmaId);

    return alunos.filter((a: any) => {
      const t = a?.turmaId;

      if (typeof t === "string" || typeof t === "number") {
        return String(t) === turmaIdStr;
      }

      if (t && typeof t === "object") {
        const idObj = t._id ?? t.id;
        return String(idObj) === turmaIdStr;
      }

      return false;
    });
  },

  /**
   * ✅ Backend real (controller):
   * GET /presencas/turma/:turmaId
   */
  async getPresencasPorTurma(turmaId: string): Promise<Presenca[]> {
    const res: any = await request(
      `/presencas/turma/${encodeURIComponent(turmaId)}`
    );

    const list = unwrapList<any>(res);

    return list.map((p: any) => ({
      id: String(p.id ?? p._id ?? ""),
      alunoId: p.alunoId,
      turmaId: p.turmaId,
      data: String(p.data),
      status: String(p.status ?? ""),
      observacao: p.observacao != null ? String(p.observacao) : undefined,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  },

  /**
   * ✅ Alias para não quebrar chamadas antigas no front:
   * O backend não filtra por data; a tela filtra.
   */
  async getPresencasPorTurmaEData(
    turmaId: string,
    _data: string
  ): Promise<Presenca[]> {
    return this.getPresencasPorTurma(turmaId);
  },

  async salvarPresenca(registro: {
    alunoId: string | number;
    turmaId: string | number;
    data: string;
    status: string;
    observacao?: string;
  }) {
    return request(`/presencas`, {
      method: "POST",
      body: JSON.stringify(registro),
    });
  },

  /**
   * ✅ Backend real (controller):
   * PUT /presencas/:id  body: Partial<IPresenca>
   * Então o payload deve ser objeto (status/observacao/etc).
   */
  async atualizarPresenca(
    presencaId: string,
    payload: Partial<
      Pick<Presenca, "status" | "observacao" | "alunoId" | "turmaId" | "data">
    >
  ) {
    return request(`/presencas/${presencaId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async enviarJustificativa(
    presencaId: string | number,
    alunoId: string | number,
    motivo: string,
    arquivo: File
  ): Promise<Justificativa> {
    const formData = new FormData();
    formData.append("presencaId", String(presencaId));
    formData.append("alunoId", String(alunoId));
    formData.append("motivo", motivo);
    formData.append("arquivo", arquivo);

    const res: any = await request(`/justificativas`, {
      method: "POST",
      body: formData,
    });

    return unwrapObject<Justificativa>(res);
  },

  async listarJustificativas(): Promise<Justificativa[]> {
    const res: any = await request(`/justificativas`);
    return unwrapList<Justificativa>(res);
  },

  async getPosts(q?: string, { limit = 20, page = 1 } = {}) {
    if (q && q.trim()) {
      const res: any = await request(
        `/posts/search?search=${encodeURIComponent(q)}`
      );
      const list = unwrapList<BackPost>(res);
      return list.map(toFront);
    }

    const res: any = await request(`/posts?limit=${limit}&page=${page}`);
    const list = unwrapList<BackPost>(res);
    return list.map(toFront);
  },

  async getPost(id: string) {
    const data: any = await request(`/posts/${id}`);
    return toFront(unwrapObject(data));
  },

  async createPost(post: Partial<Post>) {
    const data: any = await request("/posts", {
      method: "POST",
      body: JSON.stringify(toBack(post)),
    });
    return toFront(unwrapObject(data));
  },

  async updatePost(id: string, post: Partial<Post>) {
    const data: any = await request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(toBack({ ...post, id })),
    });
    return toFront(unwrapObject(data));
  },

  async deletePost(id: string) {
    return request(`/posts/${id}`, { method: "DELETE" });
  },
};

export const storage = {
  get key() {
    return JWT_KEY;
  },
  setToken(token: string) {
    localStorage.setItem(JWT_KEY, token);
  },
  clear() {
    localStorage.removeItem(JWT_KEY);
  },
};