import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ProcessandoIA } from '../../components/ProcessandoIA'
import { Ponto, Trilha } from '../../components/Trilha'
import { atraso, Botao, Card, cx, Mascote, TituloPagina, Vazio } from '../../components/ui'
import { cargaHoras } from '../../data/ia'
import { diasDaSemana, type Dia } from '../../data/tipos'
import { dataLonga, iso, semanasAte } from '../../state/calculos'
import { useEstado } from '../../state/estado'

const emSemanas = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n * 7)
  return iso(d)
}

// UC05.1 Gerar plano de estudos (só depois do roadmap aprovado)
export default function GerarPlano() {
  const navegar = useNavigate()
  const [params] = useSearchParams()
  const { roadmaps, planos, preferencias, criarPlano, avisar } = useEstado()
  const roadmap = roadmaps.find((r) => r.id === params.get('roadmap')) ?? roadmaps.find((r) => r.status === 'aprovado' && !planos[r.id])
  const [horas, setHoras] = useState(preferencias.horas)
  const [prazo, setPrazo] = useState(emSemanas(24))
  const [dias, setDias] = useState<Dia[]>(preferencias.dias)
  const [erro, setErro] = useState<{ texto: string; sobrecarga?: number } | null>(null)
  const [gerando, setGerando] = useState(false)

  const concluir = useCallback(() => {
    if (!roadmap) return
    criarPlano(roadmap.id, { horas, prazo, dias })
    avisar({ texto: 'Plano de estudos criado!', tipo: 'festa' })
    navegar('/plano')
  }, [roadmap, horas, prazo, dias, criarPlano, avisar, navegar])

  if (!roadmap || roadmap.status !== 'aprovado') {
    return (
      <Vazio titulo="Primeiro, aprove um roadmap" texto="O plano de estudos é gerado a partir de um roadmap aprovado (RF05 depende do RF04).">
        <Botao variante="primario" para="/roadmaps">Ver meus roadmaps</Botao>
      </Vazio>
    )
  }

  const semanas = semanasAte(prazo)
  const carga = cargaHoras(roadmap)
  const total = roadmap.etapas.reduce((s, e) => s + e.total, 0)
  // Arredonda pelo acumulado para a soma das etapas fechar com o total de semanas
  let acumulado = 0
  const porEtapa = roadmap.etapas.map((e) => {
    const antes = Math.round((acumulado / total) * semanas)
    acumulado += e.total
    return Math.round((acumulado / total) * semanas) - antes
  })

  function gerar() {
    // UC05.1, exceções do passo 4
    if (dias.length === 0) return setErro({ texto: 'Escolha ao menos um dia.' })
    if (!prazo || semanas < 2) return setErro({ texto: 'Escolha um prazo de pelo menos duas semanas.' })
    if (horas * semanas < carga) return setErro({ texto: `Sobrecarga: esse roadmap pede cerca de ${Math.round(carga)} h e o prazo comporta ${horas * semanas} h.`, sobrecarga: Math.ceil(carga / semanas) })
    setErro(null)
    setGerando(true)
  }

  return (
    <>
      <TituloPagina titulo="Monte seu plano de estudos" subtitulo="Defina sua disponibilidade e a IA distribui as etapas no tempo que você tem.">
        <div className="anim-pop flex items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3">
          <CheckCircle2 className="size-10 text-petroleo" />
          <span>
            <span className="block text-petroleo">Roadmap aprovado</span>
            <span className="text-lg font-semibold">{roadmap.nome}</span>
          </span>
        </div>
      </TituloPagina>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Trilha compacta marcos={roadmap.etapas.map((e) => ({ rotulo: e.nome, estado: 'futura' }))} />
          <Card className="mt-4 space-y-6 p-7" i={1}>
            <label className="block">
              <span className="mb-3 block text-xl font-bold">Horas por semana</span>
              <span className="flex items-center gap-4">
                <input type="range" min={1} max={30} step={1} value={horas} onChange={(e) => (setHoras(Number(e.target.value)), setErro(null))} className="flex-1 accent-ciano" />
                <span className="w-20 rounded-xl border border-borda py-2 text-center text-xl font-bold text-petroleo">{horas} h</span>
              </span>
            </label>
            <label className="block border-t border-borda pt-5">
              <span className="mb-3 block text-xl font-bold">Prazo</span>
              <span className="flex flex-wrap items-center gap-3">
                <span className="relative block w-full max-w-xs">
                  <CalendarDays className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-petroleo" />
                  <input type="date" value={prazo} onChange={(e) => (setPrazo(e.target.value), setErro(null))} className="w-full rounded-xl border border-borda py-3 pr-4 pl-13 text-xl outline-none focus:ring-4 focus:ring-ciano/20" />
                </span>
                {[12, 24, 48].map((n) => (
                  <button key={n} onClick={() => (setPrazo(emSemanas(n)), setErro(null))} className={cx('rounded-full border-2 px-4 py-1.5 font-semibold transition', prazo === emSemanas(n) ? 'border-ciano bg-ciano-claro text-petroleo' : 'border-borda hover:border-ciano')}>
                    {n / 4} meses
                  </button>
                ))}
              </span>
            </label>
            <fieldset className="border-t border-borda pt-5">
              <legend className="mb-3 text-xl font-bold">Dias preferidos</legend>
              <div className="flex flex-wrap gap-3">
                {diasDaSemana.map((d) => {
                  const ativo = dias.includes(d)
                  return (
                    <button key={d} aria-pressed={ativo} onClick={() => (setDias(ativo ? dias.filter((x) => x !== d) : [...dias, d]), setErro(null))} className={cx('w-20 rounded-xl border-2 py-3 text-lg font-semibold transition active:scale-95', ativo ? 'border-ciano bg-ciano-claro text-petroleo' : 'border-borda bg-white')}>
                      {d}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            {erro && (
              <div className="anim-tremer flex flex-wrap items-center gap-3 rounded-xl bg-perigo-claro px-4 py-3 text-perigo">
                <AlertTriangle className="size-5 shrink-0" />
                <span className="flex-1">{erro.texto}</span>
                {erro.sobrecarga && (
                  <button onClick={() => (setHoras(Math.min(30, erro.sobrecarga!)), setErro(null))} className="font-bold underline">
                    Usar {Math.min(30, erro.sobrecarga)} h por semana
                  </button>
                )}
              </div>
            )}
          </Card>
          <Botao variante="primario" onClick={gerar} className="mt-6 w-full py-4 text-2xl" iconeDepois={<ArrowRight className="size-6" />}>
            Gerar plano
          </Botao>
        </div>

        <Card className="p-7" i={2}>
          <h2 className="text-3xl font-black">Prévia</h2>
          <p className="mb-6 text-lg text-cinza">
            {semanas} semanas · {roadmap.etapas.length} etapas · até {prazo ? dataLonga(prazo) : '—'}
          </p>
          <ol className="space-y-5">
            {roadmap.etapas.map((e, i) => (
              <li key={e.nome} className="anim-subir flex items-start gap-4" style={atraso(i + 2)}>
                <Ponto estado="futura" pequeno />
                <span>
                  <span className="block text-lg font-bold">{e.nome}</span>
                  <span className="text-cinza">
                    {porEtapa[i]} {porEtapa[i] === 1 ? 'semana' : 'semanas'}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <Mascote className="mx-auto mt-6 w-32" flutuando />
        </Card>
      </div>

      {gerando && <ProcessandoIA titulo="A IA está montando seu plano" passos={['Somando a carga das etapas', 'Encaixando nas suas horas', 'Distribuindo pelos dias', 'Preparando a primeira semana']} onConcluir={concluir} onCancelar={() => setGerando(false)} />}
    </>
  )
}
