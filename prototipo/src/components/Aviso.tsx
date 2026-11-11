import { CheckCircle2, Info, PartyPopper, X, XCircle } from 'lucide-react'
import { useEstado } from '../state/estado'
import { cx } from './ui'

const icones = { sucesso: CheckCircle2, info: Info, festa: PartyPopper, erro: XCircle }

/** Aviso flutuante (toast) com "Desfazer" opcional. */
export function Aviso() {
  const { aviso, fecharAviso } = useEstado()
  if (!aviso) return null
  const tipo = aviso.tipo ?? 'sucesso'
  const Icone = icones[tipo]
  return (
    <div key={aviso.texto + tipo} role="status" className="anim-aviso fixed bottom-20 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3 shadow-[0_18px_40px_-18px_rgba(11,127,160,0.45)] md:bottom-8">
      <Icone className={cx('size-6 shrink-0', tipo === 'erro' ? 'text-perigo' : tipo === 'festa' ? 'text-laranja' : 'text-ciano')} />
      <span className="font-semibold">{aviso.texto}</span>
      {aviso.desfazer && (
        <button
          className="font-bold text-petroleo hover:underline"
          onClick={() => {
            aviso.desfazer?.()
            fecharAviso()
          }}
        >
          Desfazer
        </button>
      )}
      <button aria-label="Fechar aviso" onClick={fecharAviso} className="text-cinza hover:text-tinta">
        <X className="size-5" />
      </button>
    </div>
  )
}
