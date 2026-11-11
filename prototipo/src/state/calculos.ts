// Contas derivadas do estado: progresso por etapa, progresso geral e datas.
import type { Atividade, Etapa, EstadoMarco, Plano, Roadmap } from '../data/tipos'

export interface EtapaComProgresso extends Etapa {
  progresso: number
  estado: EstadoMarco
}

const feitasNoPlano = (etapa: Etapa, plano?: Plano) =>
  plano ? plano.atividades.filter((a) => a.concluida && !a.reforco && a.etapa === etapa.nome).length : 0

/** RF06.4: percentual de cada etapa e qual delas é a atual. Sem plano não há progresso. */
export function etapasComProgresso(r: Roadmap, plano?: Plano): EtapaComProgresso[] {
  let temAtual = false
  return r.etapas.map((e) => {
    const progresso = plano ? Math.min(100, Math.round(((e.feitasAntes + feitasNoPlano(e, plano)) / Math.max(1, e.total)) * 100)) : 0
    let estado: EstadoMarco = 'futura'
    if (progresso >= 100) estado = 'concluida'
    else if (plano && !temAtual) {
      estado = 'atual'
      temAtual = true
    }
    return { ...e, progresso, estado }
  })
}

export function progressoGeral(r: Roadmap, plano?: Plano) {
  if (!plano) return 0
  const total = r.etapas.reduce((s, e) => s + Math.max(1, e.total), 0)
  const feitas = r.etapas.reduce((s, e) => s + Math.min(e.total, e.feitasAntes + feitasNoPlano(e, plano)), 0)
  return Math.round((feitas / total) * 100)
}

/** Etapa que a avaliação cobre: a atual se já começou, senão a última concluída. */
export function etapaAvaliavel(etapas: EtapaComProgresso[]) {
  const atual = etapas.find((e) => e.estado === 'atual')
  if (atual && atual.progresso > 0) return atual
  return [...etapas].reverse().find((e) => e.estado === 'concluida')
}

export const minutosConcluidos = (atividades: Atividade[]) => atividades.filter((a) => a.concluida).reduce((s, a) => s + a.minutos, 0)

export function formatarMinutos(total: number) {
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h}h${String(m).padStart(2, '0')}`
}

// Datas sempre no fuso local, em ISO curto (aaaa-mm-dd).
export function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function diasAtras(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return iso(d)
}

export const hojeISO = () => iso(new Date())

export function formatarData(valor: string) {
  const [, m, d] = valor.split('-')
  return d && m ? `${d}/${m}` : valor
}

export function dataLonga(valor: string) {
  const [a, m, d] = valor.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function semanaAtual() {
  const hoje = new Date()
  const seg = new Date(hoje)
  seg.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7))
  const dom = new Date(seg)
  dom.setDate(seg.getDate() + 6)
  const mes = (d: Date) => d.toLocaleDateString('pt-BR', { month: 'long' })
  return seg.getMonth() === dom.getMonth() ? `${seg.getDate()} a ${dom.getDate()} de ${mes(dom)}` : `${seg.getDate()} de ${mes(seg)} a ${dom.getDate()} de ${mes(dom)}`
}

export function semanasAte(prazo: string) {
  const [a, m, d] = prazo.split('-').map(Number)
  const alvo = new Date(a, m - 1, d).getTime()
  return Math.max(0, Math.round((alvo - Date.now()) / (7 * 24 * 3600 * 1000)))
}
