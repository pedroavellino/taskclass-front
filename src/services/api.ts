const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://task-class-api-latest.onrender.com'
const JWT_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'fiap.jwt'

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(JWT_KEY)
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const text = await res.text()
    try {
      const errorJson = JSON.parse(text)
      throw new Error(errorJson.message || `Erro ${res.status}`)
    } catch {
      throw new Error(text || `HTTP ${res.status}`)
    }
  }

  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

type BackPost = {
  id?: string
  disciplina: string
  turma?: string
  titulo: string
  conteudo: string
  autor: string
  createdAt?: string
}

export type Post = {
  id: string
  title: string
  author: string
  content: string
  summary?: string
  createdAt?: string
  disciplina?: string
  turma?: string
}

function toFront(bp: any) {
  return {
    id: String(bp.id ?? bp._id ?? ''),
    title: bp.titulo,
    author: bp.autor,
    content: bp.conteudo,
    createdAt: bp.createdAt,
    disciplina: bp.disciplina,
    turma: bp.turma,
  }
}

function toBack(p: Partial<Post>): BackPost {
  return {
    id: p.id,
    titulo: String(p.title ?? ''),
    autor: String(p.author ?? ''),
    conteudo: String(p.content ?? ''),
    disciplina: String(p.disciplina ?? ''),
    turma: p.turma,
  }
}


export const api = {
  async login(email: string, senha: string) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    })
    storage.setToken(data.access_token)
    return data
  },

  async getPosts(q?: string, { limit = 20, page = 1 } = {}) {
    if (q && q.trim()) {
      const data: BackPost[] = await request(`/posts/search?search=${encodeURIComponent(q)}`)
      return data.map(toFront)
    }
    const data: BackPost[] = await request(`/posts?limit=${limit}&page=${page}`)
    return data.map(toFront)
  },

  async getPost(id: string) {
    const data: BackPost = await request(`/posts/${id}`)
    return toFront(data)
  },

  async createPost(post: Partial<Post>) {
    const data: BackPost = await request('/posts', {
      method: 'POST',
      body: JSON.stringify(toBack(post)),
    })
    return toFront(data)
  },

  async updatePost(id: string, post: Partial<Post>) {
    const data: BackPost = await request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toBack({ ...post, id })),
    })
    return toFront(data)
  },

  async deletePost(id: string) {
    return request(`/posts/${id}`, { method: 'DELETE' })
  },

  async getAlunosPorTurma(turmaId: string) {
    return request(`/alunos?turmaId=${turmaId}`)
  },

  async getPresencas(turmaId: string, data: string) {
    return request(`/presencas?turmaId=${turmaId}&data=${data}`)
  },

  async salvarPresenca(registro: {
    alunoId: string
    turmaId: string
    data: string
    status: string
  }) {
    return request(`/presencas`, {
      method: 'POST',
      body: JSON.stringify(registro),
    })
  },
  async atualizarPresenca(presencaId: string, status: string, observacao?: string) {
    return request(`/presencas/${presencaId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, observacao }),
    })
  },

  async enviarJustificativa(presencaId: string, alunoId: string, motivo: string, arquivo: File) {

    const formData = new FormData();
    formData.append("presencaId", presencaId);
    formData.append("alunoId", alunoId);
    formData.append("motivo", motivo);
    formData.append("arquivo", arquivo);

    const token = localStorage.getItem("sua_chave_de_token_aqui");

    return fetch(`https://task-class-api-latest.onrender.com/justificativas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
}

export const storage = {
  get key() { return JWT_KEY },
  setToken(token: string) { localStorage.setItem(JWT_KEY, token) },
  clear() { localStorage.removeItem(JWT_KEY) },
}

