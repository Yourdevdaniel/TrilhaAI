import { ArrowLeft, ArrowRight, ClipboardCheck, ListChecks, Send, Sparkles, Timer } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProcessandoIA } from '../../components/ProcessandoIA'
import { SeletorMeta } from '../../components/SeletorMeta'
import { atraso, Botao, Card, cx, Mascote, Vazio } from '../../components/ui'
import { corrigir, gerarQuestoes } from '../../data/ia'
import { etapaAvaliavel, hojeISO } from '../../state/calculos'
import { useAtivo, useEstado } from '../../state/estado'

type Fase = 'inicio' | 'gerando' | 'respondendo' | 'corrigindo'

// UC07.1 Gerar avaliação · UC07.2 Responder avaliação · UC07.3 Corrigir avaliação
export default function Avaliacao() {
  const navegar = useNavigate()
  const ativo = useAtivo()
  const { salvarResultado } = useEstado()
  const [fase, setFase] = useState<Fase>('inicio')
  const [atual, setAtual] = useState(0)
  const [respostas, setRespostas] = useState<(number | null)[]>([])
  const [erro, setErro] = useState('')

  const etapa = ativo ? etapaAvaliavel(ativo.etapas) : undefined
  const questoes = useMemo(() => (ativo && etapa ? gerarQuestoes(ativo.roadmap, etapa) : []), [ativo, etapa])

  const corrigida = useCallback(() => {
    if (!ativo || !etapa) return
    const finais = respostas.map((r) => r ?? -1)
    salvarResultado({ roadmapId: ativo.roadmap.id, etapa: etapa.nome, ...corrigir(questoes, finais), questoes, respostas: finais, data: hojeISO() })
    navegar('/avaliacao/resultado')
  }, [ativo, etapa, respostas, questoes, salvarResultado, navegar])

  const comecar = useCallback(() => {
    setRespostas(questoes.map(() => null))
    setAtual(0)
    setFase('respondendo')
  }, [questoes])

  if (!ativo?.plano) {
    return (
      <Vazio titulo="Avaliações vêm depois do plano" texto="A avaliação cobre os conteúdos previstos no plano de estudos. Gere um plano e estude a primeira etapa.">
        <Botao variante="primario" para="/plano">Ir para o plano</Botao>
      </Vazio>
    )
  }

  if (!etapa) {
    return (
      <Vazio titulo="Conclua uma atividade primeiro" texto="A IA gera a avaliação a partir do que você já estudou. Marque ao menos uma atividade como concluída no plano.">
        <Botao variante="primario" para="/plano">Abrir o plano</Botao>
      </Vazio>
    )
  }

  if (fase === 'inicio' || fase === 'gerando') {
    return (
      <>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <h1 className="anim-subir text-4xl font-black tracking-tight md:text-5xl">Avaliações</h1>
          <SeletorMeta />
        </div>
        <Card className="grid items-center gap-8 p-8 md:grid-cols-[1fr_220px]" i={0}>
          <div>
            <p className="font-semibold text-petroleo">{ativo.roadmap.nome}</p>
            <h2 className="mt-1 text-4xl font-black">Avaliação de {etapa.nome}</h2>
            <p className="mt-3 text-lg text-cinza">A IA monta questões sobre os conteúdos que você estudou nesta etapa. O resultado mostra o aproveitamento por conteúdo e, abaixo de 70%, sugere revisão.</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-lg">
              <li className="flex items-center gap-2"><ListChecks className="size-5 text-petroleo" /> {questoes.length} questões</li>
              <li className="flex items-center gap-2"><Timer className="size-5 text-petroleo" /> cerca de {Math.max(5, questoes.length * 2)} min</li>
              <li className="flex items-center gap-2"><ClipboardCheck className="size-5 text-petroleo" /> mínimo de 70%</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {etapa.conteudos.map((c, i) => (
                <span key={c} className="anim-pop rounded-full bg-ciano-claro px-4 py-1.5 font-semibold text-petroleo" style={atraso(i)}>{c}</span>
              ))}
            </div>
            <Botao variante="primario" onClick={() => setFase('gerando')} className="mt-8 px-8 py-4 text-xl" icone={<Sparkles className="size-6" />}>
              Gerar avaliação
            </Botao>
            {ativo.resultado && (
              <Botao variante="texto" para="/avaliacao/resultado" className="mt-8 ml-4 text-lg">
                Ver último resultado
              </Botao>
            )}
          </div>
          <Mascote pose="de-pe" className="mx-auto w-48" flutuando />
        </Card>
        {fase === 'gerando' && <ProcessandoIA titulo="A IA está criando sua avaliação" passos={['Lendo os conteúdos da etapa', 'Escrevendo as questões', 'Montando o gabarito', 'Conferindo as questões']} onConcluir={comecar} onCancelar={() => setFase('inicio')} />}
      </>
    )
  }

  const q = questoes[atual]
  const ultima = atual === questoes.length - 1
  const respondidas = respostas.filter((r) => r !== null).length

  function enviar() {
    // UC07.2, exceção do passo 6: questão em branco
    const brancas = respostas.map((r, i) => (r === null ? i + 1 : 0)).filter(Boolean)
    if (brancas.length) {
      setAtual(brancas[0] - 1)
      return setErro(`Faltam responder: questão ${brancas.join(', ')}.`)
    }
    setFase('corrigindo')
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Avaliação <span className="text-3xl font-semibold text-petroleo">· {etapa.nome}</span>
        </h1>
        <p className="rounded-full bg-ciano-suave px-4 py-2 text-lg font-semibold text-petroleo">
          {respondidas} de {questoes.length} respondidas
        </p>
      </div>

      <p className="text-2xl font-bold">
        Questão {atual + 1} de {questoes.length} <span className="text-lg font-semibold text-cinza">· {q.conteudo}</span>
      </p>
      <div className="mt-3 mb-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${questoes.length}, minmax(0, 1fr))` }}>
        {questoes.map((_, i) => (
          <button key={i} aria-label={`Ir para a questão ${i + 1}`} onClick={() => setAtual(i)} className={cx('h-3 rounded-full transition-all duration-300 hover:scale-y-150', i === atual ? 'bg-laranja' : respostas[i] !== null ? 'bg-ciano' : 'bg-[#e8eef1]')} />
        ))}
      </div>

      <Card className="p-6 md:p-8">
        <div key={atual} className="anim-pagina">
          <div className="flex gap-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold">{q.enunciado}</h2>
              {q.codigo && <pre className="mt-4 overflow-x-auto rounded-xl bg-ciano-suave px-5 py-4 font-mono text-lg leading-relaxed text-[#1e3a8a]">{q.codigo}</pre>}
            </div>
            <Mascote className="hidden w-32 self-start md:block" />
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
                  className={cx('anim-subir flex items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left text-xl transition duration-200 active:scale-[0.98]', marcada ? 'border-petroleo bg-ciano-suave' : 'border-borda hover:-translate-y-0.5 hover:border-ciano')}
                  style={atraso(i)}
                >
                  <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition', marcada ? 'border-petroleo bg-petroleo' : 'border-cinza-claro')}>{marcada && <span className="anim-pop size-3 rounded-full bg-white" />}</span>
                  <span className={cx(q.codigo || /^[<'"\w.()[\]-]+$/.test(op) ? 'font-mono' : '')}>{op}</span>
                </button>
              )
            })}
          </div>
        </div>
        {erro && <p className="anim-tremer mt-4 text-perigo">{erro}</p>}
        <div className="mt-8 flex justify-between border-t border-borda pt-6">
          <Botao onClick={() => setAtual(Math.max(0, atual - 1))} disabled={atual === 0} icone={<ArrowLeft className="size-5" />} className="py-3.5 text-xl">
            Anterior
          </Botao>
          {ultima ? (
            <Botao variante="primario" onClick={enviar} icone={<Send className="size-5" />} className="py-3.5 text-xl sm:min-w-56">
              Enviar respostas
            </Botao>
          ) : (
            <Botao variante="primario" onClick={() => setAtual(atual + 1)} iconeDepois={<ArrowRight className="size-5" />} className="py-3.5 text-xl sm:min-w-56">
              Próxima
            </Botao>
          )}
        </div>
      </Card>
      <p className="mt-6 flex items-center justify-center gap-2 text-lg text-cinza">
        <Sparkles className="size-5 text-petroleo" /> Gerada pela IA com base no que você estudou. Suas respostas ficam salvas enquanto responde.
      </p>
      {fase === 'corrigindo' && <ProcessandoIA titulo="A IA está corrigindo" passos={['Conferindo as respostas', 'Calculando por conteúdo', 'Comparando com o mínimo de 70%', 'Preparando recomendações']} onConcluir={corrigida} onCancelar={() => setFase('respondendo')} />}
    </>
  )
}
