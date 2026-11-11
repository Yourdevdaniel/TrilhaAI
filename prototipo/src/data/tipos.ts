// Modelo de dados do protótipo. Espelha as classes da documentação (Usuário, Roadmap,
// Etapa, Plano, Atividade, Avaliação), mas tudo vive no navegador.

export type EstadoMarco = 'concluida' | 'atual' | 'futura'
export type StatusRoadmap = 'aprovado' | 'aguardando' | 'rascunho'
export type Modelo = 'frontend' | 'dados' | 'ingles' | 'concurso' | 'generico'
export type IconeRoadmap = 'codigo' | 'conversa' | 'documento' | 'dados' | 'livro'
export type Dia = 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom'

export const diasDaSemana: Dia[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export interface Etapa {
  nome: string
  conteudos: string[]
  /** Quantas atividades a etapa tem no plano inteiro. */
  total: number
  /** Atividades concluídas antes da semana atual (dados de exemplo). */
  feitasAntes: number
}

export interface Roadmap {
  id: string
  nome: string
  objetivo: string
  modelo: Modelo
  status: StatusRoadmap
  icone: IconeRoadmap
  etapas: Etapa[]
  origem?: 'pdf' | 'texto'
  competencias?: string[]
}

export interface Atividade {
  id: string
  dia: Dia
  titulo: string
  etapa: string
  minutos: number
  concluida: boolean
  /** Data ISO (aaaa-mm-dd) em que foi concluída. */
  concluidaEm?: string
  reforco?: boolean
}

export interface Plano {
  roadmapId: string
  horas: number
  prazo: string
  dias: Dia[]
  atividades: Atividade[]
  /** Marcos anteriores à semana atual, só para o histórico. */
  historico?: { data: string; titulo: string; etapa: string }[]
}

export interface Questao {
  conteudo: string
  enunciado: string
  codigo?: string
  opcoes: string[]
  correta: number
  explicacao: string
}

export interface Resultado {
  roadmapId: string
  etapa: string
  geral: number
  porConteudo: { conteudo: string; valor: number }[]
  questoes?: Questao[]
  respostas?: number[]
  data: string
}

export interface Usuario {
  nome: string
  nomeCompleto: string
  email: string
  cpf: string
}

export interface Rascunho {
  objetivo: string
  arquivo: string | null
  texto: string
  conteudos: string[]
  competencias: string[]
}
