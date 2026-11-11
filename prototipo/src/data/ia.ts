// "IA" simulada: regras simples que imitam o que o serviço de IA devolveria.
// Ela reconhece o tema do objetivo por palavras-chave e monta roadmap, plano,
// avaliação e reforço a partir de modelos prontos.

import type { Atividade, Dia, Etapa, IconeRoadmap, Modelo, Questao, Rascunho, Roadmap } from './tipos'
import { bancoDeQuestoes } from './questoes'

interface ModeloRoadmap {
  nome: string
  icone: IconeRoadmap
  etapas: [string, string[]][]
  extracao: { conteudos: string[]; competencias: string[] }
}

const modelos: Record<Modelo, ModeloRoadmap> = {
  frontend: {
    nome: 'Desenvolvedor Front-end',
    icone: 'codigo',
    etapas: [
      ['Fundamentos', ['HTML semântico', 'CSS Flexbox e Grid', 'Git básico']],
      ['JavaScript', ['Funções e escopo', 'Manipulação do DOM', 'APIs REST']],
      ['React', ['Componentes', 'Estado e props', 'Rotas']],
      ['Projeto final', ['Portfólio', 'Deploy', 'Revisão de código']],
    ],
    extracao: {
      conteudos: ['HTML semântico', 'CSS Flexbox e Grid', 'JavaScript', 'React', 'Git', 'Testes automatizados'],
      competencias: ['Trabalho em equipe', 'Versionamento', 'Consumo de APIs REST'],
    },
  },
  dados: {
    nome: 'Análise de dados com Python',
    icone: 'dados',
    etapas: [
      ['Python básico', ['Variáveis e tipos', 'Listas e dicionários', 'Funções']],
      ['Pandas', ['DataFrames', 'Limpeza de dados', 'Agrupamentos']],
      ['Visualização', ['Matplotlib', 'Gráfico certo para cada dado', 'Dashboards']],
      ['Projeto', ['Coleta de dados', 'Análise exploratória', 'Apresentação']],
    ],
    extracao: {
      conteudos: ['Python', 'Pandas', 'SQL', 'Power BI', 'Estatística descritiva'],
      competencias: ['Comunicação de resultados', 'Pensamento analítico', 'Trabalho com bases grandes'],
    },
  },
  ingles: {
    nome: 'Inglês para entrevistas',
    icone: 'conversa',
    etapas: [
      ['Comunicação', ['Apresentação pessoal', 'Small talk', 'Pronúncia']],
      ['Vocabulário', ['Termos técnicos', 'Verbos de ação', 'Expressões comuns']],
      ['Entrevistas', ['Perguntas comportamentais', 'Método STAR', 'Perguntas técnicas']],
      ['Prática', ['Simulações', 'Feedback', 'Revisão final']],
    ],
    extracao: {
      conteudos: ['Conversação', 'Vocabulário técnico', 'Escrita de e-mails', 'Apresentações'],
      competencias: ['Inglês intermediário', 'Comunicação com times globais'],
    },
  },
  concurso: {
    nome: 'Preparação para concurso',
    icone: 'documento',
    etapas: [
      ['Língua Portuguesa', ['Interpretação de texto', 'Concordância', 'Pontuação']],
      ['Matemática', ['Porcentagem', 'Juros simples e compostos', 'Razão e proporção']],
      ['Conhecimentos Bancários', ['Sistema Financeiro Nacional', 'Produtos bancários', 'Atendimento']],
      ['Informática', ['Planilhas', 'Segurança da informação', 'Internet e e-mail']],
      ['Revisão', ['Simulados', 'Questões anteriores', 'Revisão final']],
    ],
    extracao: {
      conteudos: ['Língua Portuguesa', 'Matemática Financeira', 'Conhecimentos Bancários', 'Informática', 'Atualidades do mercado financeiro'],
      competencias: ['Vendas e negociação', 'Ética e conduta'],
    },
  },
  generico: {
    nome: '',
    icone: 'livro',
    etapas: [
      ['Fundamentos', ['Conceitos básicos', 'Vocabulário da área', 'Primeiros exercícios']],
      ['Prática guiada', ['Exercícios por tema', 'Estudo de casos', 'Erros comuns']],
      ['Aprofundamento', ['Tópicos avançados', 'Boas práticas', 'Referências da área']],
      ['Projeto', ['Planejamento', 'Execução', 'Apresentação']],
    ],
    extracao: {
      conteudos: ['Conceitos fundamentais', 'Prática aplicada', 'Estudo de casos'],
      competencias: ['Organização', 'Aprendizado contínuo'],
    },
  },
}

