import { ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ponto, Trilha } from '../components/Trilha'
import { Botao, Card, cx, Mascote, TituloPagina } from '../components/ui'
import { useEstado } from '../data/estado'
import { diasDaSemana, roadmapGerado } from '../data/mock'

// Peso de cada etapa no plano, usado para dividir as semanas da prévia.
const pesos = [6, 8, 7, 5]

// Tela 08 · UC05.1 Gerar plano de estudos (só depois do roadmap aprovado)
export default function GerarPlano() {
  const navegar = useNavigate()
  const { criarPlano } = useEstado()
  const [horas, setHoras] = useState(6)
  const [prazo, setPrazo] = useState('2027-04-30')
  const [dias, setDias] = useState<string[]>(['Seg', 'Qua', 'Sex', 'Sáb'])
  const [erro, setErro] = useState('')

  const semanas = Math.max(1, Math.round((new Date(prazo).getTime() - new Date('2026-10-23').getTime()) / (7 * 24 * 3600 * 1000)))
  const total = pesos.reduce((a, b) => a + b, 0)
  // Arredonda pelo acumulado para a soma das etapas fechar com o total de semanas
  let acumulado = 0
  const porEtapa = pesos.map((p) => {
    const antes = Math.round((acumulado / total) * semanas)
    acumulado += p
    return Math.round((acumulado / total) * semanas) - antes
  })

  function gerar() {
    if (dias.length === 0) return setErro('Escolha ao menos um dia.')
    if (semanas < 2) return setErro('Escolha um prazo de pelo menos duas semanas.')
    criarPlano()
    navegar('/plano')
  }

  return (
    <>
      <TituloPagina titulo="Monte seu plano de estudos" subtitulo="Defina sua disponibilidade e deixe a IA criar um plano para você.">
        <div className="flex items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3">
          <CheckCircle2 className="size-10 text-petroleo" />
          <span>
            <span className="block text-petroleo">Roadmap aprovado</span>
            <span className="text-lg font-semibold">{roadmapGerado.nome}</span>
          </span>
        </div>
      </TituloPagina>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Trilha compacta marcos={roadmapGerado.etapas.map((e) => ({ rotulo: e.nome, estado: 'futura' }))} />
          <Card className="mt-4 space-y-6 p-7">
            <label className="block">
              <span className="mb-3 block text-xl font-bold">Horas por semana</span>
              <span className="flex items-center gap-4">
                <input type="range" min={1} max={20} step={1} value={horas} onChange={(e) => setHoras(Number(e.target.value))} className="flex-1 accent-ciano" />
                <span className="w-20 rounded-xl border border-borda py-2 text-center text-xl">{horas} h</span>
              </span>
            </label>
            <label className="block border-t border-borda pt-5">
              <span className="mb-3 block text-xl font-bold">Prazo</span>
              <span className="relative block max-w-sm">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-petroleo" />
                <input type="date" min="2026-11-06" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="w-full rounded-xl border border-borda py-3 pr-4 pl-13 text-xl outline-none focus:ring-4 focus:ring-ciano/20" />
              </span>
            </label>
            <fieldset className="border-t border-borda pt-5">
              <legend className="mb-3 text-xl font-bold">Dias preferidos</legend>
              <div className="flex flex-wrap gap-3">
                {diasDaSemana.map((d) => {
                  const ativo = dias.includes(d)
                  return (
                    <button key={d} aria-pressed={ativo} onClick={() => (setDias(ativo ? dias.filter((x) => x !== d) : [...dias, d]), setErro(''))} className={cx('w-20 rounded-xl border-2 py-3 text-lg font-semibold', ativo ? 'border-ciano bg-ciano-claro text-petroleo' : 'border-borda bg-white')}>
                      {d}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            {erro && <p className="text-perigo">{erro}</p>}
          </Card>
          <Botao variante="primario" onClick={gerar} className="mt-6 w-full py-4 text-2xl" iconeDepois={<ArrowRight className="size-6" />}>
            Gerar plano
          </Botao>
        </div>

        <Card className="p-7">
          <h2 className="text-3xl font-black">Prévia</h2>
          <p className="mb-6 text-lg text-cinza">
            {semanas} semanas · {roadmapGerado.etapas.length} etapas
          </p>
          <ol className="space-y-6">
            {roadmapGerado.etapas.map((e, i) => (
              <li key={e.nome} className="flex items-start gap-4">
                <Ponto estado="futura" pequeno />
                <span>
                  <span className="block text-lg font-bold">{e.nome}</span>
                  <span className="text-cinza">{porEtapa[i]} semanas</span>
                </span>
              </li>
            ))}
          </ol>
          <Mascote className="mx-auto mt-6 w-36" />
        </Card>
      </div>
    </>
  )
}
