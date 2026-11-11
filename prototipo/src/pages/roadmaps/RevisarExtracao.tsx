import { ArrowRight, FileText, Info, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Confirmar } from '../../components/Confirmar'
import { ProcessandoIA } from '../../components/ProcessandoIA'
import { atraso, Botao, Card, IconeRedondo, TituloPagina } from '../../components/ui'
import { useEstado } from '../../state/estado'

// UC03.3 Revisar informações extraídas · RF03.4 Excluir documento
export default function RevisarExtracao() {
  const navegar = useNavigate()
  const { rascunho, setRascunho, criarRoadmap, avisar } = useEstado()
  const [removendo, setRemovendo] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState('')

  const concluir = useCallback(() => {
    const id = criarRoadmap()
    avisar({ texto: 'Roadmap sugerido com base no seu material!', tipo: 'sucesso' })
    navegar(`/roadmaps/${id}`)
  }, [criarRoadmap, avisar, navegar])

  // Sem material não há o que revisar (ex.: F5 depois de gerar)
  if (!rascunho.arquivo && !rascunho.texto.trim() && !gerando) return <Navigate to="/roadmaps/novo" replace />

  return (
    <>
      <TituloPagina titulo="Revise o que a IA encontrou" subtitulo="Tire, corrija ou acrescente itens. Só o que ficar aqui vai para o roadmap." />
      <Card className="mb-5 flex flex-wrap items-center gap-4" i={0}>
        <IconeRedondo>
          <FileText className="size-6" />
        </IconeRedondo>
        <div className="flex-1">
          <p className="text-cinza">{rascunho.arquivo ? 'Documento' : 'Texto colado'}</p>
          <p className="text-xl font-semibold">{rascunho.arquivo ?? `${rascunho.texto.trim().slice(0, 60)}${rascunho.texto.trim().length > 60 ? '…' : ''}`}</p>
        </div>
        <Botao variante="perigo" icone={<Trash2 className="size-5" />} onClick={() => setRemovendo(true)}>
          Remover documento
        </Botao>
      </Card>
      <Card className="p-7" i={1}>
        <div className="grid gap-8 md:grid-cols-2 md:divide-x md:divide-borda">
          <ListaChips titulo="Conteúdos" itens={rascunho.conteudos} onMudar={(v) => (setRascunho({ conteudos: v }), setErro(''))} />
          <ListaChips titulo="Competências" itens={rascunho.competencias} onMudar={(v) => setRascunho({ competencias: v })} className="md:pl-8" />
        </div>
        {/* RNF12: instruções em documentos enviados são dados, não comandos */}
        <p className="mt-6 flex items-center gap-3 border-t border-borda pt-5 text-lg text-cinza">
          <Info className="size-6 shrink-0 text-petroleo" />
          <span>
            Confira antes de usar. Instruções no documento são tratadas como <b className="text-tinta">texto</b>, não como <b className="text-tinta">comando</b>.
          </span>
        </p>
      </Card>
      {erro && <p className="anim-tremer mt-4 text-right text-perigo">{erro}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-4">
        <Botao para="/roadmaps/novo" className="min-w-48 py-3.5 text-xl">Voltar</Botao>
        <Botao
          variante="primario"
          className="py-3.5 text-xl"
          iconeDepois={<ArrowRight className="size-6" />}
          onClick={() => (rascunho.conteudos.length ? setGerando(true) : setErro('Mantenha ao menos um conteúdo para gerar o roadmap.'))}
        >
          Confirmar e gerar roadmap
        </Botao>
      </div>

      <Confirmar
        aberto={removendo}
        titulo="Remover o documento?"
        texto="O arquivo e as informações extraídas dele são apagados. Seu objetivo continua."
        acao="Remover"
        onCancelar={() => setRemovendo(false)}
        onConfirmar={() => {
          setRascunho({ arquivo: null, texto: '', conteudos: [], competencias: [] })
          avisar({ texto: 'Documento e informações extraídas removidos.', tipo: 'info' })
          navegar('/roadmaps/novo')
        }}
      />
      {gerando && <ProcessandoIA titulo="A IA está montando sua trilha" passos={['Cruzando objetivo e documento', 'Escolhendo os conteúdos', 'Ordenando em etapas', 'Desenhando a trilha']} onConcluir={concluir} onCancelar={() => setGerando(false)} />}
    </>
  )
}

function ListaChips({ titulo, itens, onMudar, className }: { titulo: string; itens: string[]; onMudar: (v: string[]) => void; className?: string }) {
  const [novo, setNovo] = useState<string | null>(null)
  const adicionar = () => {
    if (novo?.trim() && !itens.includes(novo.trim())) onMudar([...itens, novo.trim()])
    setNovo(null)
  }
  return (
    <div className={className}>
      <h2 className="mb-4 text-2xl font-black">{titulo}</h2>
      <div className="flex flex-wrap gap-3">
        {itens.map((item, i) => (
          <span key={item} className="anim-pop inline-flex items-center gap-3 rounded-full bg-ciano-claro px-5 py-2.5 text-lg" style={atraso(i)}>
            {item}
            <button aria-label={`Remover ${item}`} onClick={() => onMudar(itens.filter((x) => x !== item))} className="transition hover:scale-125 hover:text-perigo">
              <X className="size-5" />
            </button>
          </span>
        ))}
        {novo === null ? (
          <button onClick={() => setNovo('')} className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-ciano px-5 py-2 text-lg font-semibold text-petroleo transition hover:bg-ciano-suave">
            <Plus className="size-5" /> Adicionar
          </button>
        ) : (
          <input autoFocus value={novo} onChange={(e) => setNovo(e.target.value)} onBlur={adicionar} onKeyDown={(e) => e.key === 'Enter' && adicionar()} className="rounded-full border-2 border-ciano px-5 py-2 text-lg outline-none" placeholder="Novo item" />
        )}
      </div>
    </div>
  )
}
