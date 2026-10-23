import { ArrowRight, BookOpen, ChevronDown, ChevronRight, FileText, GraduationCap, Info, PlayCircle, Target } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Trilha } from '../components/Trilha'
import { Anel, Botao, Card, cx, Mascote } from '../components/ui'
import { useEstado } from '../data/estado'
import { proficienciaMinima, resultado, roadmaps, usuario } from '../data/mock'

const iconesMaterial = { Artigo: FileText, Vídeo: PlayCircle, Documentação: BookOpen }

// Tela 12 · UC07.3 Corrigir, UC07.4 Visualizar resultado, UC08.1 a UC08.3 Reforço
export default function Resultado() {
  const navegar = useNavigate()
  const { adicionarRevisao, avisar } = useEstado()
  const r = resultado

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Resultado <span className="text-3xl font-semibold text-petroleo">· {r.avaliacao}</span>
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
      <Trilha compacta marcos={roadmaps[0].etapas.map((e) => ({ rotulo: e.nome, estado: e.estado, detalhe: e.estado === 'atual' ? `(${e.progresso}% da etapa)` : e.estado === 'concluida' ? '(concluída)' : undefined }))} />

      <div className="mt-4 grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card className="flex flex-col items-center p-6">
          <h2 className="mb-4 text-2xl font-black">Aproveitamento geral</h2>
          <Anel valor={r.geral} tamanho={250} espessura={26}>
            <span className="text-7xl font-black">
              {r.geral}
              <span className="text-4xl">%</span>
            </span>
            <Mascote pose="comemorando" className="-mb-8 w-28" />
          </Anel>
        </Card>
        <Card className="p-7">
          <h2 className="mb-6 text-2xl font-black">Por conteúdo</h2>
          <ul className="space-y-6">
            {r.porConteudo.map((c) => {
              const abaixo = c.valor < proficienciaMinima
              return (
                <li key={c.conteudo}>
                  <p className="mb-2 text-lg">{c.conteudo}</p>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <div className="h-3 rounded-full bg-ciano-suave">
                        <div className={cx('h-3 rounded-full', abaixo ? 'bg-laranja' : 'bg-petroleo')} style={{ width: `${c.valor}%` }} />
                      </div>
                      {/* Linha do mínimo de proficiência (70%) */}
                      <span className="absolute -top-3 -bottom-3 border-l-2 border-dashed border-ciano" style={{ left: `${proficienciaMinima}%` }} />
                    </div>
                    <span className={cx('w-16 text-2xl font-black', abaixo ? 'text-laranja' : 'text-petroleo')}>{c.valor}%</span>
                    <span className={cx('w-40 text-sm', !abaixo && 'invisible')}>
                      <span className="rounded-md border border-laranja/50 bg-laranja-claro px-2 py-1 font-semibold text-[#c2410c]">Precisa de reforço</span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-sm text-petroleo">Linha tracejada: mínimo de {proficienciaMinima}% de proficiência.</p>
        </Card>
      </div>

      <Card className="mt-5 grid gap-6 p-6 md:grid-cols-2 md:divide-x md:divide-borda">
        <div className="flex items-center gap-5">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-ciano-suave text-petroleo">
            <GraduationCap className="size-10" />
          </span>
          <div>
            <h3 className="text-2xl font-black">Reforço sugerido para {r.reforco.conteudo}</h3>
            <p className="mt-1 text-lg text-cinza">{r.reforco.revisao}</p>
          </div>
        </div>
        <ul className="md:pl-6">
          {r.reforco.materiais.map((m) => {
            const Icone = iconesMaterial[m.tipo as keyof typeof iconesMaterial]
            return (
              <li key={m.titulo} className="flex items-center gap-4 border-b border-borda py-3 last:border-0">
                <span className="flex size-10 items-center justify-center rounded-full bg-ciano-suave text-petroleo"><Icone className="size-5" /></span>
                <span className="flex-1 text-lg">
                  <b>{m.tipo}</b> · {m.titulo}
                </span>
                <ChevronRight className="size-5" />
              </li>
            )
          })}
        </ul>
      </Card>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Botao
          variante="primario"
          className="py-4 text-xl"
          iconeDepois={<ArrowRight className="size-6" />}
          onClick={() => {
            // A revisão só entra no plano por decisão do usuário: o resultado não altera nada sozinho
            adicionarRevisao(`Revisão: ${r.reforco.conteudo}`, r.avaliacao)
            avisar({ texto: 'Revisão adicionada ao plano' })
            navegar('/plano')
          }}
        >
          Adicionar revisão ao plano
        </Botao>
        <Botao para="/inicio" className="py-4 text-xl">Voltar ao início</Botao>
      </div>
      <p className="mt-5 flex items-center gap-3 rounded-2xl border border-borda bg-ciano-suave px-5 py-4 text-lg">
        <Info className="size-6 text-petroleo" /> Seu roadmap não muda sozinho. Você decide.
      </p>
    </>
  )
}
