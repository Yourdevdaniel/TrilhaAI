import { ArrowLeft, ArrowRight, ChevronDown, Sparkles, Target } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Botao, Card, cx, Mascote } from '../components/ui'
import { questoes, usuario } from '../data/mock'

// Tela 11 · UC07.1 Gerar avaliação, UC07.2 Responder avaliação
export default function Avaliacao() {
  const navegar = useNavigate()
  const [atual, setAtual] = useState(0)
  const [respostas, setRespostas] = useState<(number | null)[]>(() => questoes.map(() => null))
  const [erro, setErro] = useState('')
  const q = questoes[atual]
  const ultima = atual === questoes.length - 1

  function avancar() {
    if (respostas[atual] === null) return setErro('Escolha uma resposta para continuar.')
    if (ultima) return navegar('/avaliacao/resultado')
    setAtual(atual + 1)
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Avaliação <span className="text-3xl font-semibold text-petroleo">· JavaScript</span>
        </h1>
        <Link to="/roadmaps" className="flex min-w-72 items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3">
          <Target className="size-9 text-petroleo" />
          <span className="flex-1">
            <span className="block text-cinza">Meta:</span>
            <span className="text-xl font-semibold">{usuario.meta}</span>
          </span>
          <ChevronDown className="size-6" />
        </Link>
      </div>

      <p className="text-2xl font-bold">
        Questão {atual + 1} de {questoes.length}
      </p>
      <div className="mt-3 mb-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${questoes.length}, minmax(0, 1fr))` }}>
        {questoes.map((_, i) => (
          <span key={i} className={cx('h-3 rounded-full', i <= atual ? 'bg-ciano' : 'bg-[#e8eef1]')} />
        ))}
      </div>

      <Card className="p-8">
        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{q.enunciado}</h2>
            {q.codigo && <pre className="mt-4 overflow-x-auto rounded-xl bg-ciano-suave px-5 py-4 font-mono text-lg leading-relaxed text-[#1e3a8a]">{q.codigo}</pre>}
          </div>
          <Mascote className="hidden w-36 self-start md:block" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2" role="radiogroup" aria-label="Respostas">
          {q.opcoes.map((op, i) => {
            const marcada = respostas[atual] === i
            return (
              <button
                key={op}
                role="radio"
                aria-checked={marcada}
                onClick={() => (setRespostas(respostas.map((r, j) => (j === atual ? i : r))), setErro(''))}
                className={cx('flex items-center gap-4 rounded-2xl border-2 px-6 py-6 text-left text-xl', marcada ? 'border-petroleo' : 'border-borda hover:border-ciano')}
              >
                <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full border-2', marcada ? 'border-petroleo bg-petroleo' : 'border-cinza-claro')}>{marcada && <span className="size-3 rounded-full bg-white" />}</span>
                <span className="font-mono">{op}</span>
              </button>
            )
          })}
        </div>
        {erro && <p className="mt-4 text-perigo">{erro}</p>}
        <div className="mt-8 flex justify-between border-t border-borda pt-6">
          <Botao onClick={() => setAtual(Math.max(0, atual - 1))} disabled={atual === 0} icone={<ArrowLeft className="size-5" />} className="py-3.5 text-xl">
            Anterior
          </Botao>
          <Botao variante="primario" onClick={avancar} iconeDepois={<ArrowRight className="size-5" />} className="py-3.5 text-xl sm:min-w-56">
            {ultima ? 'Enviar respostas' : 'Próxima'}
          </Botao>
        </div>
      </Card>
      <p className="mt-6 flex items-center justify-center gap-2 text-lg text-cinza">
        <Sparkles className="size-5 text-petroleo" /> Gerada pela IA com base no que você estudou.
      </p>
    </>
  )
}
