import { ChevronDown, Target } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Ponto } from '../components/Trilha'
import { Anel, Barra, Card, cx, Mascote, TituloPagina } from '../components/ui'
import { useEstado } from '../data/estado'
import { historicoAnterior, progressoGeral, roadmaps, usuario } from '../data/mock'

// Tela 10 · UC06.4 Visualizar progresso geral, UC06.3 Visualizar histórico
export default function Progresso() {
  const { atividades } = useEstado()
  const [filtro, setFiltro] = useState('Todas')
  const etapas = roadmaps[0].etapas

  // Histórico cronológico: só atividades concluídas, da mais recente para a mais antiga
  const entradas = [
    ...atividades.filter((a) => a.concluida).map((a) => ({ data: a.concluidaEm ?? '', titulo: a.titulo, etapa: a.etapa, marco: false })),
    ...historicoAnterior,
  ]
    .sort((a, b) => ordemData(b.data) - ordemData(a.data))
    .filter((e) => filtro === 'Todas' || e.etapa === filtro)

  return (
    <>
      <TituloPagina titulo="Seu progresso" subtitulo="Acompanhe seu progresso geral e por etapa.">
        <Link to="/roadmaps" className="flex min-w-72 items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3">
          <Target className="size-9 text-petroleo" />
          <span className="flex-1">
            <span className="block text-cinza">Meta:</span>
            <span className="text-xl font-semibold">{usuario.meta}</span>
          </span>
          <ChevronDown className="size-6" />
        </Link>
      </TituloPagina>

      <Card className="grid items-center gap-8 p-8 md:grid-cols-[240px_1fr] md:divide-x md:divide-borda">
        <div className="flex justify-center">
          <Anel valor={progressoGeral} tamanho={210} espessura={18}>
            <span className="text-6xl font-black text-ciano">
              {progressoGeral}
              <span className="text-3xl">%</span>
            </span>
            <span className="text-xl font-bold">Geral</span>
          </Anel>
        </div>
        <ul className="space-y-5 md:pl-8">
          {etapas.map((e) => (
            <li key={e.nome} className="grid grid-cols-[28px_104px_minmax(0,1fr)_48px] items-center gap-3 sm:grid-cols-[36px_130px_1fr_56px] sm:gap-4">
              <Ponto estado={e.estado} pequeno />
              <span className="font-semibold sm:text-lg">{e.nome}</span>
              <Barra valor={e.progresso} cor={e.estado === 'atual' ? 'bg-laranja' : 'bg-ciano'} />
              <span className={cx('text-right text-xl font-bold', e.estado === 'atual' ? 'text-laranja' : e.progresso ? 'text-ciano' : 'text-cinza')}>{e.progresso}%</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6 p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-black">Histórico</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {['Todas', 'JavaScript', 'Fundamentos'].map((f) => (
              <button key={f} aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={cx('rounded-xl border-2 px-3 py-1.5 sm:px-5 sm:py-2 sm:text-lg', filtro === f ? 'border-ciano-claro bg-ciano-claro text-petroleo' : f === 'JavaScript' ? 'border-laranja/50' : 'border-petroleo/60')}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_220px]">
          <ol className="relative">
            {entradas.map((e, i) => (
              <li key={`${e.data}-${e.titulo}`} className="relative flex items-center gap-3 border-b border-borda py-4 last:border-0 sm:gap-6">
                {i < entradas.length - 1 && <span className="absolute top-1/2 left-[17px] h-full border-l-2 border-dashed border-ciano/60" />}
                <span className="relative">
                  <Ponto estado="concluida" pequeno />
                </span>
                <span className="w-14 text-lg text-cinza">{e.data}</span>
                <span className="min-w-0 flex-1 text-lg font-semibold">{e.titulo}</span>
                <span className={cx('hidden rounded-md px-3 py-1 text-sm font-semibold sm:inline', e.etapa === 'JavaScript' ? 'bg-laranja-claro text-[#c2410c]' : 'bg-ciano-claro text-petroleo')}>{e.etapa}</span>
              </li>
            ))}
            {entradas.length === 0 && <li className="py-4 text-lg text-cinza">Nenhuma atividade concluída nesta etapa.</li>}
          </ol>
          <Mascote className="mx-auto hidden w-44 self-center md:block" />
        </div>
      </Card>
    </>
  )
}

function ordemData(data: string) {
  const [d, m] = data.split('/').map(Number)
  return (m || 0) * 100 + (d || 0)
}
