import { Check, Hourglass, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Confirmar } from '../components/Confirmar'
import { Trilha } from '../components/Trilha'
import { Botao, Card, Mascote, Selo } from '../components/ui'
import { useEstado } from '../data/estado'
import { progressoGeral, roadmapGerado, roadmaps } from '../data/mock'

// Tela 07 · UC04.2 Visualizar, UC04.3 Editar, UC04.4 Excluir e UC04.5 Aprovar roadmap
export default function Roadmap() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { statusNovoRoadmap, aprovarNovoRoadmap } = useEstado()
  const base = id === 'novo-roadmap' ? { ...roadmapGerado, status: statusNovoRoadmap } : roadmaps.find((r) => r.id === id)
  const [etapas, setEtapas] = useState(base?.etapas ?? [])
  const [editando, setEditando] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  if (!base) return <Navigate to="/roadmaps" replace />
  const aprovado = base.status === 'aprovado'
  // Antes da aprovação não existe plano, logo não existe progresso (RF05 depende de RF04)
  const comProgresso = aprovado && base.id === 'front-end'

  const editar = (iEtapa: number, iConteudo: number, valor: string) =>
    setEtapas(etapas.map((e, i) => (i === iEtapa ? { ...e, conteudos: e.conteudos.map((c, j) => (j === iConteudo ? valor : c)) } : e)))

  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">{base.nome}</h1>
          <div className="mt-3">
            {aprovado ? (
              <Selo tom="petroleo" icone={<Check className="size-4" strokeWidth={3} />}>Aprovado</Selo>
            ) : base.status === 'rascunho' ? (
              <Selo tom="cinza">Rascunho</Selo>
            ) : (
              <Selo tom="amarelo" icone={<Hourglass className="size-4" />}>Aguardando aprovação</Selo>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Botao onClick={() => setEditando(editando ? null : 'todas')} icone={<Pencil className="size-5" />}>
            {editando ? 'Concluir edição' : 'Editar etapas'}
          </Botao>
          <Botao variante="perigo" onClick={() => setConfirmando(true)} icone={<Trash2 className="size-5" />}>
            Excluir roadmap
          </Botao>
          {!aprovado && (
            <Botao
              variante="primario"
              onClick={() => {
                if (id === 'novo-roadmap') aprovarNovoRoadmap()
                navegar('/plano/novo')
              }}
            >
              Aprovar roadmap
            </Botao>
          )}
        </div>
      </div>

      {comProgresso && (
        <h2 className="text-3xl font-black">
          Sua trilha <span className="ml-3 text-2xl text-petroleo">{progressoGeral}%</span> <span className="text-xl font-semibold text-cinza">concluído</span>
        </h2>
      )}
      <Trilha
        className="mt-4"
        marcos={etapas.map((e) => ({
          rotulo: e.nome,
          estado: comProgresso ? e.estado : 'futura',
          detalhe: comProgresso ? (e.estado === 'atual' ? `${e.progresso}% da etapa` : e.estado === 'concluida' ? 'Concluída' : 'Pendente') : undefined,
        }))}
      />

      {!aprovado && (
        <p className="my-4 flex items-center gap-3 text-lg">
          <Mascote className="w-14" />
          <b className="text-petroleo">Sugestão da IA.</b> Você pode ajustar tudo antes de aprovar.
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {etapas.map((etapa, i) => (
          <Card key={etapa.nome} className="p-5">
            <h3 className="text-2xl font-black">{etapa.nome}</h3>
            <p className="mb-4 text-lg text-petroleo">{etapa.conteudos.length ? `${etapa.conteudos.length} conteúdos` : 'Conteúdos a gerar'}</p>
            <ul className="space-y-3">
              {etapa.conteudos.map((c, j) => (
                <li key={j} className="flex items-center gap-2 rounded-xl border border-borda px-4 py-3">
                  {editando ? (
                    <input value={c} onChange={(e) => editar(i, j, e.target.value)} className="min-w-0 flex-1 rounded-md bg-ciano-suave px-2 py-1 outline-none" aria-label={`Conteúdo ${j + 1} de ${etapa.nome}`} />
                  ) : (
                    <span className="flex-1">{c}</span>
                  )}
                  <button aria-label={`Editar ${c}`} onClick={() => setEditando('todas')} className="text-petroleo">
                    <Pencil className="size-5" />
                  </button>
                </li>
              ))}
              {editando && (
                <li>
                  <button onClick={() => setEtapas(etapas.map((e, k) => (k === i ? { ...e, conteudos: [...e.conteudos, 'Novo conteúdo'] } : e)))} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ciano py-2 font-semibold text-petroleo">
                    <Plus className="size-5" /> Conteúdo
                  </button>
                </li>
              )}
            </ul>
          </Card>
        ))}
      </div>

      <Confirmar
        aberto={confirmando}
        titulo="Excluir este roadmap?"
        texto={aprovado ? 'O plano de estudos ligado a ele também deixa de existir.' : 'A sugestão da IA será descartada.'}
        acao="Excluir roadmap"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={() => navegar('/roadmaps')}
      />
    </>
  )
}
