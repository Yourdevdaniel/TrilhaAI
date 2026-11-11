import { ArrowLeft, ArrowRight, BarChart3, CalendarDays, CheckCircle2, Map, MessageSquareText, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ponto } from '../../components/Trilha'
import { atraso, Botao, cx, Mascote, Wordmark } from '../../components/ui'
import { diasDaSemana, type Dia } from '../../data/tipos'
import { useEstado } from '../../state/estado'

const sugestoes = [
  { rotulo: 'Front-end', texto: 'Quero ser desenvolvedor(a) front-end júnior em 6 meses.' },
  { rotulo: 'Análise de dados', texto: 'Quero trabalhar com análise de dados usando Python.' },
  { rotulo: 'Inglês', texto: 'Quero falar inglês com confiança em entrevistas de emprego.' },
  { rotulo: 'Concurso', texto: 'Quero passar no concurso do Banco do Brasil em 2027.' },
]

const comoFunciona = [
  { icone: MessageSquareText, titulo: 'Conte seu objetivo', texto: 'Em texto livre. Se tiver, anexe o edital ou a vaga.' },
  { icone: Map, titulo: 'A IA monta o roadmap', texto: 'Etapas e conteúdos na ordem certa. Você edita e aprova.' },
  { icone: CalendarDays, titulo: 'Vira um plano semanal', texto: 'Distribuído nas horas e no prazo que você tem.' },
  { icone: BarChart3, titulo: 'Estude, marque e se avalie', texto: 'Abaixo de 70%, a IA sugere revisão e materiais.' },
]

const TOTAL = 4

