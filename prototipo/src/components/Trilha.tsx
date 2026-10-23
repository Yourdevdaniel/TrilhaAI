import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import type { EstadoMarco } from '../data/mock'
import { cx } from './ui'

export interface Marco {
  rotulo: ReactNode
  detalhe?: ReactNode
  estado: EstadoMarco
}

// Altura em que cada marco fica, alternando para a trilha ondular (em px).
const ALTURAS = [34, 22, 40, 26, 36, 24, 38]

/** Trilha pontilhada com marcos redondos, o grafismo central da marca. */
export function Trilha({ marcos, compacta, className }: { marcos: Marco[]; compacta?: boolean; className?: string }) {
  const n = marcos.length
  const altura = compacta ? 56 : 64
  const pontos = marcos.map((_, i) => ({ x: n === 1 ? 50 : 9 + (i * 82) / (n - 1), y: (ALTURAS[i % ALTURAS.length] * altura) / 64 }))
  // Curva suave passando pelos marcos, com pontas saindo das bordas
  const todos = [{ x: 0, y: pontos[0].y + 10 }, ...pontos, { x: 100, y: pontos[n - 1].y - 10 }]
  let d = `M ${todos[0].x} ${todos[0].y}`
  for (let i = 1; i < todos.length; i++) {
    const a = todos[i - 1]
    const b = todos[i]
    const meio = (a.x + b.x) / 2
    d += ` C ${meio} ${a.y}, ${meio} ${b.y}, ${b.x} ${b.y}`
  }

  return (
    <div className={cx('relative w-full', className)} style={{ height: altura + (compacta ? 40 : 52) }}>
      <svg className="absolute inset-x-0 top-0 w-full" style={{ height: altura }} viewBox={`0 0 100 ${altura}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={d} fill="none" stroke="#1ec8e8" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {marcos.map((m, i) => (
        <div key={i} className="absolute flex -translate-x-1/2 flex-col items-center text-center" style={{ left: `${pontos[i].x}%`, top: pontos[i].y - (compacta ? 14 : 18) }}>
          <Ponto estado={m.estado} pequeno={compacta} />
          <span className={cx('mt-2 max-w-20 leading-tight font-semibold sm:max-w-none sm:whitespace-nowrap', compacta ? 'text-sm' : 'text-base', m.estado === 'atual' ? 'text-laranja font-bold' : 'text-tinta')}>{m.rotulo}</span>
          {m.detalhe && <span className={cx('text-sm', m.estado === 'atual' ? 'text-laranja' : m.estado === 'concluida' ? 'text-petroleo' : 'text-cinza')}>{m.detalhe}</span>}
        </div>
      ))}
    </div>
  )
}

export function Ponto({ estado, pequeno }: { estado: EstadoMarco; pequeno?: boolean }) {
  const tam = pequeno ? 'size-7' : 'size-9'
  if (estado === 'concluida')
    return (
      <span className={cx(tam, 'flex items-center justify-center rounded-full bg-ciano text-white')}>
        <Check className="size-1/2" strokeWidth={3.5} />
      </span>
    )
  if (estado === 'atual')
    return (
      <span className={cx(tam, 'flex items-center justify-center rounded-full bg-laranja ring-8 ring-laranja/15')}>
        <span className="size-2/5 rounded-full bg-white" />
      </span>
    )
  return <span className={cx(tam, 'block rounded-full border-[3px] border-ciano bg-white')} />
}
