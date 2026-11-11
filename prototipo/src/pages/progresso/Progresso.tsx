import { CalendarClock, Clock3, Flag } from 'lucide-react'
import { useState } from 'react'
import { SeletorMeta } from '../../components/SeletorMeta'
import { Ponto } from '../../components/Trilha'
import { Anel, atraso, Barra, Botao, Card, cx, Mascote, Numero, TituloPagina, Vazio } from '../../components/ui'
import { dataLonga, formatarData, formatarMinutos, minutosConcluidos, progressoGeral, semanasAte } from '../../state/calculos'
import { cargaHoras } from '../../data/ia'
import { useAtivo } from '../../state/estado'

// UC06.4 Visualizar progresso geral · UC06.3 Visualizar histórico
export default function Progresso() {
  const ativo = useAtivo()
  const [filtro, setFiltro] = useState('Todas')

  if (!ativo?.plano) {
    return (
      <Vazio titulo="Ainda sem progresso para mostrar" texto="O progresso é calculado a partir das atividades do plano de estudos. Gere um plano e conclua a primeira atividade.">
        <Botao variante="primario" para="/plano">Ir para o plano</Botao>
      </Vazio>
    )
  }

  const { roadmap, plano, etapas } = ativo
  const geral = progressoGeral(roadmap, plano)
  const semanasRestantes = semanasAte(plano.prazo)
  const etapasRestantes = etapas.filter((e) => e.estado !== 'concluida').length
  // Comparativo com o prazo: horas que faltam no ritmo atual cabem nas semanas que restam?
  const semanasNecessarias = Math.ceil((cargaHoras(roadmap) * (1 - geral / 100)) / plano.horas)
  const noRitmo = semanasNecessarias <= semanasRestantes

  // Histórico cronológico: concluídas desta semana + marcos anteriores, da mais recente para a mais antiga
  const entradas = [...plano.atividades.filter((a) => a.concluida).map((a) => ({ data: a.concluidaEm ?? '', titulo: a.titulo, etapa: a.etapa })), ...(plano.historico ?? [])]
    .sort((a, b) => b.data.localeCompare(a.data))
  const filtros = ['Todas', ...new Set(entradas.map((e) => e.etapa))]
  const visiveis = entradas.filter((e) => filtro === 'Todas' || e.etapa === filtro)

  return (
    <>
      <TituloPagina titulo="Seu progresso" subtitulo="Acompanhe seu progresso geral e por etapa.">
        <SeletorMeta />
      </TituloPagina>

      <Card className="grid items-center gap-8 p-8 md:grid-cols-[240px_1fr] md:divide-x md:divide-borda" i={0}>
        <div className="flex justify-center">
          <Anel valor={geral} tamanho={210} espessura={18}>
            <span className="text-6xl font-black text-ciano">
              <Numero valor={geral} />
              <span className="text-3xl">%</span>
            </span>
            <span className="text-xl font-bold">Geral</span>
          </Anel>
        </div>
        <ul className="space-y-5 md:pl-8">
          {etapas.map((e, i) => (
            <li key={e.nome} className="anim-subir grid grid-cols-[28px_104px_minmax(0,1fr)_48px] items-center gap-3 sm:grid-cols-[36px_150px_1fr_56px] sm:gap-4" style={atraso(i + 1)}>
              <Ponto estado={e.estado} pequeno />
              <span className="truncate font-semibold sm:text-lg">{e.nome}</span>
              <Barra valor={e.progresso} cor={e.estado === 'atual' ? 'bg-laranja' : 'bg-ciano'} />
              <span className={cx('text-right text-xl font-bold', e.estado === 'atual' ? 'text-laranja' : e.progresso ? 'text-ciano' : 'text-cinza')}>{e.progresso}%</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4" i={1}>
          <Clock3 className="size-9 shrink-0 text-petroleo" />
          <div>
            <p className="text-cinza">Horas nesta semana</p>
            <p className="text-2xl font-black">
              {formatarMinutos(minutosConcluidos(plano.atividades))} <span className="text-base font-semibold text-cinza">de {plano.horas} h</span>
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4" i={2}>
          <CalendarClock className="size-9 shrink-0 text-petroleo" />
          <div>
            <p className="text-cinza">Prazo · {dataLonga(plano.prazo)}</p>
            <p className="text-2xl font-black">
              {semanasRestantes} semanas <span className={cx('text-base font-semibold', noRitmo ? 'text-petroleo' : 'text-laranja')}>{noRitmo ? '· no ritmo' : '· atenção ao ritmo'}</span>
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4" i={3}>
          <Flag className="size-9 shrink-0 text-petroleo" />
          <div>
            <p className="text-cinza">Etapas restantes</p>
            <p className="text-2xl font-black">
              {etapasRestantes} <span className="text-base font-semibold text-cinza">de {etapas.length}</span>
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6 md:p-8" i={4}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-black">Histórico</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filtros.map((f) => (
              <button key={f} aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={cx('rounded-xl border-2 px-3 py-1.5 transition sm:px-5 sm:py-2 sm:text-lg', filtro === f ? 'border-ciano-claro bg-ciano-claro text-petroleo' : 'border-borda hover:border-ciano')}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_220px]">
          <ol className="relative">
            {visiveis.map((e, i) => (
              <li key={`${e.data}-${e.titulo}`} className="anim-subir relative flex items-center gap-3 border-b border-borda py-4 last:border-0 sm:gap-6" style={atraso(i)}>
                {i < visiveis.length - 1 && <span className="absolute top-1/2 left-[13px] h-full border-l-2 border-dashed border-ciano/60" />}
                <span className="relative">
                  <Ponto estado="concluida" pequeno />
                </span>
                <span className="w-14 text-lg text-cinza">{formatarData(e.data)}</span>
                <span className="min-w-0 flex-1 text-lg font-semibold">{e.titulo}</span>
                <span className="hidden rounded-md bg-ciano-claro px-3 py-1 text-sm font-semibold text-petroleo sm:inline">{e.etapa}</span>
              </li>
            ))}
            {visiveis.length === 0 && <li className="py-4 text-lg text-cinza">Nenhuma atividade concluída ainda. Marque a primeira no plano da semana.</li>}
          </ol>
          <Mascote className="mx-auto hidden w-44 self-center md:block" flutuando />
        </div>
      </Card>
    </>
  )
}