const sem = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Reconhece o tema do objetivo (e do material de apoio) por palavras-chave. */
export function detectarModelo(...textos: (string | null | undefined)[]): Modelo {
  const t = sem(textos.filter(Boolean).join(' '))
  if (/concurso|edital|banco do brasil|caixa economica|\bprova\b|cargo publico/.test(t)) return 'concurso'
  if (/front|react|javascript|html|css|\bweb\b|site/.test(t)) return 'frontend'
  if (/dados|python|analis|\bdata\b|\bsql\b|power ?bi|planilha/.test(t)) return 'dados'
  if (/ingles|english|idioma|entrevista em/.test(t)) return 'ingles'
  return 'generico'
}

/** UC03.3: o que a IA "extraiu" do PDF ou do texto colado. */
export function extrair(r: Pick<Rascunho, 'objetivo' | 'arquivo' | 'texto'>) {
  const m = modelos[detectarModelo(r.objetivo, r.arquivo, r.texto)]
  return { conteudos: [...m.extracao.conteudos], competencias: [...m.extracao.competencias] }
}

function nomeDoObjetivo(objetivo: string) {
  const limpo = objetivo
    .replace(/^(quero|eu quero|preciso|gostaria de|meu objetivo e|meu objetivo é)\s+/i, '')
    .replace(/\s+(em|ate|até)\s+\d+.*$/i, '')
    .replace(/[.!]+$/, '')
    .trim()
  const curto = limpo.length > 42 ? `${limpo.slice(0, 40).trim()}…` : limpo
  return curto ? curto[0].toUpperCase() + curto.slice(1) : 'Meu novo objetivo'
}

/** UC04.1: a IA sugere um roadmap a partir do objetivo e do que foi confirmado na revisão. */
export function sugerirRoadmap(r: Rascunho): Omit<Roadmap, 'id'> {
  const modelo = detectarModelo(r.objetivo, r.arquivo, r.texto)
  const m = modelos[modelo]
  const etapas: Etapa[] = m.etapas.map(([nome, conteudos]) => ({ nome, conteudos: [...conteudos], total: conteudos.length, feitasAntes: 0 }))

  // Conteúdos do documento que o modelo não cobre viram uma etapa própria antes da última
  const cobertos = etapas.flatMap((e) => [e.nome, ...e.conteudos]).map(sem)
  const novos = r.conteudos.filter((c) => !cobertos.some((x) => x.includes(sem(c)) || sem(c).includes(x))).slice(0, 4)
  if (novos.length) etapas.splice(etapas.length - 1, 0, { nome: 'Do documento', conteudos: novos, total: novos.length, feitasAntes: 0 })

  let nome = m.nome || nomeDoObjetivo(r.objetivo)
  if (modelo === 'concurso' && /banco do brasil/.test(sem(`${r.objetivo} ${r.arquivo ?? ''} ${r.texto}`))) nome = 'Concurso Banco do Brasil'

  return {
    nome,
    objetivo: r.objetivo.trim(),
    modelo,
    status: 'aguardando',
    icone: m.icone,
    etapas,
    origem: r.arquivo ? 'pdf' : r.texto.trim() ? 'texto' : undefined,
    competencias: r.arquivo || r.texto.trim() ? r.competencias : undefined,
  }
}

