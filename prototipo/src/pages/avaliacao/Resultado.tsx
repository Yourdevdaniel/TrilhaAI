import { ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, FileText, GraduationCap, Info, PartyPopper, PlayCircle, RotateCcw, Sparkles, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProcessandoIA } from '../../components/ProcessandoIA'
import { SeletorMeta } from '../../components/SeletorMeta'
import { Trilha } from '../../components/Trilha'
import { Anel, atraso, Barra, Botao, Card, cx, Mascote, Numero, Vazio } from '../../components/ui'
import { reforcoPara } from '../../data/ia'
import { dataLonga } from '../../state/calculos'
import { useAtivo, useEstado } from '../../state/estado'

const PROFICIENCIA = 70
const iconesMaterial = { Artigo: FileText, Vídeo: PlayCircle, Exercícios: BookOpen }

// UC07.4 Visualizar resultado · UC08.1 Identificar reforço · UC08.2 Recomendar revisão · UC08.3 Recomendar materiais
export default function Resultado() {
  const navegar = useNavigate()
  const ativo = useAtivo()
  const { adicionarRevisoes, avisar, celebrar } = useEstado()
  const [pedido, setPedido] = useState<'revisao' | 'materiais' | null>(null)
  const [revelado, setRevelado] = useState({ revisao: false, materiais: false })
  const [gabarito, setGabarito] = useState(false)
  const festejou = useRef(false)

  const r = ativo?.resultado
  const fracos = r?.porConteudo.filter((c) => c.valor < PROFICIENCIA) ?? []

  useEffect(() => {
    // Comemora uma vez quando não há nada abaixo do mínimo
    if (r && fracos.length === 0 && !festejou.current) {
      festejou.current = true
      celebrar()
    }
  }, [r, fracos.length, celebrar])

  const concluirPedido = useCallback(() => {
    if (pedido) setRevelado((v) => ({ ...v, [pedido]: true }))
    setPedido(null)
  }, [pedido])

  if (!ativo || !r) {
    return (
      <Vazio titulo="Nenhum resultado ainda" texto="Faça uma avaliação para ver seu aproveitamento por conteúdo.">
        <Botao variante="primario" para="/avaliacao">Fazer avaliação</Botao>
      </Vazio>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="anim-subir">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Resultado <span className="text-3xl font-semibold text-petroleo">· {r.etapa}</span>
          </h1>
          <p className="mt-1 text-lg text-cinza">Corrigida em {dataLonga(r.data)}</p>
        </div>
        <SeletorMeta />
      </div>
      <Trilha compacta marcos={ativo.etapas.map((e) => ({ rotulo: e.nome, estado: e.estado, detalhe: e.estado === 'atual' ? `${e.progresso}%` : undefined }))} />

      <div className="mt-4 grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card className="flex flex-col items-center p-6" i={0}>
          <h2 className="mb-4 text-2xl font-black">Aproveitamento geral</h2>
          <Anel valor={r.geral} tamanho={240} espessura={24} cor={r.geral >= PROFICIENCIA ? '#1ec8e8' : '#ff5a1f'}>
            <span className="text-7xl font-black">
              <Numero valor={r.geral} />
              <span className="text-4xl">%</span>
            </span>
            <Mascote pose={r.geral >= PROFICIENCIA ? 'comemorando' : 'de-pe'} className="-mb-8 w-24" />
          </Anel>
          {r.questoes && (
            <p className="mt-10 text-lg text-cinza">
              {r.questoes.filter((q, i) => r.respostas?.[i] === q.correta).length} de {r.questoes.length} questões certas
            </p>
          )}
        </Card>
        <Card className="p-7" i={1}>
          <h2 className="mb-6 text-2xl font-black">Por conteúdo</h2>
          <ul className="space-y-6">
            {r.porConteudo.map((c, i) => {
              const abaixo = c.valor < PROFICIENCIA
              return (
                <li key={c.conteudo} className="anim-subir" style={atraso(i + 2)}>
                  <p className="mb-2 text-lg">{c.conteudo}</p>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Barra valor={c.valor} cor={abaixo ? 'bg-laranja' : 'bg-petroleo'} />
                      {/* Linha do mínimo de proficiência (70%) */}
                      <span className="absolute -top-3 -bottom-3 border-l-2 border-dashed border-ciano" style={{ left: `${PROFICIENCIA}%` }} />
                    </div>
                    <span className={cx('w-16 text-2xl font-black', abaixo ? 'text-laranja' : 'text-petroleo')}>{c.valor}%</span>
                    <span className="hidden w-40 text-sm sm:block">
                      {abaixo ? (
                        <span className="anim-pop inline-block rounded-md border border-laranja/50 bg-laranja-claro px-2 py-1 font-semibold text-[#c2410c]" style={atraso(i + 4)}>Precisa de reforço</span>
                      ) : (
                        <span className="anim-pop inline-flex items-center gap-1 rounded-md bg-ciano-claro px-2 py-1 font-semibold text-petroleo" style={atraso(i + 4)}><Check className="size-4" /> Proficiente</span>
                      )}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-sm text-petroleo">Linha tracejada: mínimo de {PROFICIENCIA}% de proficiência.</p>
        </Card>
      </div>

      {fracos.length === 0 ? (
        // UC08.1, exceção: nenhum conteúdo abaixo de 70%
        <Card className="mt-5 flex flex-wrap items-center gap-5 border-ciano bg-ciano-suave" i={3}>
          <PartyPopper className="size-12 text-laranja" />
          <div className="flex-1">
            <h3 className="text-2xl font-black">Proficiência em todos os conteúdos</h3>
            <p className="text-lg text-cinza">Nenhum conteúdo ficou abaixo de {PROFICIENCIA}%. Siga para a próxima etapa da trilha.</p>
          </div>
          <Botao variante="primario" para="/plano" iconeDepois={<ArrowRight className="size-5" />}>Voltar ao plano</Botao>
        </Card>
      ) : (
        <Card className="mt-5 p-6" i={3}>
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-laranja-claro text-[#c2410c]">
              <GraduationCap className="size-8" />
            </span>
            <div className="flex-1">
              <h3 className="text-2xl font-black">Reforço sugerido para {fracos.map((f) => f.conteudo).join(' e ')}</h3>
              <p className="text-lg text-cinza">A IA só sugere. Sua trilha não muda sozinha.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-borda p-5">
              <h4 className="text-xl font-black">Roteiro de revisão</h4>
              {revelado.revisao ? (
                <ul className="mt-3 space-y-3">
                  {fracos.map((f, i) => (
                    <li key={f.conteudo} className="anim-subir text-lg" style={atraso(i)}>{reforcoPara(f.conteudo).revisao}</li>
                  ))}
                </ul>
              ) : (
                <Botao className="mt-4" icone={<Sparkles className="size-5" />} onClick={() => setPedido('revisao')}>Pedir revisão à IA</Botao>
              )}
            </div>
            <div className="rounded-2xl border border-borda p-5">
              <h4 className="text-xl font-black">Materiais de reforço</h4>
              {revelado.materiais ? (
                <ul className="mt-2">
                  {fracos.flatMap((f) => reforcoPara(f.conteudo).materiais).map((m, i) => {
                    const Icone = iconesMaterial[m.tipo]
                    return (
                      <li key={m.titulo} className="anim-subir" style={atraso(i)}>
                        <button onClick={() => avisar({ texto: `Abrindo "${m.titulo}"…`, tipo: 'info' })} className="group flex w-full items-center gap-4 border-b border-borda py-3 text-left last:border-0">
                          <span className="flex size-10 items-center justify-center rounded-full bg-ciano-suave text-petroleo"><Icone className="size-5" /></span>
                          <span className="flex-1 text-lg">
                            <b>{m.tipo}</b> · {m.titulo}
                          </span>
                          <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <Botao className="mt-4" icone={<Sparkles className="size-5" />} onClick={() => setPedido('materiais')}>Sugerir materiais</Botao>
              )}
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Botao
              variante="primario"
              className="py-4 text-xl"
              iconeDepois={<ArrowRight className="size-6" />}
              onClick={() => {
                // A revisão só entra no plano por decisão do usuário: o resultado não altera nada sozinho
                adicionarRevisoes(fracos.map((f) => f.conteudo), r.etapa)
                avisar({ texto: 'Revisão adicionada ao plano.', tipo: 'sucesso' })
                navegar('/plano')
              }}
            >
              Adicionar revisão ao plano
            </Botao>
            <Botao para="/avaliacao" className="py-4 text-xl" icone={<RotateCcw className="size-5" />}>Refazer avaliação</Botao>
          </div>
        </Card>
      )}

      {r.questoes && r.respostas && (
        <Card className="mt-5 p-0" i={4}>
          <button onClick={() => setGabarito(!gabarito)} aria-expanded={gabarito} className="flex w-full items-center justify-between px-6 py-5 text-left">
            <span className="text-2xl font-black">Gabarito comentado</span>
            <ChevronDown className={cx('size-6 transition-transform duration-300', gabarito && 'rotate-180')} />
          </button>
          {gabarito && (
            <ol className="space-y-4 border-t border-borda px-6 py-5">
              {r.questoes.map((q, i) => {
                const certo = r.respostas![i] === q.correta
                return (
                  <li key={i} className="anim-subir flex gap-4" style={atraso(i)}>
                    <span className={cx('mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-white', certo ? 'bg-ciano' : 'bg-laranja')}>{certo ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}</span>
                    <div>
                      <p className="text-lg font-bold">{i + 1}. {q.enunciado}</p>
                      <p className="text-cinza">
                        Resposta certa: <b className="font-mono text-tinta">{q.opcoes[q.correta]}</b>
                        {!certo && r.respostas![i] >= 0 && <> · você marcou <span className="font-mono">{q.opcoes[r.respostas![i]]}</span></>}
                      </p>
                      <p className="mt-1 text-petroleo">{q.explicacao}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </Card>
      )}

      <p className="mt-5 flex items-center gap-3 rounded-2xl border border-borda bg-ciano-suave px-5 py-4 text-lg">
        <Info className="size-6 shrink-0 text-petroleo" /> Seu roadmap não muda sozinho. Você decide.
      </p>

      {pedido && (
        <ProcessandoIA
          titulo={pedido === 'revisao' ? 'A IA está montando sua revisão' : 'A IA está buscando materiais'}
          passos={pedido === 'revisao' ? ['Analisando os erros', 'Achando as lacunas', 'Escrevendo o roteiro'] : ['Lendo os tópicos com lacuna', 'Selecionando referências', 'Separando exercícios']}
          onConcluir={concluirPedido}
          onCancelar={() => setPedido(null)}
        />
      )}
    </>
  )
}
