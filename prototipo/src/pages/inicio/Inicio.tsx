import { ArrowRight, BarChart3, Check, ChevronRight, FileText, Flag, Paperclip, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeletorMeta } from '../../components/SeletorMeta'
import { Ponto, Trilha } from '../../components/Trilha'
import { atraso, Botao, Card, cx, IconeRedondo, Mascote, Numero, Vazio } from '../../components/ui'
import { diasDaSemana, type Dia, type EstadoMarco } from '../../data/tipos'
import { etapaAvaliavel, formatarMinutos, minutosConcluidos, progressoGeral } from '../../state/calculos'
import { useAtivo, useEstado } from '../../state/estado'

const PROFICIENCIA = 70

// Início: progresso do roadmap ativo, o que estudar hoje e atalhos.
export default function Inicio() {
  const { usuario, roadmaps, alternarConclusao } = useEstado()
  const ativo = useAtivo()

  if (!roadmaps.length) {
    return (
      <>
        <h1 className="anim-subir text-5xl font-black tracking-tight">Olá, {usuario.nome}</h1>
        <Vazio titulo="Vamos traçar seu primeiro caminho?" texto="Conte seu objetivo e a IA sugere um roadmap em etapas. Você revisa e aprova antes de qualquer coisa.">
          <Botao variante="primario" para="/roadmaps/novo" icone={<Plus className="size-5" />} className="px-7 py-3.5 text-lg">
            Criar meu roadmap
          </Botao>
          <Botao para="/boas-vindas">Ver como funciona</Botao>
        </Vazio>
      </>
    )
  }

  if (!ativo?.plano) {
    const pendente = roadmaps.find((r) => r.status !== 'aprovado')
    const aprovadoSemPlano = roadmaps.find((r) => r.status === 'aprovado')
    return (
      <>
        <h1 className="anim-subir text-5xl font-black tracking-tight">Olá, {usuario.nome}</h1>
        {aprovadoSemPlano ? (
          <Vazio titulo="Falta só o plano" texto={`O roadmap "${aprovadoSemPlano.nome}" está aprovado. Diga quanto tempo você tem e a IA distribui as etapas na sua semana.`}>
            <Botao variante="primario" para={`/plano/novo?roadmap=${aprovadoSemPlano.id}`} iconeDepois={<ArrowRight className="size-5" />} className="px-7 py-3.5 text-lg">
              Gerar plano de estudos
            </Botao>
          </Vazio>
        ) : (
          <Vazio titulo="Seu roadmap espera aprovação" texto="Revise as etapas sugeridas pela IA e aprove para gerar o plano de estudos.">
            <Botao variante="primario" para={pendente ? `/roadmaps/${pendente.id}` : '/roadmaps'} iconeDepois={<ArrowRight className="size-5" />} className="px-7 py-3.5 text-lg">
              Revisar roadmap
            </Botao>
          </Vazio>
        )}
      </>
    )
  }

  const { roadmap, plano, etapas, resultado } = ativo
  const atividades = plano.atividades
  const pendentes = atividades.filter((a) => !a.concluida)
  const hoje = pendentes.slice(0, 2)
  const concluidas = atividades.filter((a) => a.concluida)
  const geral = progressoGeral(roadmap, plano)
  const proximaDia = pendentes[0]?.dia
  const avaliavel = etapaAvaliavel(etapas)
  const fraco = resultado?.porConteudo.filter((c) => c.valor < PROFICIENCIA).sort((a, b) => a.valor - b.valor)[0]

  const estadoDia = (dia: Dia): EstadoMarco | 'livre' => {
    const doDia = atividades.filter((a) => a.dia === dia)
    if (doDia.length === 0) return 'livre'
    if (doDia.every((a) => a.concluida)) return 'concluida'
    return dia === proximaDia ? 'atual' : 'futura'
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="anim-subir">
          <h1 className="text-5xl font-black tracking-tight">Olá, {usuario.nome}</h1>
          <p className="mt-2 text-xl text-cinza">Seu próximo passo já está no caminho.</p>
        </div>
        <SeletorMeta />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className="anim-subir" style={atraso(1)}>
            <h2 className="text-3xl font-black">
              Sua trilha{' '}
              <span className="ml-3 text-2xl text-petroleo">
                <Numero valor={geral} sufixo="%" />
              </span>{' '}
              <span className="text-xl font-semibold text-cinza">concluído</span>
            </h2>
            <Link to={`/roadmaps/${roadmap.id}`} aria-label="Abrir roadmap" className="block rounded-2xl transition hover:bg-white/60">
              <Trilha key={roadmap.id} className="mt-4" marcos={etapas.map((e) => ({ rotulo: e.nome, estado: e.estado, detalhe: e.estado === 'atual' ? `${e.progresso}% da etapa` : undefined }))} />
            </Link>
          </section>

          <section className="anim-subir grid gap-6 rounded-3xl bg-ciano-suave p-6 md:grid-cols-[220px_1fr]" style={atraso(2)}>
            <div className="relative flex flex-col items-center justify-end">
              <span className="relative mb-2 rounded-2xl border-2 border-ciano bg-white px-4 py-2 text-lg font-semibold text-petroleo">
                {pendentes.length ? 'Um passo de cada vez.' : 'Semana fechada!'}
                <span className="absolute -bottom-2 left-10 size-4 rotate-45 border-r-2 border-b-2 border-ciano bg-white" />
              </span>
              <Mascote pose={pendentes.length ? 'de-pe' : 'comemorando'} className="w-44" flutuando />
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-black">
                Hoje <span className="font-semibold text-cinza">· {formatarMinutos(hoje.reduce((s, a) => s + a.minutos, 0))}</span>
              </h3>
              <ul className="space-y-3">
                {hoje.map((a, i) => (
                  <li key={a.id} className="anim-subir flex items-center gap-4 rounded-2xl border border-borda bg-white px-4 py-3 transition hover:border-ciano" style={atraso(i + 3)}>
                    <button aria-label={`Marcar ${a.titulo} como concluída`} onClick={() => alternarConclusao(a.id)} className="group flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-cinza-claro transition hover:border-ciano hover:bg-ciano-suave">
                      <Check className="size-5 text-ciano opacity-0 transition group-hover:opacity-100" strokeWidth={3} />
                    </button>
                    <span className="flex-1 text-lg font-semibold">{a.titulo}</span>
                    <span className="text-cinza">{formatarMinutos(a.minutos)}</span>
                  </li>
                ))}
                {hoje.length === 0 && <li className="text-lg text-cinza">Tudo feito por esta semana. Abra o plano para gerar a próxima.</li>}
              </ul>
              <Botao variante="primario" para="/plano" className="mt-5 w-full py-3.5 text-xl" iconeDepois={<ArrowRight className="size-6" />}>
                {pendentes.length ? 'Continuar estudo' : 'Ir para o plano'}
              </Botao>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <Card className="flex gap-4" i={3}>
            <IconeRedondo>
              <Flag className="size-6" />
            </IconeRedondo>
            <div className="flex-1">
              <p className="text-cinza">Próximo checkpoint</p>
              <p className="text-xl font-bold">Avaliação de {avaliavel?.nome ?? etapas.find((e) => e.estado === 'atual')?.nome}</p>
              {avaliavel ? (
                <Botao para="/avaliacao" className="mt-3 w-full">Fazer agora</Botao>
              ) : (
                <p className="text-cinza">Libera ao concluir a primeira atividade.</p>
              )}
            </div>
          </Card>
          <Card className="flex gap-4" i={4}>
            <IconeRedondo>
              <BarChart3 className="size-6" />
            </IconeRedondo>
            <div className="flex-1">
              <p className="text-cinza">Último resultado</p>
              {resultado ? (
                <>
                  <p className="text-xl font-bold">
                    {resultado.etapa} · {resultado.geral}%
                  </p>
                  {fraco ? (
                    <>
                      <span className="mt-1 inline-block rounded-full bg-laranja-claro px-3 py-1 text-sm font-semibold text-[#c2410c]">Reforço em {fraco.conteudo}</span>
                      <Botao para="/avaliacao/resultado" className="mt-3 w-full">Ver reforço</Botao>
                      <p className="mt-2 text-sm text-cinza">Sua trilha não foi alterada.</p>
                    </>
                  ) : (
                    <span className="mt-1 inline-block rounded-full bg-ciano-claro px-3 py-1 text-sm font-semibold text-petroleo">Proficiência em tudo</span>
                  )}
                </>
              ) : (
                <p className="text-lg">Nenhuma avaliação ainda.</p>
              )}
            </div>
          </Card>
          <Card className="flex gap-4" i={5}>
            <IconeRedondo>
              <FileText className="size-6" />
            </IconeRedondo>
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

      <section className="anim-subir mt-8 border-t border-borda pt-6" style={atraso(6)}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl font-black">
            Esta semana{' '}
            <span className="ml-2 text-lg font-semibold text-cinza">
              {concluidas.length} {concluidas.length === 1 ? 'atividade concluída' : 'atividades concluídas'} · {formatarMinutos(minutosConcluidos(atividades))} estudadas
            </span>
          </h2>
          <Link to="/progresso" className="flex items-center text-lg font-semibold text-petroleo hover:underline">
            Ver histórico <ChevronRight className="size-5" />
          </Link>
        </div>
        <div className="mt-6 flex items-start justify-between">
          {diasDaSemana.map((dia, i) => {
            const estado = estadoDia(dia)
            return (
              <div key={dia} className="relative flex flex-1 flex-col items-center">
                {i > 0 && <span className="absolute top-4 right-1/2 left-[-50%] border-t-2 border-dashed border-ciano/60" />}
                <span className={cx('anim-pop relative')} style={atraso(i)}>
                  {estado === 'livre' ? <span className="mt-2 block size-5 rounded-full bg-borda" title="Sem estudo planejado" /> : <Ponto estado={estado} pequeno />}
                </span>
                <span className="mt-2 text-lg">{dia}</span>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
