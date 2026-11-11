// Estado do protótipo. Faz o papel do backend: guarda conta, roadmaps, planos e
// resultados no localStorage, para a demonstração sobreviver a um F5.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { montarSemana, sugerirRoadmap, extrair as extrairDaIA } from '../data/ia'
import { CPF_JA_CADASTRADO, dadosDemo, EMAIL_DEMO } from '../data/seed'
import type { Atividade, Dia, Etapa, Plano, Rascunho, Resultado, Roadmap, Usuario } from '../data/tipos'
import { etapasComProgresso, hojeISO } from './calculos'

const CHAVE = 'trilhaai-demo-v2'

interface Dados {
  logado: boolean
  usuario: Usuario
  roadmaps: Roadmap[]
  planos: Record<string, Plano>
  resultados: Record<string, Resultado>
  ativoId: string | null
  preferencias: { horas: number; dias: Dia[] }
  rascunho: Rascunho
}

export interface Aviso {
  texto: string
  tipo?: 'sucesso' | 'info' | 'festa' | 'erro'
  desfazer?: () => void
}

const rascunhoVazio: Rascunho = { objetivo: '', arquivo: null, texto: '', conteudos: [], competencias: [] }
const preferenciasPadrao = { horas: 6, dias: ['Seg', 'Qua', 'Sex', 'Sáb'] as Dia[] }

function inicial(logado = false): Dados {
  return {
    logado,
    ...dadosDemo(),
    preferencias: preferenciasPadrao,
    rascunho: { ...rascunhoVazio, objetivo: 'Quero trabalhar com análise de dados usando Python em 6 meses.' },
  }
}

function carregar(): Dados {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo) return { ...inicial(), ...JSON.parse(salvo) }
  } catch {
    // Sem localStorage (aba anônima, bloqueio): segue só em memória
  }
  return inicial()
}

