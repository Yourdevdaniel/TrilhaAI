// Conta de demonstração (Ana). Datas relativas a hoje, para a demo nunca parecer velha.
import { diasAtras } from '../state/calculos'
import { sugerirRoadmap } from './ia'
import type { Plano, Resultado, Roadmap, Usuario } from './tipos'

export const EMAIL_DEMO = 'ana@email.com'
// CPF que já existe na base fictícia, para demonstrar a exceção do UC01.1.
export const CPF_JA_CADASTRADO = '123.456.789-00'

export const usuarioDemo: Usuario = { nome: 'Ana', nomeCompleto: 'Ana Souza', email: EMAIL_DEMO, cpf: CPF_JA_CADASTRADO }

const vazio = { arquivo: null, texto: '', conteudos: [], competencias: [] }

function roadmapsDemo(): Roadmap[] {
  const front = sugerirRoadmap({ ...vazio, objetivo: 'Quero ser desenvolvedora front-end júnior.' })
  // Totais do plano inteiro; parte já foi feita antes desta semana
  const totais: Record<string, [number, number]> = { Fundamentos: [8, 8], JavaScript: [10, 3], React: [12, 0], 'Projeto final': [6, 0] }
  front.etapas = front.etapas.map((e) => ({ ...e, total: totais[e.nome][0], feitasAntes: totais[e.nome][1] }))

  const ingles = sugerirRoadmap({ ...vazio, objetivo: 'Inglês para entrevistas de emprego.' })
  const concurso = sugerirRoadmap({
    objetivo: 'Passar no concurso do Banco do Brasil em 2027.',
    arquivo: 'Edital Banco do Brasil 2027.pdf',
    texto: '',
    conteudos: [],
    competencias: ['Vendas e negociação', 'Ética e conduta'],
  })

  return [
    { ...front, id: 'front-end', status: 'aprovado' },
    { ...ingles, id: 'ingles', status: 'aguardando' },
    { ...concurso, id: 'concurso-bb', status: 'rascunho', nome: 'Concurso Banco do Brasil 2027' },
  ]
}

function planosDemo(): Record<string, Plano> {
  return {
    'front-end': {
      roadmapId: 'front-end',
      horas: 6,
      prazo: '2027-04-30',
      dias: ['Seg', 'Qua', 'Sex', 'Sáb'],
      atividades: [
        { id: 'a1', dia: 'Seg', titulo: 'Funções e escopo', etapa: 'JavaScript', minutos: 35, concluida: true, concluidaEm: diasAtras(3) },
        { id: 'a2', dia: 'Seg', titulo: 'Exercício: manipulação do DOM', etapa: 'JavaScript', minutos: 45, concluida: true, concluidaEm: diasAtras(3) },
        { id: 'a3', dia: 'Qua', titulo: 'Eventos no navegador', etapa: 'JavaScript', minutos: 60, concluida: true, concluidaEm: diasAtras(1) },
        { id: 'a4', dia: 'Sex', titulo: 'Consumindo APIs com fetch', etapa: 'JavaScript', minutos: 90, concluida: false },
        { id: 'a5', dia: 'Sáb', titulo: 'Revisão: CSS Flexbox e Grid', etapa: 'Fundamentos', minutos: 70, concluida: false, reforco: true },
      ],
      historico: [
        { data: diasAtras(8), titulo: 'Etapa Fundamentos concluída', etapa: 'Fundamentos' },
        { data: diasAtras(10), titulo: 'Projeto: página de portfólio em HTML', etapa: 'Fundamentos' },
        { data: diasAtras(12), titulo: 'Git: branches e pull requests', etapa: 'Fundamentos' },
      ],
    },
  }
}

function resultadosDemo(): Record<string, Resultado> {
  return {
    'front-end': {
      roadmapId: 'front-end',
      etapa: 'Fundamentos',
      geral: 81,
      porConteudo: [
        { conteudo: 'HTML semântico', valor: 90 },
        { conteudo: 'CSS Flexbox e Grid', valor: 68 },
        { conteudo: 'Git básico', valor: 85 },
      ],
      data: diasAtras(8),
    },
  }
}

export function dadosDemo() {
  return {
    usuario: usuarioDemo,
    roadmaps: roadmapsDemo(),
    planos: planosDemo(),
    resultados: resultadosDemo(),
    ativoId: 'front-end' as string | null,
  }
}
