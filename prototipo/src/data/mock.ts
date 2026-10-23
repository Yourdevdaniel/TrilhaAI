// Dados de exemplo do protótipo. Não há backend: tudo vive em memória.
// Persona e números seguem as telas de referência (Ana, Desenvolvedor Front-end).

export type EstadoMarco = 'concluida' | 'atual' | 'futura'

export interface Etapa {
  nome: string
  estado: EstadoMarco
  progresso: number
  conteudos: string[]
}

export type StatusRoadmap = 'aprovado' | 'aguardando' | 'rascunho'

export interface RoadmapResumo {
  id: string
  nome: string
  status: StatusRoadmap
  icone: 'codigo' | 'conversa' | 'documento'
  etapas: Etapa[]
  origemEdital?: boolean
}

export interface Atividade {
  id: string
  dia: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom'
  titulo: string
  etapa: string
  minutos: number
  concluida: boolean
  concluidaEm?: string
  reforco?: boolean
}

export const usuario = {
  nome: 'Ana',
  nomeCompleto: 'Ana Souza',
  email: 'ana@email.com',
  cpfMascarado: '***.456.789-**',
  meta: 'Desenvolvedor Front-end',
}

// CPF que já existe na base fictícia, para demonstrar a exceção do UC01.1.
export const cpfJaCadastrado = '123.456.789-00'

const etapasFrontEnd: Etapa[] = [
  { nome: 'Fundamentos', estado: 'concluida', progresso: 100, conteudos: ['HTML semântico', 'CSS Flexbox e Grid', 'Git básico'] },
  { nome: 'JavaScript', estado: 'atual', progresso: 62, conteudos: ['Funções e escopo', 'Manipulação do DOM', 'APIs REST'] },
  { nome: 'React', estado: 'futura', progresso: 0, conteudos: ['Componentes', 'Estado e props', 'Rotas'] },
  { nome: 'Projeto final', estado: 'futura', progresso: 0, conteudos: ['Portfólio', 'Deploy', 'Revisão de código'] },
]

export const roadmaps: RoadmapResumo[] = [
  { id: 'front-end', nome: 'Desenvolvedor Front-end', status: 'aprovado', icone: 'codigo', etapas: etapasFrontEnd },
  {
    id: 'ingles',
    nome: 'Inglês para entrevistas',
    status: 'aguardando',
    icone: 'conversa',
    etapas: ['Comunicação', 'Vocabulário', 'Entrevistas', 'Prática', 'Revisão'].map((nome) => ({ nome, estado: 'futura', progresso: 0, conteudos: [] })),
  },
  {
    id: 'concurso-bb',
    nome: 'Concurso Banco do Brasil 2027',
    status: 'rascunho',
    icone: 'documento',
    origemEdital: true,
    etapas: ['Língua Portuguesa', 'Matemática', 'Conhecimentos Bancários', 'Informática', 'Revisão'].map((nome) => ({ nome, estado: 'futura', progresso: 0, conteudos: [] })),
  },
]

// Roadmap recém-gerado pela IA (tela 07): ainda sem aprovação, logo sem progresso.
export const roadmapGerado: RoadmapResumo = {
  id: 'novo',
  nome: 'Desenvolvedor Front-end',
  status: 'aguardando',
  icone: 'codigo',
  etapas: etapasFrontEnd.map((e) => ({ ...e, estado: 'futura', progresso: 0 })),
}

export const progressoGeral = 38

// Semana de 19 a 25 de outubro de 2026 (segunda a domingo).
export const semana = { rotulo: '19 a 25 de outubro', metaMinutos: 360 }

