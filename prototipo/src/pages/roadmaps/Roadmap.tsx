import { ArrowRight, CalendarDays, Check, Hourglass, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Confirmar } from '../../components/Confirmar'
import { Trilha } from '../../components/Trilha'
import { atraso, Botao, Card, cx, Mascote, Numero, Selo } from '../../components/ui'
import type { Etapa } from '../../data/tipos'
import { etapasComProgresso, progressoGeral } from '../../state/calculos'
import { useEstado } from '../../state/estado'

// UC04.2 Visualizar · UC04.3 Editar · UC04.4 Excluir · UC04.5 Aprovar roadmap
export default function Roadmap() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { roadmaps, planos, aprovarRoadmap, excluirRoadmap, salvarEtapas, setAtivo, avisar } = useEstado()
  const roadmap = roadmaps.find((r) => r.id === id)
  const [rascunho, setRascunho] = useState<Etapa[] | null>(null)
  const [erro, setErro] = useState('')
  const [excluindo, setExcluindo] = useState(false)

  if (!roadmap) return <Navigate to="/roadmaps" replace />
  const plano = planos[roadmap.id]
  const aprovado = roadmap.status === 'aprovado'
  const etapas = etapasComProgresso(roadmap, plano)
  const editando = rascunho !== null
  const lista = rascunho ?? roadmap.etapas

  const mudarEtapa = (i: number, f: (e: Etapa) => Etapa) => setRascunho(lista.map((e, k) => (k === i ? f(e) : e)))

  function salvar() {
    if (!rascunho) return
    // UC04.3, exceção do passo 4: não aceita campo vazio
    if (rascunho.some((e) => !e.nome.trim() || e.conteudos.some((c) => !c.trim()))) return setErro('É obrigatório ter as novas informações.')
    salvarEtapas(roadmap!.id, rascunho.map((e) => ({ ...e, nome: e.nome.trim(), conteudos: e.conteudos.map((c) => c.trim()) })))
    setRascunho(null)
    setErro('')
    avisar({ texto: 'Roadmap atualizado.', tipo: 'sucesso' })
  }

  function aprovar() {
    aprovarRoadmap(roadmap!.id)
    avisar({ texto: 'Roadmap aprovado! Agora monte o plano.', tipo: 'festa' })
    navegar(`/plano/novo?roadmap=${roadmap!.id}`)
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="anim-subir min-w-0">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">{roadmap.nome}</h1>
          <p className="mt-2 text-lg text-cinza">“{roadmap.objetivo}”</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {aprovado ? (
              <Selo tom="petroleo" icone={<Check className="size-4" strokeWidth={3} />}>Aprovado</Selo>
            ) : roadmap.status === 'rascunho' ? (
              <Selo tom="cinza">Rascunho</Selo>
            ) : (
              <Selo tom="amarelo" icone={<Hourglass className="size-4" />}>Aguardando aprovação</Selo>
            )}
            {roadmap.competencias?.map((c) => (
              <Selo key={c} tom="ciano">{c}</Selo>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {editando ? (
            <>
              <Botao onClick={() => (setRascunho(null), setErro(''))} icone={<X className="size-5" />}>Cancelar</Botao>
              <Botao variante="primario" onClick={salvar} icone={<Check className="size-5" />}>Salvar alterações</Botao>
            </>
          ) : (
            <>
              <Botao onClick={() => setRascunho(roadmap.etapas)} icone={<Pencil className="size-5" />}>Editar etapas</Botao>
              <Botao variante="perigo" onClick={() => setExcluindo(true)} icone={<Trash2 className="size-5" />}>Excluir</Botao>
              {!aprovado && (
                <Botao variante="primario" onClick={aprovar} icone={<Check className="size-5" strokeWidth={3} />}>
                  Aprovar roadmap
                </Botao>
              )}
              {aprovado && !plano && (
                <Botao variante="primario" para={`/plano/novo?roadmap=${roadmap.id}`} iconeDepois={<ArrowRight className="size-5" />}>
                  Gerar plano
                </Botao>
              )}
              {plano && (
                <Botao variante="primario" onClick={() => (setAtivo(roadmap.id), navegar('/plano'))} icone={<CalendarDays className="size-5" />}>
                  Ver plano
                </Botao>
              )}
            </>
          )}
        </div>
      </div>

      {plano && (
        <h2 className="anim-subir text-3xl font-black" style={atraso(1)}>
          Sua trilha{' '}
          <span className="ml-3 text-2xl text-petroleo">
            <Numero valor={progressoGeral(roadmap, plano)} sufixo="%" />
          </span>{' '}
          <span className="text-xl font-semibold text-cinza">concluído</span>
        </h2>
      )}
      <Trilha
        className="mt-4"
        marcos={etapas.map((e) => ({
          rotulo: e.nome,
          estado: e.estado,
          detalhe: plano ? (e.estado === 'atual' ? `${e.progresso}% da etapa` : e.estado === 'concluida' ? 'Concluída' : 'Pendente') : undefined,
        }))}
      />

      {!aprovado && !editando && (
        <p className="anim-subir my-4 flex items-center gap-3 rounded-2xl bg-ciano-suave px-4 py-3 text-lg" style={atraso(2)}>
          <Mascote className="w-12" />
          <span>
            <b className="text-petroleo">Sugestão da IA.</b> Ajuste etapas e conteúdos como quiser antes de aprovar. O plano só é gerado depois da aprovação.
          </span>
        </p>
      )}
      {editando && (
        <p className="anim-surgir my-4 flex items-center gap-2 text-lg text-petroleo">
          <Sparkles className="size-5" /> Modo de edição: clique nos textos para mudar.
        </p>
      )}
      {erro && <p className="anim-tremer mb-2 text-lg text-perigo">{erro}</p>}

      <div className={cx('mt-4 grid gap-4 sm:grid-cols-2', lista.length > 4 ? 'xl:grid-cols-5' : 'xl:grid-cols-4')}>
        {lista.map((etapa, i) => (
          <Card key={i} className={cx('p-5 transition', editando && 'border-ciano ring-4 ring-ciano/10')} i={i + 2}>
            {editando && !plano ? (
              <input value={etapa.nome} onChange={(e) => mudarEtapa(i, (x) => ({ ...x, nome: e.target.value }))} aria-label={`Nome da etapa ${i + 1}`} className={cx('w-full rounded-md bg-ciano-suave px-2 py-1 text-2xl font-black outline-none', !etapa.nome.trim() && 'ring-2 ring-perigo')} />
            ) : (
              <h3 className="text-2xl font-black">{etapa.nome}</h3>
            )}
            <p className="mb-4 text-lg text-petroleo">{etapa.conteudos.length} conteúdos</p>
            <ul className="space-y-3">
              {etapa.conteudos.map((c, j) => (
                <li key={j} className="flex items-center gap-2 rounded-xl border border-borda px-4 py-3">
                  {editando ? (
                    <>
                      <input value={c} onChange={(e) => mudarEtapa(i, (x) => ({ ...x, conteudos: x.conteudos.map((y, k) => (k === j ? e.target.value : y)) }))} className={cx('min-w-0 flex-1 rounded-md bg-ciano-suave px-2 py-1 outline-none', !c.trim() && 'ring-2 ring-perigo')} aria-label={`Conteúdo ${j + 1} de ${etapa.nome}`} />
                      <button aria-label={`Remover ${c}`} onClick={() => mudarEtapa(i, (x) => ({ ...x, conteudos: x.conteudos.filter((_, k) => k !== j) }))} className="text-cinza transition hover:text-perigo">
                        <X className="size-5" />
                      </button>
                    </>
                  ) : (
                    <span className="flex-1">{c}</span>
                  )}
                </li>
              ))}
              {editando && (
                <li>
                  <button onClick={() => mudarEtapa(i, (x) => ({ ...x, conteudos: [...x.conteudos, ''] }))} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ciano py-2 font-semibold text-petroleo transition hover:bg-ciano-suave">
                    <Plus className="size-5" /> Conteúdo
                  </button>
                </li>
              )}
            </ul>
          </Card>
        ))}
      </div>

      <Confirmar
        aberto={excluindo}
        titulo="Excluir este roadmap?"
        texto={plano ? 'O plano de estudos ligado a ele também será excluído.' : 'A sugestão da IA será descartada.'}
        acao="Excluir roadmap"
        onCancelar={() => setExcluindo(false)}
        onConfirmar={() => {
          excluirRoadmap(roadmap.id)
          avisar({ texto: 'Roadmap excluído.', tipo: 'info' })
          navegar('/roadmaps')
        }}
      />
    </>
  )
}