/** Tempo estimado do roadmap inteiro, em horas (cada atividade ≈ 1h30). */
export const cargaHoras = (r: Roadmap) => r.etapas.reduce((s, e) => s + e.total, 0) * 1.5

/**
 * UC05.1: distribui as próximas atividades do roadmap pelos dias escolhidos.
 * A semana recebe uma atividade por dia, na ordem das etapas.
 */
export function montarSemana(r: Roadmap, horas: number, dias: Dia[], jaPlanejados: string[] = []): Atividade[] {
  const ordem = [...dias].sort((a, b) => ordemDia(a) - ordemDia(b))
  const minutos = Math.max(20, Math.round((horas * 60) / ordem.length / 5) * 5)
  const fila = r.etapas
    .flatMap((e) => e.conteudos.slice(e.feitasAntes).map((c) => ({ titulo: c, etapa: e.nome })))
    .filter((a) => !jaPlanejados.includes(a.titulo))
  return ordem.slice(0, fila.length).map((dia, i) => ({
    id: `${r.id}-${i}-${Date.now().toString(36)}`,
    dia,
    titulo: fila[i].titulo,
    etapa: fila[i].etapa,
    minutos,
    concluida: false,
  }))
}

export const ordemDia = (d: Dia) => ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].indexOf(d)

/** UC07.1: questões da etapa. Usa o banco do tema ou monta questões gerais sobre os conteúdos. */
export function gerarQuestoes(r: Roadmap, etapa: Etapa): Questao[] {
  const banco = bancoDeQuestoes[`${r.modelo}:${etapa.nome}`]
  if (banco) return banco
  return etapa.conteudos.flatMap((c) => [
    {
      conteudo: c,
      enunciado: `Qual é o melhor primeiro passo para estudar "${c}"?`,
      opcoes: ['Ler tudo de uma vez, sem pausa', 'Entender o conceito básico e praticar com um exemplo', 'Pular direto para a parte avançada', 'Decorar definições sem praticar'],
      correta: 1,
      explicacao: 'Conceito + prática curta fixam melhor do que leitura longa ou decoreba.',
    },
    {
      conteudo: c,
      enunciado: `Como saber se você já domina "${c}"?`,
      opcoes: ['Quando consegue explicar e aplicar sem consultar', 'Quando leu o material uma vez', 'Quando assistiu a um vídeo sobre o tema', 'Quando marcou a atividade como concluída'],
      correta: 0,
      explicacao: 'Domínio é conseguir explicar e aplicar sozinho; marcar como concluído não basta.',
    },
  ])
}

/** UC07.3: correção e aproveitamento por conteúdo. */
export function corrigir(questoes: Questao[], respostas: number[]) {
  const conteudos = [...new Set(questoes.map((q) => q.conteudo))]
  const porConteudo = conteudos.map((conteudo) => {
    const qs = questoes.map((q, i) => ({ q, i })).filter(({ q }) => q.conteudo === conteudo)
    const certas = qs.filter(({ q, i }) => respostas[i] === q.correta).length
    return { conteudo, valor: Math.round((certas / qs.length) * 100) }
  })
  const geral = Math.round((questoes.filter((q, i) => respostas[i] === q.correta).length / questoes.length) * 100)
  return { geral, porConteudo }
}

/** UC08.2 e UC08.3: roteiro de revisão e materiais sugeridos para um conteúdo. */
export function reforcoPara(conteudo: string) {
  return {
    revisao: `Revise "${conteudo}": refaça as questões que errou, explique o conceito com suas palavras e resolva 3 exercícios curtos.`,
    materiais: [
      { tipo: 'Artigo' as const, titulo: `Guia prático: ${conteudo}` },
      { tipo: 'Vídeo' as const, titulo: `${conteudo} em 15 minutos` },
      { tipo: 'Exercícios' as const, titulo: `Lista comentada de ${conteudo}` },
    ],
  }
}