export const atividadesIniciais: Atividade[] = [
  { id: 'a1', dia: 'Seg', titulo: 'Funções e escopo', etapa: 'JavaScript', minutos: 35, concluida: true, concluidaEm: '19/10' },
  { id: 'a2', dia: 'Seg', titulo: 'Exercício: manipulação do DOM', etapa: 'JavaScript', minutos: 45, concluida: true, concluidaEm: '19/10' },
  { id: 'a3', dia: 'Qua', titulo: 'Eventos no navegador', etapa: 'JavaScript', minutos: 60, concluida: true, concluidaEm: '21/10' },
  { id: 'a4', dia: 'Sex', titulo: 'Consumindo APIs com fetch', etapa: 'JavaScript', minutos: 90, concluida: false },
  { id: 'a5', dia: 'Sáb', titulo: 'Revisão: CSS Grid', etapa: 'Fundamentos', minutos: 70, concluida: false, reforco: true },
]

export const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const

// Entradas antigas do histórico, anteriores à semana atual.
export const historicoAnterior = [{ data: '18/10', titulo: 'Etapa Fundamentos concluída', etapa: 'Fundamentos', marco: true }]

export const ultimoResultado = { conteudo: 'CSS Grid', aproveitamento: 68 }

export const extracaoInicial = {
  arquivo: 'Vaga Front-end Júnior.pdf',
  conteudos: ['HTML semântico', 'CSS Flexbox e Grid', 'JavaScript', 'React', 'Git'],
  competencias: ['Trabalho em equipe', 'Versionamento', 'Consumo de APIs REST'],
}

export interface Questao {
  enunciado: string
  codigo?: string
  opcoes: string[]
}

// Avaliação gerada pela IA sobre JavaScript (tela 11).
export const questoes: Questao[] = [
  { enunciado: 'Qual palavra-chave declara uma variável que não pode ser reatribuída?', opcoes: ['const', 'let', 'var', 'static'] },
  { enunciado: 'O que typeof [] retorna?', opcoes: ['"object"', '"array"', '"list"', '"undefined"'] },
  {
    enunciado: 'O que é exibido no console?',
    codigo: 'let x = 1;\nfunction f() { let x = 2; return x; }\nconsole.log(f(), x);',
    opcoes: ['2 1', '2 2', '1 1', 'undefined 1'],
  },
  { enunciado: 'Qual método seleciona o primeiro elemento que casa com um seletor CSS?', opcoes: ['querySelector', 'getElementsByClassName', 'querySelectorAll', 'getElementById'] },
  { enunciado: 'Qual evento dispara quando o usuário clica em um botão?', opcoes: ['click', 'change', 'submit', 'input'] },
  { enunciado: 'O que fetch() retorna?', opcoes: ['Uma Promise', 'Um objeto JSON', 'Uma string', 'Um array'] },
  { enunciado: 'Como ler o corpo JSON de uma resposta do fetch?', opcoes: ['await resposta.json()', 'resposta.body', 'JSON(resposta)', 'resposta.text'] },
  { enunciado: 'Qual código de status HTTP indica sucesso?', opcoes: ['200', '301', '404', '500'] },
  { enunciado: 'O que uma arrow function não tem?', opcoes: ['this próprio', 'Parâmetros', 'Retorno', 'Corpo'] },
  { enunciado: 'Qual operador compara valor e tipo?', opcoes: ['===', '==', '=', '!='] },
]

// Resultado da avaliação de JavaScript (tela 12).
export const resultado = {
  avaliacao: 'JavaScript',
  geral: 74,
  porConteudo: [
    { conteudo: 'Funções e escopo', valor: 90 },
    { conteudo: 'Manipulação do DOM', valor: 80 },
    { conteudo: 'APIs REST', valor: 55 },
  ],
  reforco: {
    conteudo: 'APIs REST',
    revisao: 'Revise: requisições com fetch e tratamento de erros.',
    materiais: [
      { tipo: 'Artigo', titulo: 'Usando fetch na prática' },
      { tipo: 'Vídeo', titulo: 'Promises e async/await' },
      { tipo: 'Documentação', titulo: 'MDN: Fetch API' },
    ],
  },
}

export const proficienciaMinima = 70
