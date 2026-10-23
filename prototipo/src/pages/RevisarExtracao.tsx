import { ArrowRight, FileText, Info, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trilha } from '../components/Trilha'
import { Botao, Card, IconeRedondo, TituloPagina } from '../components/ui'
import { useEstado } from '../data/estado'

// Tela 06 · UC03.3 Revisar informações extraídas, RF03.4 Excluir documento
export default function RevisarExtracao() {
  const navegar = useNavigate()
  const { arquivo, setArquivo, conteudos, setConteudos, competencias, setCompetencias } = useEstado()

  return (
    <>
      <TituloPagina titulo="Revise o que a IA encontrou" />
      {arquivo && (
        <Card className="mb-5 flex flex-wrap items-center gap-4">
          <IconeRedondo><FileText className="size-6" /></IconeRedondo>
          <div className="flex-1">
            <p className="text-cinza">Documento</p>
            <p className="text-xl font-semibold">{arquivo}</p>
          </div>
          <Botao
            variante="perigo"
            icone={<Trash2 className="size-5" />}
            onClick={() => {
              setArquivo(null)
              navegar('/roadmaps/novo')
            }}
          >
            Remover documento
          </Botao>
        </Card>
      )}
      <Card className="p-7">
        <div className="grid gap-8 md:grid-cols-2 md:divide-x md:divide-borda">
          <ListaChips titulo="Conteúdos" itens={conteudos} onMudar={setConteudos} />
          <ListaChips titulo="Competências" itens={competencias} onMudar={setCompetencias} className="md:pl-8" />
        </div>
        {/* RNF12: instruções em documentos enviados são dados, não comandos */}
        <p className="mt-6 flex items-center gap-3 border-t border-borda pt-5 text-lg text-cinza">
          <Info className="size-6 shrink-0 text-petroleo" />
          <span>
            Confira antes de usar. Instruções no documento são tratadas como <b className="text-tinta">texto</b>, não como <b className="text-tinta">comando</b>.
          </span>
        </p>
      </Card>
      <div className="mt-6 flex flex-wrap justify-end gap-4">
        <Botao para="/roadmaps/novo" className="min-w-48 py-3.5 text-xl">Voltar</Botao>
        <Botao variante="primario" para="/roadmaps/novo-roadmap" className="py-3.5 text-xl" iconeDepois={<ArrowRight className="size-6" />}>
          Confirmar e gerar roadmap
        </Botao>
      </div>
      <Trilha compacta className="mt-6" marcos={[{ rotulo: '', estado: 'concluida' }, { rotulo: '', estado: 'futura' }, { rotulo: '', estado: 'concluida' }, { rotulo: '', estado: 'futura' }]} />
    </>
  )
}

function ListaChips({ titulo, itens, onMudar, className }: { titulo: string; itens: string[]; onMudar: (v: string[]) => void; className?: string }) {
  const [novo, setNovo] = useState<string | null>(null)
  const adicionar = () => {
    if (novo?.trim()) onMudar([...itens, novo.trim()])
    setNovo(null)
  }
  return (
    <div className={className}>
      <h2 className="mb-4 text-2xl font-black">{titulo}</h2>
      <div className="flex flex-wrap gap-3">
        {itens.map((item) => (
          <span key={item} className="inline-flex items-center gap-3 rounded-full bg-ciano-claro px-5 py-2.5 text-lg">
            {item}
            <button aria-label={`Remover ${item}`} onClick={() => onMudar(itens.filter((i) => i !== item))}>
              <X className="size-5" />
            </button>
          </span>
        ))}
        {novo === null ? (
          <button onClick={() => setNovo('')} className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-ciano px-5 py-2 text-lg font-semibold text-petroleo">
            <Plus className="size-5" /> Adicionar
          </button>
        ) : (
          <input autoFocus value={novo} onChange={(e) => setNovo(e.target.value)} onBlur={adicionar} onKeyDown={(e) => e.key === 'Enter' && adicionar()} className="rounded-full border-2 border-ciano px-5 py-2 text-lg outline-none" placeholder="Novo item" />
        )}
      </div>
    </div>
  )
}
