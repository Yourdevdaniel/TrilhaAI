import { BarChart3, Check, ChevronRight, Clock3, Code2, FileText, List, MessageCircle, Paperclip, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Trilha } from '../components/Trilha'
import { Botao, Card, IconeRedondo, Selo, TituloPagina } from '../components/ui'
import { progressoGeral, roadmaps, type RoadmapResumo } from '../data/mock'

const icones = { codigo: Code2, conversa: MessageCircle, documento: FileText }

// Tela 04 · UC04.2 Visualizar roadmap (seleção de roadmaps)
export default function MeusRoadmaps() {
  return (
    <>
      <TituloPagina titulo="Seus roadmaps">
        <Botao variante="primario" para="/roadmaps/novo" className="px-7 py-3.5 text-xl" icone={<Plus className="size-6" />}>
          Novo roadmap
        </Botao>
      </TituloPagina>
      <div className="space-y-5">
        {roadmaps.map((r) => (
          <CardRoadmap key={r.id} roadmap={r} />
        ))}
      </div>
    </>
  )
}

function CardRoadmap({ roadmap: r }: { roadmap: RoadmapResumo }) {
  const Icone = icones[r.icone]
  return (
    <Card className="p-0">
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
          </div>
          <Trilha compacta className="mt-3" marcos={r.etapas.map((e) => ({ rotulo: e.nome, estado: e.estado }))} />
        </div>
      </div>
      <div className="mx-6 flex flex-wrap items-center gap-4 border-t border-borda py-4">
        {r.status === 'aprovado' && (
          <span className="flex items-center gap-2 text-lg">
            <IconeRedondo className="size-9"><BarChart3 className="size-5" /></IconeRedondo>
            <b className="text-petroleo">{progressoGeral}%</b> concluído
          </span>
        )}
        {r.origemEdital ? (
          <span className="flex items-center gap-2 text-lg text-cinza">
            <IconeRedondo className="size-9"><Paperclip className="size-5" /></IconeRedondo>
            Gerado a partir de edital (PDF)
          </span>
        ) : (
          <span className="flex items-center gap-2 text-lg">
            <IconeRedondo className="size-9"><List className="size-5" /></IconeRedondo>
            {r.etapas.length} etapas
          </span>
        )}
        <Link to={`/roadmaps/${r.id}`} className="ml-auto flex items-center text-xl font-bold text-petroleo">
          Abrir <ChevronRight className="size-6" />
        </Link>
      </div>
    </Card>
  )
}
