import { Check, ChevronLeft, ChevronRight, Clock3, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Confirmar } from '../components/Confirmar'
import { Trilha } from '../components/Trilha'
import { Botao, Card, cx, Selo, TituloPagina } from '../components/ui'
import { formatarMinutos, useEstado } from '../data/estado'
import { diasDaSemana, roadmaps, semana, type Atividade } from '../data/mock'

// Tela 09 · UC05.2 a UC05.4 (plano) e UC06.1, UC06.2 (registrar e reverter conclusão)
export default function Plano() {
  const { atividades, alternarConclusao, planoExiste, excluirPlano } = useEstado()
  const [confirmando, setConfirmando] = useState(false)
  const [editando, setEditando] = useState(false)

  if (!planoExiste) {
    return (
      <Card className="mx-auto mt-10 max-w-xl p-10 text-center">
        <h1 className="text-3xl font-black">Você ainda não tem um plano</h1>
        <p className="mt-2 text-lg text-cinza">O plano é gerado a partir de um roadmap aprovado.</p>
        <Botao variante="primario" para="/plano/novo" className="mt-6">Montar plano</Botao>
      </Card>
    )
  }

  const minutos = atividades.filter((a) => a.concluida).reduce((s, a) => s + a.minutos, 0)
  const proxima = atividades.find((a) => !a.concluida)?.id
  const dias = diasDaSemana.filter((d) => atividades.some((a) => a.dia === d))

  return (
    <>
      <TituloPagina titulo="Plano da semana" subtitulo="Seu plano de estudos para esta semana.">
        <div className="flex gap-3">
          <Botao onClick={() => setEditando(!editando)} icone={<Pencil className="size-5" />}>{editando ? 'Concluir edição' : 'Editar plano'}</Botao>
          <Botao variante="perigo" onClick={() => setConfirmando(true)} icone={<Trash2 className="size-5" />}>Excluir plano</Botao>
        </div>
      </TituloPagina>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 rounded-2xl border border-borda bg-white px-4 py-3 text-xl">
          <ChevronLeft className="size-6 text-cinza" aria-hidden="true" />
          {semana.rotulo}
          <ChevronRight className="size-6 text-cinza" aria-hidden="true" />
        </div>
        <p className="flex items-center gap-3 text-4xl font-black">
          <Clock3 className="size-9 text-petroleo" />
          {formatarMinutos(minutos)} <span className="text-xl font-semibold text-cinza">de {formatarMinutos(semana.metaMinutos)}</span>
        </p>
      </div>

      <Trilha compacta className="mt-6" marcos={roadmaps[0].etapas.map((e) => ({ rotulo: e.nome, estado: e.estado, detalhe: e.estado === 'atual' ? `${e.progresso}% da etapa` : e.estado === 'concluida' ? 'concluída' : undefined }))} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dias.map((dia) => (
          <section key={dia} className="min-h-80 rounded-2xl border border-borda bg-white/60 p-3">
            <h2 className="mb-3 text-center text-2xl font-black">{dia}</h2>
            <div className="space-y-3">
              {atividades.filter((a) => a.dia === dia).map((a) => (
                <CartaoAtividade key={a.id} atividade={a} atual={a.id === proxima} editando={editando} onAlternar={() => alternarConclusao(a.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Confirmar aberto={confirmando} titulo="Excluir o plano de estudos?" texto="O roadmap continua aprovado; você pode gerar um novo plano depois." acao="Excluir plano" onCancelar={() => setConfirmando(false)} onConfirmar={() => (excluirPlano(), setConfirmando(false))} />
    </>
  )
}

function CartaoAtividade({ atividade: a, atual, editando, onAlternar }: { atividade: Atividade; atual: boolean; editando: boolean; onAlternar: () => void }) {
  return (
    <article className={cx('rounded-2xl border bg-white p-4', atual ? 'border-2 border-petroleo bg-ciano-suave' : 'border-borda')}>
      <div className="flex gap-3">
        <button aria-label={a.concluida ? `Desmarcar ${a.titulo}` : `Concluir ${a.titulo}`} onClick={onAlternar} className={cx('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2', a.concluida ? 'border-ciano bg-ciano text-white' : atual ? 'border-laranja' : 'border-ciano/60')}>
          {a.concluida ? <Check className="size-4" strokeWidth={3.5} /> : atual && <span className="size-3 rounded-full bg-laranja" />}
        </button>
        <div className="min-w-0 flex-1">
          <h3 className={cx('text-lg font-bold leading-snug', a.concluida && 'text-tinta/70')}>{a.titulo}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Selo tom={a.etapa === 'JavaScript' ? 'laranja' : 'ciano'}>{a.etapa}</Selo>
            {a.reforco && <span className="rounded-md border border-laranja/40 bg-laranja-claro px-2 py-0.5 text-xs font-semibold text-[#c2410c]">Reforço</span>}
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 text-cinza">
        <Clock3 className="size-5" />
        {editando ? <select defaultValue={a.minutos} className="rounded-md border border-borda bg-white px-2 py-1" aria-label="Duração">{[30, 35, 45, 60, 70, 90, 120].map((m) => <option key={m} value={m}>{formatarMinutos(m)}</option>)}</select> : formatarMinutos(a.minutos)}
      </p>
    </article>
  )
}