// Onboarding depois do cadastro: apresenta o fluxo e já colhe objetivo e disponibilidade.
export default function BoasVindas() {
  const navegar = useNavigate()
  const { usuario, preferencias, concluirOnboarding } = useEstado()
  const [passo, setPasso] = useState(0)
  const [objetivo, setObjetivo] = useState('')
  const [horas, setHoras] = useState(preferencias.horas)
  const [dias, setDias] = useState<Dia[]>(preferencias.dias)
  const [erro, setErro] = useState('')

  function avancar() {
    if (passo === 2 && !objetivo.trim()) return setErro('Escreva ou escolha um objetivo.')
    if (passo === 3 && dias.length === 0) return setErro('Escolha ao menos um dia.')
    setErro('')
    if (passo < TOTAL - 1) return setPasso(passo + 1)
    concluirOnboarding({ objetivo, horas, dias })
    navegar('/roadmaps/novo')
  }

  return (
    <div className="flex min-h-screen flex-col bg-ciano-suave">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Wordmark className="text-3xl" />
        <button onClick={() => navegar('/inicio')} className="text-lg font-semibold text-cinza hover:text-tinta">
          Pular
        </button>
      </header>

      {/* Progresso do onboarding como uma mini trilha */}
      <div className="mx-auto flex w-full max-w-md items-center px-6" aria-label={`Passo ${passo + 1} de ${TOTAL}`}>
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <Ponto estado={i < passo ? 'concluida' : i === passo ? 'atual' : 'futura'} pequeno />
            {i < TOTAL - 1 && (
              <span className="relative mx-1 h-0 flex-1 border-t-[3px] border-dashed border-ciano/40">
                <span className="absolute -top-[3px] left-0 h-0 border-t-[3px] border-dashed border-ciano transition-all duration-500" style={{ width: i < passo ? '100%' : '0%' }} />
              </span>
            )}
          </div>
        ))}
      </div>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div key={passo} className="anim-pagina w-full max-w-3xl">
          {passo === 0 && (
            <div className="grid items-center gap-8 md:grid-cols-[1fr_280px]">
              <div>
                <p className="anim-subir text-xl font-semibold text-petroleo">Bem-vindo(a), {usuario.nome}!</p>
                <h1 className="anim-subir mt-2 text-5xl leading-tight font-black md:text-6xl" style={atraso(1)}>
                  Seu objetivo vira <span className="text-laranja">caminho</span>.
                </h1>
                <p className="anim-subir mt-5 text-xl text-cinza" style={atraso(2)}>
                  O TrilhaAi usa Inteligência Artificial para transformar o que você quer aprender em um roadmap e em um plano que cabe na sua semana. Você aprova cada passo.
                </p>
              </div>
              <Mascote pose="de-pe" className="anim-subir mx-auto w-56 md:w-full" flutuando />
            </div>
          )}

          {passo === 1 && (
            <div>
              <h1 className="text-center text-4xl font-black md:text-5xl">Como funciona</h1>
              <ol className="mt-8 grid gap-4 sm:grid-cols-2">
                {comoFunciona.map(({ icone: Icone, titulo, texto }, i) => (
                  <li key={titulo} className="anim-subir flex gap-4 rounded-2xl border border-borda bg-white p-5" style={atraso(i + 1)}>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ciano-claro text-petroleo">
                      <Icone className="size-6" />
                    </span>
                    <span>
                      <span className="text-sm font-bold text-laranja">Passo {i + 1}</span>
                      <span className="block text-xl font-black">{titulo}</span>
                      <span className="text-cinza">{texto}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="anim-subir mt-6 flex items-center justify-center gap-2 text-center text-lg text-cinza" style={atraso(6)}>
                <CheckCircle2 className="size-5 text-petroleo" /> Nada muda na sua trilha sem a sua aprovação.
              </p>
            </div>
          )}

          {passo === 2 && (
            <div className="rounded-3xl border border-borda bg-white p-6 md:p-10">
              <h1 className="text-4xl font-black">Aonde você quer chegar?</h1>
              <p className="mt-2 text-lg text-cinza">Escreva do seu jeito ou comece por uma sugestão.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {sugestoes.map((s, i) => (
                  <button
                    key={s.rotulo}
                    onClick={() => (setObjetivo(s.texto), setErro(''))}
                    className={cx('anim-pop rounded-full border-2 px-5 py-2 text-lg font-semibold transition', objetivo === s.texto ? 'border-petroleo bg-ciano-claro text-petroleo' : 'border-borda hover:border-ciano')}
                    style={atraso(i)}
                  >
                    {s.rotulo}
                  </button>
                ))}
              </div>
              <textarea
                value={objetivo}
                onChange={(e) => (setObjetivo(e.target.value), setErro(''))}
                rows={3}
                autoFocus
                className="mt-5 w-full rounded-xl border border-ciano/50 px-5 py-4 text-xl outline-none transition focus:ring-4 focus:ring-ciano/20"
                placeholder="Ex.: quero ser desenvolvedor(a) back-end em 1 ano."
              />
            </div>
          )}

          {passo === 3 && (
            <div className="rounded-3xl border border-borda bg-white p-6 md:p-10">
              <h1 className="text-4xl font-black">Quanto tempo você tem?</h1>
              <p className="mt-2 text-lg text-cinza">Usamos isso para montar seu plano. Dá para mudar depois.</p>
              <label className="mt-8 block">
                <span className="mb-3 flex items-baseline justify-between text-xl font-bold">
                  Horas por semana <span className="text-4xl font-black text-petroleo">{horas} h</span>
                </span>
                <input type="range" min={1} max={20} value={horas} onChange={(e) => setHoras(Number(e.target.value))} className="w-full accent-ciano" />
              </label>
              <fieldset className="mt-8">
                <legend className="mb-3 text-xl font-bold">Dias preferidos</legend>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {diasDaSemana.map((d) => {
                    const ativo = dias.includes(d)
                    return (
                      <button key={d} aria-pressed={ativo} onClick={() => (setDias(ativo ? dias.filter((x) => x !== d) : [...dias, d]), setErro(''))} className={cx('w-16 rounded-xl border-2 py-3 text-lg font-semibold transition active:scale-95 sm:w-20', ativo ? 'border-ciano bg-ciano-claro text-petroleo' : 'border-borda bg-white')}>
                        {d}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {erro && <p className="anim-tremer mt-4 text-center text-lg text-perigo">{erro}</p>}

          <div className="mt-8 flex items-center justify-between gap-4">
            <Botao onClick={() => setPasso(passo - 1)} className={cx('py-3.5 text-lg', passo === 0 && 'invisible')} icone={<ArrowLeft className="size-5" />}>
              Voltar
            </Botao>
            <Botao variante="primario" onClick={avancar} className="py-3.5 text-lg sm:min-w-56" icone={passo === TOTAL - 1 ? <Sparkles className="size-5" /> : undefined} iconeDepois={passo < TOTAL - 1 ? <ArrowRight className="size-5" /> : undefined}>
              {passo === 0 ? 'Começar' : passo === TOTAL - 1 ? 'Criar minha trilha' : 'Continuar'}
            </Botao>
          </div>
        </div>
      </main>
    </div>
  )
}
