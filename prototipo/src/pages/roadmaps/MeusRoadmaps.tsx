import { BarChart3, BookOpen, Check, ChevronRight, Clock3, Code2, Database, FileText, List, MessageCircle, Paperclip, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Trilha } from '../../components/Trilha'
import { Botao, Card, IconeRedondo, Selo, TituloPagina, Vazio } from '../../components/ui'
import type { Roadmap } from '../../data/tipos'
import { etapasComProgresso, progressoGeral } from '../../state/calculos'
import { useEstado } from '../../state/estado'

const icones = { codigo: Code2, conversa: MessageCircle, documento: FileText, dados: Database, livro: BookOpen }

// UC04.2 Visualizar roadmap (seleção de roadmaps)
export default function MeusRoadmaps() {
  const { roadmaps } = useEstado()
  return (
    <>
      <TituloPagina titulo="Seus roadmaps">
        <Botao variante="primario" para="/roadmaps/novo" className="px-7 py-3.5 text-xl" icone={<Plus className="size-6" />}>
          Novo roadmap
        </Botao>
      </TituloPagina>
      {roadmaps.length === 0 ? (
        <Vazio titulo="Nenhum roadmap ainda" texto="Crie o primeiro: a IA transforma seu objetivo em etapas.">
          <Botao variante="primario" para="/roadmaps/novo" icone={<Plus className="size-5" />}>Novo roadmap</Botao>
        </Vazio>
      ) : (
        <div className="space-y-5">
          {roadmaps.map((r, i) => (
            <CardRoadmap key={r.id} roadmap={r} i={i} />
          ))}
        </div>
      )}
    </>
  )
}

function CardRoadmap({ roadmap: r, i }: { roadmap: Roadmap; i: number }) {
  const { planos, ativoId } = useEstado()
  const plano = planos[r.id]
  const Icone = icones[r.icone]
  const etapas = etapasComProgresso(r, plano)
  return (
    <Card className="p-0 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(11,127,160,0.5)]" i={i}>
      <div className="flex gap-5 p-6 pb-2">
        <IconeRedondo className="hidden size-20 sm:flex [&>svg]:size-9">
          <Icone />
        </IconeRedondo>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black">{r.nome}</h2>
            {r.status === 'aprovado' && <Selo tom="petroleo" icone={<Check className="size-4" strokeWidth={3} />}>Aprovado</Selo>}
            {r.status === 'aguardando' && <Selo tom="contorno" icone={<Clock3 className="size-4" />}>Aguardando aprovação</Selo>}
            {r.status === 'rascunho' && <Selo tom="cinza" icone={<FileText className="size-4" />}>Rascunho</Selo>}
            {r.id === ativoId && <Selo tom="laranja">Meta ativa</Selo>}
          </div>
          <Trilha compacta className="mt-3" marcos={etapas.map((e) => ({ rotulo: e.nome, estado: e.estado }))} />
        </div>
      </div>
      <div className="mx-6 flex flex-wrap items-center gap-4 border-t border-borda py-4">
        {plano && (
          <span className="flex items-center gap-2 text-lg">
            <IconeRedondo className="size-9">
              <BarChart3 className="size-5" />
            </IconeRedondo>
            <b className="text-petroleo">{progressoGeral(r, plano)}%</b> concluído
          </span>
        )}
        {r.origem ? (
          <span className="flex items-center gap-2 text-lg text-cinza">
            <IconeRedondo className="size-9">
              <Paperclip className="size-5" />
            </IconeRedondo>
            {r.origem === 'pdf' ? 'Gerado com edital ou vaga (PDF)' : 'Gerado com texto de apoio'}
          </span>
        ) : (
          <span className="flex items-center gap-2 text-lg">
            <IconeRedondo className="size-9">
              <List className="size-5" />
            </IconeRedondo>
            {r.etapas.length} etapas
          </span>
        )}
        <Link to={`/roadmaps/${r.id}`} className="group ml-auto flex items-center text-xl font-bold text-petroleo">
          Abrir <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  )
}
