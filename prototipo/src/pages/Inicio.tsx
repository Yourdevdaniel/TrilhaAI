import { ArrowRight, BarChart3, Check, ChevronDown, ChevronRight, FileText, Flag, Paperclip, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Ponto, Trilha } from '../components/Trilha'
import { Botao, Card, cx, IconeRedondo, Mascote } from '../components/ui'
import { formatarMinutos, useEstado } from '../data/estado'
import { diasDaSemana, progressoGeral, roadmaps, ultimoResultado, usuario, type EstadoMarco } from '../data/mock'

// Home A (discovery/home-codex/home-a.png): tela de progresso com o roadmap ativo no centro.
export default function Inicio() {
  const { atividades, alternarConclusao } = useEstado()
  const roadmap = roadmaps[0]
  const pendentes = atividades.filter((a) => !a.concluida)
  // "Hoje" mostra a próxima atividade do plano e a seguinte (RF06.1)
  const hoje = pendentes.slice(0, 2)
  const concluidas = atividades.filter((a) => a.concluida)
  const minutosEstudados = concluidas.reduce((s, a) => s + a.minutos, 0)
  const proximaDia = pendentes[0]?.dia

  const estadoDia = (dia: (typeof diasDaSemana)[number]): EstadoMarco | 'livre' => {
    const doDia = atividades.filter((a) => a.dia === dia)
    if (doDia.length === 0) return 'livre'
    if (doDia.every((a) => a.concluida)) return 'concluida'
    return dia === proximaDia ? 'atual' : 'futura'
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Olá, {usuario.nome}</h1>
          <p className="mt-2 text-xl text-cinza">Seu próximo passo já está no caminho.</p>
        </div>
        <Link to="/roadmaps" className="flex min-w-72 items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3 hover:border-ciano">
          <Target className="size-9 text-petroleo" />
          <span className="flex-1">
            <span className="block text-cinza">Meta:</span>
            <span className="text-xl font-semibold">{usuario.meta}</span>
          </span>
          <ChevronDown className="size-6" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="text-3xl font-black">
              Sua trilha <span className="ml-3 text-2xl text-petroleo">{progressoGeral}%</span> <span className="text-xl font-semibold text-cinza">concluído</span>
            </h2>
            <Link to={`/roadmaps/${roadmap.id}`} aria-label="Abrir roadmap">
              <Trilha className="mt-4" marcos={roadmap.etapas.map((e) => ({ rotulo: e.nome, estado: e.estado, detalhe: e.estado === 'atual' ? `${e.progresso}% da etapa` : undefined }))} />
            </Link>
          </section>

          <section className="grid gap-6 rounded-3xl bg-ciano-suave p-6 md:grid-cols-[220px_1fr]">
            <div className="relative flex flex-col items-center justify-end">
              <span className="relative mb-2 rounded-2xl border-2 border-ciano bg-white px-4 py-2 text-lg font-semibold text-petroleo">
                Um passo de cada vez.
                <span className="absolute -bottom-2 left-10 size-4 rotate-45 border-r-2 border-b-2 border-ciano bg-white" />
              </span>
              <Mascote className="w-44" />
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-black">
                Hoje <span className="font-semibold text-cinza">· {formatarMinutos(hoje.reduce((s, a) => s + a.minutos, 0))}</span>
              </h3>
              <ul className="space-y-3">
                {hoje.map((a) => (
                  <li key={a.id} className="flex items-center gap-4 rounded-2xl border border-borda bg-white px-4 py-3">
                    <button aria-label={`Marcar ${a.titulo} como concluída`} onClick={() => alternarConclusao(a.id)} className={cx('flex size-8 shrink-0 items-center justify-center rounded-full border-2', a.concluida ? 'border-ciano bg-ciano text-white' : 'border-cinza-claro')}>
                      {a.concluida && <Check className="size-5" strokeWidth={3} />}
                    </button>
                    <span className="flex-1 text-lg font-semibold">{a.titulo}</span>
                    <span className="text-cinza">{formatarMinutos(a.minutos)}</span>
                  </li>
                ))}
                {hoje.length === 0 && <li className="text-lg text-cinza">Tudo feito por hoje.</li>}
              </ul>
              <Botao variante="primario" para="/plano" className="mt-5 w-full py-3.5 text-xl" iconeDepois={<ArrowRight className="size-6" />}>
                Continuar estudo
              </Botao>
              <Link to="/plano" className="mt-3 block text-center text-lg text-petroleo underline">
                Ver plano da semana
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <Card className="flex gap-4">
            <IconeRedondo><Flag className="size-6" /></IconeRedondo>
            <div>
              <p className="text-cinza">Próximo checkpoint</p>
              <p className="text-xl font-bold">Quiz de JavaScript</p>
              <p className="text-cinza">Após concluir 3 conteúdos.</p>
            </div>
          </Card>
          <Card className="flex gap-4">
            <IconeRedondo><BarChart3 className="size-6" /></IconeRedondo>
            <div className="flex-1">
              <p className="text-cinza">Último resultado</p>
              <p className="text-xl font-bold">
                {ultimoResultado.conteudo} · {ultimoResultado.aproveitamento}%
              </p>
              <span className="mt-1 inline-block rounded-full bg-laranja-claro px-3 py-1 text-sm font-semibold text-[#c2410c]">Revisão recomendada</span>
              {/* A revisão de CSS Grid já está no plano da semana (sábado) */}
              <Botao para="/plano" className="mt-3 w-full">Ver revisão</Botao>
              <p className="mt-2 text-sm text-cinza">Sua trilha não foi alterada.</p>
            </div>
          </Card>
          <Card className="flex gap-4">
            <IconeRedondo><FileText className="size-6" /></IconeRedondo>
            <div className="flex-1">
              <p className="text-cinza">Contexto da meta</p>
              <p className="text-lg">Use uma vaga ou edital para refinar sugestões.</p>
              <Botao para="/roadmaps/novo" className="mt-3 w-full text-base" icone={<Paperclip className="size-5" />}>
                Anexar PDF ou texto
              </Botao>
            </div>
          </Card>
        </aside>
      </div>

      <section className="mt-8 border-t border-borda pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl font-black">
            Esta semana{' '}
            <span className="ml-2 text-lg font-semibold text-cinza">
              {concluidas.length} atividades concluídas · {formatarMinutos(minutosEstudados)} estudadas
            </span>
          </h2>
          <Link to="/progresso" className="flex items-center text-lg font-semibold text-petroleo">
            Ver histórico <ChevronRight className="size-5" />
          </Link>
        </div>
        <div className="mt-6 flex items-start justify-between">
          {diasDaSemana.map((dia, i) => {
            const estado = estadoDia(dia)
            return (
              <div key={dia} className="relative flex flex-1 flex-col items-center">
                {i > 0 && <span className="absolute top-4 right-1/2 left-[-50%] border-t-2 border-dashed border-ciano/60" />}
                <span className="relative">{estado === 'livre' ? <span className="mt-2 block size-5 rounded-full bg-borda" title="Sem estudo planejado" /> : <Ponto estado={estado} pequeno />}</span>
                <span className="mt-2 text-lg">{dia}</span>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
