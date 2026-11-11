import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock3, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Confirmar } from '../../components/Confirmar'
import { SeletorMeta } from '../../components/SeletorMeta'
import { Trilha } from '../../components/Trilha'
import { atraso, Barra, Botao, Card, cx, Mascote, Selo, TituloPagina, Vazio } from '../../components/ui'
import { ordemDia } from '../../data/ia'
import { diasDaSemana, type Atividade, type Dia } from '../../data/tipos'
import { formatarMinutos, minutosConcluidos, progressoGeral, semanaAtual } from '../../state/calculos'
import { useAtivo, useEstado } from '../../state/estado'

const LIMITE_DIA = 240

// UC05.2 Visualizar · UC05.3 Editar · UC05.4 Excluir plano · UC06.1 Registrar e UC06.2 Reverter conclusão
export default function Plano() {
  const { alternarConclusao, excluirPlano, editarAtividade, proximaSemana, avisar, roadmaps } = useEstado()
  const ativo = useAtivo()
  const [excluindo, setExcluindo] = useState(false)
  const [editando, setEditando] = useState(false)
  const [erro, setErro] = useState('')

  if (!ativo?.plano) {
    const aprovado = roadmaps.find((r) => r.status === 'aprovado')
    return (
      <Vazio titulo="Você ainda não tem um plano" texto="O plano é gerado a partir de um roadmap aprovado, com as horas e o prazo que você tem.">
        <Botao variante="primario" para={aprovado ? `/plano/novo?roadmap=${aprovado.id}` : '/roadmaps'}>
          {aprovado ? 'Montar plano' : 'Ver roadmaps'}
        </Botao>
      </Vazio>
    )
  }

  const { roadmap, plano, etapas } = ativo
  const atividades = plano.atividades
  const minutos = minutosConcluidos(atividades)
  const meta = plano.horas * 60
  const proxima = atividades.find((a) => !a.concluida)?.id
  const dias = diasDaSemana.filter((d) => (editando && plano.dias.includes(d)) || atividades.some((a) => a.dia === d))
  const semanaFeita = atividades.length > 0 && atividades.every((a) => a.concluida)
  const roadmapFeito = progressoGeral(roadmap, plano) >= 100
  const conflitos = diasDaSemana.filter((d) => atividades.filter((a) => a.dia === d).reduce((s, a) => s + a.minutos, 0) > LIMITE_DIA)

  function concluirEdicao() {
    // UC05.3, exceção do passo 4
    if (conflitos.length) return setErro(`Conflito: ${conflitos.join(', ')} passa de ${LIMITE_DIA / 60} h de estudo. Mova ou encurte alguma atividade.`)
    setErro('')
    setEditando(false)
    avisar({ texto: 'Plano atualizado.', tipo: 'sucesso' })
  }

  return (
    <>
      <TituloPagina titulo="Plano da semana" subtitulo={`${roadmap.nome} · ${plano.horas} h por semana`}>
        <SeletorMeta />
      </TituloPagina>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-borda bg-white px-4 py-3 text-xl">
          <ChevronLeft className="size-6 text-cinza-claro" aria-hidden="true" />
          {semanaAtual()}
          <ChevronRight className="size-6 text-cinza-claro" aria-hidden="true" />
        </div>
        <div className="flex flex-wrap gap-3">
          {editando ? (
            <Botao variante="primario" onClick={concluirEdicao} icone={<Check className="size-5" />}>Concluir edição</Botao>
          ) : (
            <>
              <Botao onClick={() => setEditando(true)} icone={<Pencil className="size-5" />}>Editar plano</Botao>
              <Botao variante="perigo" onClick={() => setExcluindo(true)} icone={<Trash2 className="size-5" />}>Excluir plano</Botao>
            </>
          )}
        </div>
      </div>

      <Card className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3" i={0}>
        <p className="flex items-center gap-3 text-3xl font-black">
          <Clock3 className="size-8 text-petroleo" />
          {formatarMinutos(minutos)} <span className="text-lg font-semibold text-cinza">de {formatarMinutos(meta)} nesta semana</span>
        </p>
        <Barra valor={Math.min(100, (minutos / meta) * 100)} className="min-w-40 flex-1" />
      </Card>

      <Trilha key={roadmap.id} compacta className="mt-6" marcos={etapas.map((e) => ({ rotulo: e.nome, estado: e.estado, detalhe: e.estado === 'atual' ? `${e.progresso}% da etapa` : e.estado === 'concluida' ? 'concluída' : undefined }))} />

      {semanaFeita && !editando && (
        <Card className="mt-6 flex flex-wrap items-center gap-5 border-ciano bg-ciano-suave" i={1}>
          <Mascote pose="comemorando" className="w-24" flutuando />
          <div className="flex-1">
            <h2 className="text-2xl font-black">{roadmapFeito ? 'Roadmap concluído!' : 'Semana concluída!'}</h2>
            <p className="text-lg text-cinza">{roadmapFeito ? 'Você chegou ao fim da trilha. Que tal uma avaliação final?' : 'Tudo marcado. A IA já pode puxar as próximas atividades do roadmap.'}</p>
          </div>
          {roadmapFeito ? (
            <Botao variante="primario" para="/avaliacao">Fazer avaliação</Botao>
          ) : (
            <Botao
              variante="primario"
              icone={<Sparkles className="size-5" />}
              onClick={() => {
                proximaSemana(roadmap.id)
                avisar({ texto: 'Próxima semana pronta!', tipo: 'festa' })
              }}
            >
              Gerar próxima semana
            </Botao>
          )}
        </Card>
      )}

      {editando && (
        <p className="anim-surgir mt-6 flex items-center gap-2 text-lg text-petroleo">
          <Pencil className="size-5" /> Mude o dia ou a duração de cada atividade.
        </p>
      )}
      {erro && (
        <p className="anim-tremer mt-3 flex items-center gap-2 rounded-xl bg-perigo-claro px-4 py-3 text-perigo">
          <AlertTriangle className="size-5" /> {erro}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dias.map((dia, i) => {
          const doDia = atividades.filter((a) => a.dia === dia)
          const total = doDia.reduce((s, a) => s + a.minutos, 0)
          return (
            <section key={dia} className={cx('anim-subir min-h-64 rounded-2xl border bg-white/60 p-3', conflitos.includes(dia) ? 'border-perigo' : 'border-borda')} style={atraso(i + 2)}>
              <h2 className="mb-3 flex items-baseline justify-center gap-2 text-2xl font-black">
                {dia} <span className={cx('text-sm font-semibold', conflitos.includes(dia) ? 'text-perigo' : 'text-cinza')}>{formatarMinutos(total)}</span>
              </h2>
              <div className="space-y-3">
                {doDia.map((a) => (
                  <CartaoAtividade key={a.id} atividade={a} atual={a.id === proxima} editando={editando} dias={plano.dias} onAlternar={() => alternarConclusao(a.id)} onEditar={(c) => (editarAtividade(a.id, c), setErro(''))} />
                ))}
                {doDia.length === 0 && <p className="py-6 text-center text-cinza">Dia livre</p>}
              </div>
            </section>
          )
        })}
      </div>

      <Confirmar
        aberto={excluindo}
        titulo="Excluir o plano de estudos?"
        texto="As atividades e o progresso desta semana serão perdidos. O roadmap continua aprovado e você pode gerar um novo plano depois."
        acao="Excluir plano"
        onCancelar={() => setExcluindo(false)}
        onConfirmar={() => {
          excluirPlano(roadmap.id)
          setExcluindo(false)
          avisar({ texto: 'Plano excluído.', tipo: 'info' })
        }}
      />
    </>
  )
}

function CartaoAtividade({ atividade: a, atual, editando, dias, onAlternar, onEditar }: { atividade: Atividade; atual: boolean; editando: boolean; dias: Dia[]; onAlternar: () => void; onEditar: (c: Partial<Pick<Atividade, 'dia' | 'minutos'>>) => void }) {
  return (
    <article className={cx('rounded-2xl border bg-white p-4 transition duration-300', atual && !editando ? 'border-2 border-petroleo bg-ciano-suave shadow-[0_10px_24px_-18px_rgba(11,127,160,0.7)]' : 'border-borda', a.concluida && 'opacity-80')}>
      <div className="flex gap-3">
        <button
          aria-label={a.concluida ? `Desmarcar ${a.titulo}` : `Concluir ${a.titulo}`}
          onClick={onAlternar}
          disabled={editando}
          className={cx('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90', a.concluida ? 'border-ciano bg-ciano text-white' : atual ? 'border-laranja hover:bg-laranja-claro' : 'border-ciano/60 hover:bg-ciano-suave')}
        >
          {a.concluida ? <Check key="ok" className="anim-carimbo size-4" strokeWidth={3.5} /> : atual && <span className="size-3 rounded-full bg-laranja" />}
        </button>
        <div className="min-w-0 flex-1">
          <h3 className={cx('text-lg leading-snug font-bold transition', a.concluida && 'text-tinta/60 line-through decoration-ciano decoration-2')}>{a.titulo}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Selo tom={a.reforco ? 'laranja' : 'ciano'}>{a.etapa}</Selo>
            {a.reforco && <span className="rounded-md border border-laranja/40 bg-laranja-claro px-2 py-0.5 text-xs font-semibold text-[#c2410c]">Reforço</span>}
          </div>
        </div>
      </div>
      {editando ? (
        <div className="mt-3 flex gap-2">
          <select value={a.dia} onChange={(e) => onEditar({ dia: e.target.value as Dia })} className="flex-1 rounded-md border border-borda bg-white px-2 py-1" aria-label="Dia">
            {[...new Set([...dias, a.dia])].sort((x, y) => ordemDia(x) - ordemDia(y)).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select value={a.minutos} onChange={(e) => onEditar({ minutos: Number(e.target.value) })} className="flex-1 rounded-md border border-borda bg-white px-2 py-1" aria-label="Duração">
            {[...new Set([30, 45, 60, 90, 120, 180, a.minutos])].sort((x, y) => x - y).map((m) => (
              <option key={m} value={m}>{formatarMinutos(m)}</option>
            ))}
          </select>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-cinza">
          <Clock3 className="size-5" />
          {formatarMinutos(a.minutos)}
        </p>
      )}
    </article>
  )
}
