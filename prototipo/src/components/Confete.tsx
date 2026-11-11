import { useEffect, useState, type CSSProperties } from 'react'
import { useEstado } from '../state/estado'

const cores = ['#1ec8e8', '#ff5a1f', '#0b7fa0', '#ffc94d', '#d4f6fb']

interface Pedaco {
  id: number
  x: number
  dx: number
  giro: number
  dur: number
  atraso: number
  cor: string
  largura: number
  redondo: boolean
}

/** Chuva de confete quando algo importante acontece (etapa concluída, plano criado...). */
export function Confete() {
  const { festa } = useEstado()
  const [pedacos, setPedacos] = useState<Pedaco[]>([])

  useEffect(() => {
    if (!festa) return
    setPedacos(
      Array.from({ length: 70 }, (_, i) => ({
        id: festa * 1000 + i,
        x: Math.random() * 100,
        dx: (Math.random() - 0.5) * 240,
        giro: (Math.random() - 0.5) * 1080,
        dur: 1.6 + Math.random() * 1.4,
        atraso: Math.random() * 0.35,
        cor: cores[i % cores.length],
        largura: 6 + Math.random() * 7,
        redondo: Math.random() > 0.6,
      })),
    )
    const t = window.setTimeout(() => setPedacos([]), 3400)
    return () => window.clearTimeout(t)
  }, [festa])

  if (!pedacos.length) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {pedacos.map((p) => (
        <span
          key={p.id}
          className="confete"
          style={
            {
              left: `${p.x}%`,
              width: p.largura,
              height: p.redondo ? p.largura : p.largura * 0.45,
              borderRadius: p.redondo ? '50%' : 2,
              background: p.cor,
              '--dx': `${p.dx}px`,
              '--giro': `${p.giro}deg`,
              '--dur': `${p.dur}s`,
              '--atraso': `${p.atraso}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
