import { Check, Loader2, RotateCcw, Sparkles, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Botao, cx, Mascote } from './ui'

/**
 * Tela de espera enquanto a "IA" trabalha: os passos acendem em sequência.
 * Com `falhar`, para no meio e mostra a exceção do RNF11 (falha ou demora da IA),
 * com nova tentativa sem duplicar dados.
 */
export function ProcessandoIA({ titulo, passos, falhar, onConcluir, onCancelar }: { titulo: string; passos: string[]; falhar?: boolean; onConcluir: () => void; onCancelar: () => void }) {
  const [feitos, setFeitos] = useState(0)
  const [falhou, setFalhou] = useState(false)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (falhou) return
    if (falhar && tentativa === 0 && feitos === Math.min(2, passos.length - 1)) {
      const t = window.setTimeout(() => setFalhou(true), 900)
      return () => window.clearTimeout(t)
    }
    if (feitos >= passos.length) {
      const t = window.setTimeout(onConcluir, 450)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setFeitos((n) => n + 1), feitos === 0 ? 650 : 750)
    return () => window.clearTimeout(t)
  }, [feitos, falhou, falhar, tentativa, passos.length, onConcluir])

  return (
    <div className="anim-surgir fixed inset-0 z-50 flex items-center justify-center bg-nevoa/80 p-4 backdrop-blur-md" role="alertdialog" aria-live="polite" aria-label={titulo}>
      <div className="anim-modal w-full max-w-md rounded-3xl border border-borda bg-white p-8 text-center shadow-[0_30px_60px_-30px_rgba(11,127,160,0.5)]">
        <div className="relative mx-auto w-32">
          <Mascote pose="caminho" className="w-32" flutuando={!falhou} />
          {!falhou && <Sparkles className="absolute -top-1 -right-3 size-7 animate-pulse text-laranja" />}
        </div>
        {falhou ? (
          <>
            <h2 className="anim-tremer mt-4 flex items-center justify-center gap-2 text-2xl font-black text-perigo">
              <WifiOff className="size-6" /> A IA não respondeu a tempo
            </h2>
            <p className="mt-2 text-lg text-cinza">Passou de 60 segundos. Nada foi salvo, então dá para tentar de novo sem duplicar nada.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Botao onClick={onCancelar}>Cancelar</Botao>
              <Botao
                variante="primario"
                icone={<RotateCcw className="size-5" />}
                onClick={() => {
                  setFalhou(false)
                  setFeitos(0)
                  setTentativa((n) => n + 1)
                }}
              >
                Tentar de novo
              </Botao>
            </div>
          </>
        ) : (
          <>
            <h2 className="texto-brilho mt-4 text-2xl font-black">{titulo}</h2>
            <ul className="mt-6 space-y-3 text-left">
              {passos.map((p, i) => {
                const feito = i < feitos
                const rodando = i === feitos
                return (
                  <li key={p} className={cx('flex items-center gap-3 text-lg transition-opacity duration-300', i > feitos && 'opacity-35')}>
                    <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-full', feito ? 'anim-carimbo bg-ciano text-white' : 'bg-ciano-suave text-petroleo')}>
                      {feito ? <Check className="size-4" strokeWidth={3.5} /> : rodando ? <Loader2 className="size-4 animate-spin" /> : null}
                    </span>
                    <span className={cx(feito ? 'text-tinta' : 'text-cinza', rodando && 'font-semibold text-tinta')}>{p}</span>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
