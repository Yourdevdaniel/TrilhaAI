import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { atividadesIniciais, extracaoInicial, roadmapGerado, type Atividade, type StatusRoadmap } from './mock'

interface Aviso {
  texto: string
  desfazer?: () => void
}

interface Estado {
  atividades: Atividade[]
  alternarConclusao: (id: string) => void
  adicionarRevisao: (titulo: string, etapa: string) => void
  planoExiste: boolean
  excluirPlano: () => void
  criarPlano: () => void
  statusNovoRoadmap: StatusRoadmap
  aprovarNovoRoadmap: () => void
  arquivo: string | null
  setArquivo: (nome: string | null) => void
  conteudos: string[]
  setConteudos: (v: string[]) => void
  competencias: string[]
  setCompetencias: (v: string[]) => void
  aviso: Aviso | null
  avisar: (aviso: Aviso) => void
  fecharAviso: () => void
}

const Contexto = createContext<Estado | null>(null)

export function EstadoProvider({ children }: { children: ReactNode }) {
  const [atividades, setAtividades] = useState(atividadesIniciais)
  const [planoExiste, setPlanoExiste] = useState(true)
  const [statusNovoRoadmap, setStatusNovoRoadmap] = useState<StatusRoadmap>(roadmapGerado.status)
  const [arquivo, setArquivo] = useState<string | null>(extracaoInicial.arquivo)
  const [conteudos, setConteudos] = useState(extracaoInicial.conteudos)
  const [competencias, setCompetencias] = useState(extracaoInicial.competencias)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const timer = useRef<number>()

  const avisar = useCallback((novo: Aviso) => {
    window.clearTimeout(timer.current)
    setAviso(novo)
    timer.current = window.setTimeout(() => setAviso(null), 5000)
  }, [])

  const alternarConclusao = useCallback(
    (id: string) => {
      const alvo = atividades.find((a) => a.id === id)
      if (!alvo) return
      const marcar = (concluida: boolean) =>
        setAtividades((lista) => lista.map((a) => (a.id === id ? { ...a, concluida, concluidaEm: concluida ? '23/10' : undefined } : a)))
      marcar(!alvo.concluida)
      // UC06.2: reverter uma conclusão registrada por engano
      if (!alvo.concluida) avisar({ texto: 'Atividade concluída', desfazer: () => marcar(false) })
    },
    [atividades, avisar],
  )

  const adicionarRevisao = useCallback((titulo: string, etapa: string) => {
    setAtividades((lista) =>
      lista.some((a) => a.titulo === titulo)
        ? lista
        : [...lista, { id: `r${lista.length + 1}`, dia: 'Dom', titulo, etapa, minutos: 45, concluida: false, reforco: true }],
    )
  }, [])

  const valor = useMemo<Estado>(
    () => ({
      atividades,
      alternarConclusao,
      adicionarRevisao,
      planoExiste,
      excluirPlano: () => setPlanoExiste(false),
      criarPlano: () => {
        setPlanoExiste(true)
        setAtividades(atividadesIniciais)
      },
      statusNovoRoadmap,
      aprovarNovoRoadmap: () => setStatusNovoRoadmap('aprovado'),
      arquivo,
      setArquivo,
      conteudos,
      setConteudos,
      competencias,
      setCompetencias,
      aviso,
      avisar,
      fecharAviso: () => setAviso(null),
    }),
    [atividades, alternarConclusao, adicionarRevisao, planoExiste, statusNovoRoadmap, arquivo, conteudos, competencias, aviso, avisar],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useEstado() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useEstado precisa estar dentro de EstadoProvider')
  return ctx
}

export function formatarMinutos(total: number) {
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h}h${String(m).padStart(2, '0')}`
}
