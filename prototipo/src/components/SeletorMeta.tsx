import { Check, ChevronDown, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEstado } from '../state/estado'
import { cx } from './ui'

/** Troca o roadmap ativo entre os que já têm plano de estudos. */
export function SeletorMeta() {
  const { roadmaps, planos, ativoId, setAtivo } = useEstado()
  const [aberto, setAberto] = useState(false)
  const caixa = useRef<HTMLDivElement>(null)
  const comPlano = roadmaps.filter((r) => planos[r.id])
  const ativo = roadmaps.find((r) => r.id === ativoId)

  useEffect(() => {
    if (!aberto) return
    const fechar = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', fechar)
    return () => document.removeEventListener('mousedown', fechar)
  }, [aberto])

  if (!ativo) return null
  return (
    <div ref={caixa} className="relative w-full sm:w-auto">
      <button onClick={() => setAberto(!aberto)} aria-expanded={aberto} className="flex w-full items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3 text-left transition hover:border-ciano sm:min-w-72">
        <Target className="size-9 shrink-0 text-petroleo" />
        <span className="min-w-0 flex-1">
          <span className="block text-cinza">Meta:</span>
          <span className="block truncate text-xl font-semibold">{ativo.nome}</span>
        </span>
        <ChevronDown className={cx('size-6 transition-transform', aberto && 'rotate-180')} />
      </button>
      {aberto && (
        <div className="anim-modal absolute right-0 z-30 mt-2 w-full min-w-72 rounded-2xl border border-borda bg-white p-2 shadow-xl">
          {comPlano.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setAtivo(r.id)
                setAberto(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-lg hover:bg-ciano-suave"
            >
              <span className="flex-1 font-semibold">{r.nome}</span>
              {r.id === ativoId && <Check className="size-5 text-petroleo" />}
            </button>
          ))}
          <Link to="/roadmaps" onClick={() => setAberto(false)} className="mt-1 block border-t border-borda px-3 pt-2.5 pb-1.5 font-semibold text-petroleo hover:underline">
            Ver todos os roadmaps
          </Link>
        </div>
      )}
    </div>
  )
}
