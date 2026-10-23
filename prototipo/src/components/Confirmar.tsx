import { Botao } from './ui'

/** Confirmação antes de ações destrutivas (excluir conta, roadmap ou plano). */
export function Confirmar({ aberto, titulo, texto, acao, onConfirmar, onCancelar }: { aberto: boolean; titulo: string; texto: string; acao: string; onConfirmar: () => void; onCancelar: () => void }) {
  if (!aberto) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-tinta/40 p-4" onClick={onCancelar}>
      <div role="dialog" aria-modal="true" aria-labelledby="confirmar-titulo" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirmar-titulo" className="text-2xl font-black">{titulo}</h2>
        <p className="mt-2 text-cinza">{texto}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Botao onClick={onCancelar}>Cancelar</Botao>
          <Botao variante="perigo" onClick={onConfirmar}>{acao}</Botao>
        </div>
      </div>
    </div>
  )
}
