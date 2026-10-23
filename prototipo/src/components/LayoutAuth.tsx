import type { ReactNode } from 'react'
import { Mascote, Wordmark } from './ui'

/** Telas sem sessão (01 e 02): painel ciano com o mascote à esquerda e o formulário à direita. */
export function LayoutAuth({ pose, frase, children }: { pose: 'de-pe' | 'caminho'; frase?: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] md:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-ciano-claro px-6 py-10">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M -5 72 C 15 55, 22 60, 30 62 S 55 70, 72 52 S 92 40, 105 38" fill="none" stroke="#1ec8e8" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative flex flex-col items-center text-center">
          <Wordmark className="text-6xl md:text-7xl" />
          {frase && <p className="mt-5 text-2xl text-tinta/80">{frase}</p>}
          <Mascote pose={pose} className="mt-8 w-56 md:w-80" />
        </div>
      </div>
      <div className="flex items-center justify-center bg-nevoa px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-borda bg-white p-6 shadow-[0_20px_40px_-30px_rgba(11,127,160,0.35)] sm:p-8 md:p-12">{children}</div>
      </div>
    </div>
  )
}

export function Campo({ rotulo, erro, children, acao }: { rotulo: string; erro?: string; children: ReactNode; acao?: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-lg text-tinta/80">
        {rotulo}
        {acao}
      </span>
      {children}
      {erro && (
        <span className="mt-2 flex items-center gap-2 text-perigo" role="alert">
          <span className="flex size-6 items-center justify-center rounded-full border-2 border-perigo text-sm font-black">!</span>
          {erro}
        </span>
      )}
    </label>
  )
}

export const classeEntrada = 'w-full rounded-xl border border-borda bg-white px-4 py-3.5 text-lg outline-none transition focus:border-ciano focus:ring-4 focus:ring-ciano/20'