function useEstadoInterno() {
  const [dados, setDados] = useState<Dados>(carregar)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [festa, setFesta] = useState(0)
  const timer = useRef<number>()

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados))
    } catch {
      /* idem */
    }
  }, [dados])

  const mudar = useCallback((f: (d: Dados) => Dados) => setDados(f), [])

  const avisar = useCallback((novo: Aviso) => {
    window.clearTimeout(timer.current)
    setAviso(novo)
    if (novo.tipo === 'festa') setFesta((n) => n + 1)
    timer.current = window.setTimeout(() => setAviso(null), novo.desfazer ? 6000 : 4000)
  }, [])

  const celebrar = useCallback(() => setFesta((n) => n + 1), [])

  // RF02 · Autenticar usuário
  const entrar = useCallback(
    (email: string): string | null => {
      const e = email.trim().toLowerCase()
      if (e === EMAIL_DEMO) {
        // A conta de demonstração sempre volta com os dados da Ana
        if (dados.usuario.email !== EMAIL_DEMO) setDados(inicial(true))
        else mudar((d) => ({ ...d, logado: true }))
        return null
      }
      if (e === dados.usuario.email.toLowerCase()) {
        mudar((d) => ({ ...d, logado: true }))
        return null
      }
      // Login de mentirinha: qualquer outro e-mail entra na conta de demonstração
      setDados(inicial(true))
      return null
    },
    [dados.usuario.email, mudar],
  )

  // RF01.1 · Cadastrar usuário: conta nova começa vazia
  const cadastrar = useCallback((u: Usuario) => {
    if (u.cpf === CPF_JA_CADASTRADO) return { cpf: 'Este CPF já está cadastrado.' }
    if (u.email.trim().toLowerCase() === EMAIL_DEMO) return { email: 'Este e-mail já está cadastrado.' }
    setDados({
      logado: true,
      usuario: u,
      roadmaps: [],
      planos: {},
      resultados: {},
      ativoId: null,
      preferencias: preferenciasPadrao,
      rascunho: rascunhoVazio,
    })
    return null
  }, [])

  const sair = useCallback(() => mudar((d) => ({ ...d, logado: false })), [mudar])
  const excluirConta = useCallback(() => setDados({ ...inicial(), usuario: { nome: '', nomeCompleto: '', email: '', cpf: '' }, roadmaps: [], planos: {}, resultados: {}, ativoId: null }), [])
  const reiniciarDemo = useCallback(() => setDados(inicial(true)), [])
  const salvarUsuario = useCallback((u: Partial<Usuario>) => mudar((d) => ({ ...d, usuario: { ...d.usuario, ...u, nome: (u.nomeCompleto ?? d.usuario.nomeCompleto).split(' ')[0] || d.usuario.nome } })), [mudar])

  const concluirOnboarding = useCallback(
    (p: { objetivo: string; horas: number; dias: Dia[] }) => mudar((d) => ({ ...d, preferencias: { horas: p.horas, dias: p.dias }, rascunho: { ...rascunhoVazio, objetivo: p.objetivo } })),
    [mudar],
  )

  // RF03 · Processar documentos
  const setRascunho = useCallback((r: Partial<Rascunho>) => mudar((d) => ({ ...d, rascunho: { ...d.rascunho, ...r } })), [mudar])
  const extrair = useCallback(() => mudar((d) => ({ ...d, rascunho: { ...d.rascunho, ...extrairDaIA(d.rascunho) } })), [mudar])

  // RF04 · Gerenciar roadmap
  const criarRoadmap = useCallback(() => {
    const id = `r${Date.now().toString(36)}`
    mudar((d) => ({ ...d, roadmaps: [{ ...sugerirRoadmap(d.rascunho), id }, ...d.roadmaps], rascunho: { ...rascunhoVazio } }))
    return id
  }, [mudar])

  const salvarEtapas = useCallback(
    (id: string, etapas: Etapa[]) =>
      mudar((d) => ({
        ...d,
        roadmaps: d.roadmaps.map((r) => {
          if (r.id !== id) return r
          // O total acompanha conteúdos adicionados ou removidos na edição
          const novas = etapas.map((e) => {
            const antes = r.etapas.find((x) => x.nome === e.nome)
            const total = antes ? Math.max(1, antes.total + e.conteudos.length - antes.conteudos.length) : e.conteudos.length
            return { ...e, total, feitasAntes: Math.min(antes?.feitasAntes ?? 0, total) }
          })
          return { ...r, etapas: novas }
        }),
      })),
    [mudar],
  )

  const excluirRoadmap = useCallback(
    (id: string) =>
      mudar((d) => {
        const planos = { ...d.planos }
        delete planos[id]
        const ativoId = d.ativoId === id ? (Object.keys(planos)[0] ?? null) : d.ativoId
        return { ...d, roadmaps: d.roadmaps.filter((r) => r.id !== id), planos, ativoId }
      }),
    [mudar],
  )

  const aprovarRoadmap = useCallback((id: string) => mudar((d) => ({ ...d, roadmaps: d.roadmaps.map((r) => (r.id === id ? { ...r, status: 'aprovado' } : r)) })), [mudar])

  // RF05 · Gerenciar plano de estudos
  const criarPlano = useCallback(
    (roadmapId: string, p: { horas: number; prazo: string; dias: Dia[] }) =>
      mudar((d) => {
        const r = d.roadmaps.find((x) => x.id === roadmapId)
        if (!r) return d
        const plano: Plano = { roadmapId, ...p, atividades: montarSemana(r, p.horas, p.dias) }
        return { ...d, planos: { ...d.planos, [roadmapId]: plano }, ativoId: roadmapId, preferencias: { horas: p.horas, dias: p.dias } }
      }),
    [mudar],
  )

  const proximaSemana = useCallback(
    (roadmapId: string) =>
      mudar((d) => {
        const r = d.roadmaps.find((x) => x.id === roadmapId)
        const plano = d.planos[roadmapId]
        if (!r || !plano) return d
        const novas = montarSemana(r, plano.horas, plano.dias, plano.atividades.map((a) => a.titulo))
        const historico = [...(plano.historico ?? []), ...plano.atividades.filter((a) => a.concluida).map((a) => ({ data: a.concluidaEm ?? hojeISO(), titulo: a.titulo, etapa: a.etapa }))]
        const feitas = plano.atividades.filter((a) => a.concluida && !a.reforco)
        // Atividades concluídas viram "feitas antes" das etapas, para o progresso não voltar
        const etapas = r.etapas.map((e) => ({ ...e, feitasAntes: Math.min(e.total, e.feitasAntes + feitas.filter((a) => a.etapa === e.nome).length) }))
        return {
          ...d,
          roadmaps: d.roadmaps.map((x) => (x.id === roadmapId ? { ...x, etapas } : x)),
          planos: { ...d.planos, [roadmapId]: { ...plano, atividades: novas, historico } },
        }
      }),
    [mudar],
  )

  const excluirPlano = useCallback(
    (roadmapId: string) =>
      mudar((d) => {
        const planos = { ...d.planos }
        delete planos[roadmapId]
        return { ...d, planos, ativoId: d.ativoId === roadmapId ? (Object.keys(planos)[0] ?? null) : d.ativoId }
      }),
    [mudar],
  )

  const editarAtividade = useCallback(
    (id: string, campos: Partial<Pick<Atividade, 'dia' | 'minutos'>>) =>
      mudar((d) => {
        if (!d.ativoId || !d.planos[d.ativoId]) return d
        const plano = d.planos[d.ativoId]
        return { ...d, planos: { ...d.planos, [d.ativoId]: { ...plano, atividades: plano.atividades.map((a) => (a.id === id ? { ...a, ...campos } : a)) } } }
      }),
    [mudar],
  )

  // RF06 · Acompanhar progresso
  const marcar = useCallback(
    (id: string, concluida: boolean) =>
      mudar((d) => {
        if (!d.ativoId || !d.planos[d.ativoId]) return d
        const plano = d.planos[d.ativoId]
        const atividades = plano.atividades.map((a) => (a.id === id ? { ...a, concluida, concluidaEm: concluida ? hojeISO() : undefined } : a))
        return { ...d, planos: { ...d.planos, [d.ativoId]: { ...plano, atividades } } }
      }),
    [mudar],
  )

  const alternarConclusao = useCallback(
    (id: string) => {
      const plano = dados.ativoId ? dados.planos[dados.ativoId] : undefined
      const roadmap = dados.roadmaps.find((r) => r.id === dados.ativoId)
      const alvo = plano?.atividades.find((a) => a.id === id)
      if (!plano || !roadmap || !alvo) return
      if (alvo.concluida) {
        // UC06.2: reverter conclusão registrada por engano
        marcar(id, false)
        avisar({ texto: 'Conclusão desfeita. Progresso atualizado.', tipo: 'info' })
        return
      }
      marcar(id, true)
      // Detecta se essa atividade fechou a etapa, para comemorar
      const depois = { ...plano, atividades: plano.atividades.map((a) => (a.id === id ? { ...a, concluida: true } : a)) }
      const antes = etapasComProgresso(roadmap, plano).find((e) => e.nome === alvo.etapa)
      const agora = etapasComProgresso(roadmap, depois).find((e) => e.nome === alvo.etapa)
      const fechou = antes && agora && antes.estado !== 'concluida' && agora.estado === 'concluida'
      avisar({ texto: fechou ? `Etapa ${alvo.etapa} concluída!` : 'Atividade concluída', tipo: fechou ? 'festa' : 'sucesso', desfazer: () => marcar(id, false) })
    },
    [dados, marcar, avisar],
  )

  const adicionarRevisoes = useCallback(
    (conteudos: string[], etapa: string) =>
      mudar((d) => {
        if (!d.ativoId || !d.planos[d.ativoId]) return d
        const plano = d.planos[d.ativoId]
        const dia = plano.dias[plano.dias.length - 1] ?? 'Dom'
        const novas = conteudos
          .map((c) => `Revisão: ${c}`)
          .filter((t) => !plano.atividades.some((a) => a.titulo === t))
          .map((titulo, i) => ({ id: `rev-${Date.now().toString(36)}-${i}`, dia, titulo, etapa, minutos: 45, concluida: false, reforco: true }))
        return { ...d, planos: { ...d.planos, [d.ativoId]: { ...plano, atividades: [...plano.atividades, ...novas] } } }
      }),
    [mudar],
  )

  const setAtivo = useCallback((id: string) => mudar((d) => ({ ...d, ativoId: id })), [mudar])

  // RF07 · Avaliar conhecimento
  const salvarResultado = useCallback((r: Resultado) => mudar((d) => ({ ...d, resultados: { ...d.resultados, [r.roadmapId]: r } })), [mudar])

  return {
    ...dados,
    aviso,
    festa,
    avisar,
    celebrar,
    fecharAviso: () => setAviso(null),
    entrar,
    cadastrar,
    sair,
    excluirConta,
    reiniciarDemo,
    salvarUsuario,
    concluirOnboarding,
    setRascunho,
    extrair,
    criarRoadmap,
    salvarEtapas,
    excluirRoadmap,
    aprovarRoadmap,
    criarPlano,
    proximaSemana,
    excluirPlano,
    editarAtividade,
    alternarConclusao,
    adicionarRevisoes,
    setAtivo,
    salvarResultado,
  }
}

type Estado = ReturnType<typeof useEstadoInterno>
const Contexto = createContext<Estado | null>(null)

export function EstadoProvider({ children }: { children: ReactNode }) {
  const estado = useEstadoInterno()
  return <Contexto.Provider value={estado}>{children}</Contexto.Provider>
}

export function useEstado() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useEstado precisa estar dentro de EstadoProvider')
  return ctx
}

/** Roadmap ativo (o que tem plano e aparece no início), com plano e progresso calculados. */
export function useAtivo() {
  const { roadmaps, planos, ativoId, resultados } = useEstado()
  return useMemo(() => {
    const roadmap = roadmaps.find((r) => r.id === ativoId)
    const plano = ativoId ? planos[ativoId] : undefined
    if (!roadmap) return null
    return { roadmap, plano, etapas: etapasComProgresso(roadmap, plano), resultado: resultados[roadmap.id] }
  }, [roadmaps, planos, ativoId, resultados])
}
