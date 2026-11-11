import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import mascoteDePe from '../assets/mascote-de-pe.png'
import mascoteComemorando from '../assets/mascote-comemorando.png'
import mascoteCaminho from '../assets/mascote-caminho.png'

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/** Atraso escalonado para entradas em sequência (usa a classe anim-subir). */
export const atraso = (i: number) => ({ '--i': i }) as CSSProperties

export function Card({ children, className, i, style }: { children: ReactNode; className?: string; i?: number; style?: CSSProperties }) {
  return (
    <div className={cx('rounded-2xl border border-borda bg-white p-5', i !== undefined && 'anim-subir', className)} style={{ ...(i !== undefined ? atraso(i) : {}), ...style }}>
      {children}
    </div>
  )
}

type Variante = 'primario' | 'secundario' | 'perigo' | 'texto'

const estilos: Record<Variante, string> = {
  // Laranja é só a ação principal da tela (brand book)
  primario: 'bg-laranja text-white hover:bg-[#ec4e14] hover:-translate-y-0.5 shadow-[0_6px_16px_-8px_rgba(255,90,31,0.7)] hover:shadow-[0_10px_22px_-8px_rgba(255,90,31,0.75)]',
  secundario: 'border-2 border-petroleo text-petroleo bg-white hover:bg-ciano-suave',
  perigo: 'border-2 border-perigo/70 text-perigo bg-white hover:bg-perigo-claro',
  texto: 'text-petroleo hover:underline px-0',
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  para?: string
  icone?: ReactNode
  iconeDepois?: ReactNode
}

export function Botao({ variante = 'secundario', para, icone, iconeDepois, className, children, ...resto }: BotaoProps) {
  const classes = cx(
    'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-bold transition duration-200 cursor-pointer active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    estilos[variante],
    className,
  )
  const conteudo = (
    <>
      {icone}
      {children}
      {iconeDepois && <span className="transition-transform duration-200 group-hover:translate-x-1">{iconeDepois}</span>}
    </>
  )
  if (para) {
    return (
      <Link to={para} className={classes}>
        {conteudo}
      </Link>
    )
  }
  return (
    <button className={classes} {...resto}>
      {conteudo}
    </button>
  )
}

export function Selo({ children, tom = 'ciano', icone }: { children: ReactNode; tom?: 'ciano' | 'petroleo' | 'laranja' | 'cinza' | 'amarelo' | 'contorno'; icone?: ReactNode }) {
  const tons = {
    ciano: 'bg-ciano-claro text-petroleo',
    petroleo: 'bg-petroleo text-white',
    laranja: 'bg-laranja-claro text-[#c2410c]',
    cinza: 'bg-[#e8eef1] text-cinza',
    amarelo: 'bg-[#fdf1d8] text-[#8a5a00]',
    contorno: 'border-2 border-ciano text-petroleo bg-white',
  }
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap', tons[tom])}>{icone}{children}</span>
}

export function IconeRedondo({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-full bg-ciano-suave text-petroleo', className)}>{children}</span>
}

const poses = { 'de-pe': mascoteDePe, comemorando: mascoteComemorando, caminho: mascoteCaminho }

export function Mascote({ pose = 'de-pe', className, flutuando }: { pose?: keyof typeof poses; className?: string; flutuando?: boolean }) {
  return <img src={poses[pose]} alt="" aria-hidden="true" className={cx('select-none', flutuando && 'anim-flutuar', className)} draggable={false} />
}

export function TituloPagina({ titulo, subtitulo, children }: { titulo: ReactNode; subtitulo?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">{titulo}</h1>
        {subtitulo && <p className="mt-2 text-lg text-cinza">{subtitulo}</p>}
      </div>
      {children}
    </div>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex flex-col leading-none', className)}>
      <span className="font-black tracking-tight">
        <span className="text-petroleo">Trilha</span>
        <span className="text-laranja">Ai</span>
      </span>
      <svg viewBox="0 0 100 6" className="mt-1 h-[0.18em] w-full" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 3 Q 25 0 50 3 T 98 3" fill="none" stroke="#1ec8e8" strokeWidth="2.2" strokeDasharray="4 3" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="anim-marchar" />
      </svg>
    </span>
  )
}

/** Número que conta até o valor (anima quando o valor muda). */
export function useContagem(valor: number, duracao = 900) {
  const [atual, setAtual] = useState(0)
  const de = useRef(0)
  useEffect(() => {
    const inicio = performance.now()
    const origem = de.current
    let quadro = 0
    const passo = (t: number) => {
      const p = Math.min(1, (t - inicio) / duracao)
      const v = origem + (valor - origem) * (1 - Math.pow(1 - p, 3))
      setAtual(Math.round(v))
      de.current = v
      if (p < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [valor, duracao])
  return atual
}

export function Numero({ valor, sufixo }: { valor: number; sufixo?: ReactNode }) {
  const v = useContagem(valor)
  return (
    <>
      {v}
      {sufixo}
    </>
  )
}

/** Começa em 0 e vai até o valor no primeiro quadro, para as barras crescerem ao entrar. */
function useValorAnimado(valor: number) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(valor))
    return () => cancelAnimationFrame(id)
  }, [valor])
  return v
}

export function Anel({ valor, tamanho = 180, espessura = 16, cor = '#1ec8e8', children }: { valor: number; tamanho?: number; espessura?: number; cor?: string; children?: ReactNode }) {
  const r = (tamanho - espessura) / 2
  const c = 2 * Math.PI * r
  const v = useValorAnimado(valor)
  return (
    <div className="relative" style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke="#eefbfd" strokeWidth={espessura} />
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`} style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export function Barra({ valor, cor = 'bg-ciano', className }: { valor: number; cor?: string; className?: string }) {
  const v = useValorAnimado(valor)
  return (
    <div className={cx('h-3 w-full overflow-hidden rounded-full bg-ciano-suave', className)}>
      <div className={cx('h-3 rounded-full transition-[width] duration-1000 ease-out', cor)} style={{ width: `${v}%` }} />
    </div>
  )
}

export function Vazio({ titulo, texto, children, pose = 'caminho' }: { titulo: string; texto: string; children?: ReactNode; pose?: keyof typeof poses }) {
  return (
    <Card className="mx-auto mt-6 flex max-w-xl flex-col items-center p-10 text-center" i={0}>
      <Mascote pose={pose} className="w-40" flutuando />
      <h1 className="mt-4 text-3xl font-black">{titulo}</h1>
      <p className="mt-2 text-lg text-cinza">{texto}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
    </Card>
  )
}
