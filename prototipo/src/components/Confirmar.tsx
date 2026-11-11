import { Botao } from './ui'

/** Confirmação antes de ações destrutivas ou de saída (excluir conta, roadmap, plano; sair). */
export function Confirmar({ aberto, titulo, texto, acao, perigo = true, onConfirmar, onCancelar }: { aberto: boolean; titulo: string; texto: string; acao: string; perigo?: boolean; onConfirmar: () => void; onCancelar: () => void }) {
  if (!aberto) return null
  return (
    <div className="anim-surgir fixed inset-0 z-40 flex items-center justify-center bg-tinta/40 p-4 backdrop-blur-sm" onClick={onCancelar}>
      <div role="dialog" aria-modal="true" aria-labelledby="confirmar-titulo" className="anim-modal w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirmar-titulo" className="text-2xl font-black">{titulo}</h2>
        <p className="mt-2 text-cinza">{texto}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Botao onClick={onCancelar}>Cancelar</Botao>
          <Botao variante={perigo ? 'perigo' : 'primario'} onClick={onConfirmar}>{acao}</Botao>
        </div>
      </div>
    </div>
  )
}
