import { FileText, Paperclip, Sparkles, XCircle } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ProcessandoIA } from '../../components/ProcessandoIA'
import { Botao, Card, cx, Mascote, TituloPagina } from '../../components/ui'
import { useEstado } from '../../state/estado'

const exemplos = ['Quero ser desenvolvedor(a) front-end júnior em 6 meses.', 'Quero trabalhar com análise de dados usando Python.', 'Quero passar no concurso do Banco do Brasil em 2027.']

// UC04.1 Gerar roadmap com IA · UC03.1 Informar texto · UC03.2 Enviar PDF
export default function GerarRoadmap() {
  const navegar = useNavigate()
  const { rascunho, setRascunho, extrair, criarRoadmap, avisar } = useEstado()
  const [colando, setColando] = useState(Boolean(rascunho.texto))
  const [erro, setErro] = useState('')
  const [erroArquivo, setErroArquivo] = useState('')
  const [processando, setProcessando] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const entradaArquivo = useRef<HTMLInputElement>(null)
  // Com ?falha na URL, a primeira tentativa falha para demonstrar o RNF11
  const [params] = useSearchParams()
  const comMaterial = Boolean(rascunho.arquivo || rascunho.texto.trim())

  function escolherArquivo(arquivo?: File) {
    if (!arquivo) return
    // UC03.2, exceção do passo 4: só PDF
    if (!arquivo.name.toLowerCase().endsWith('.pdf')) return setErroArquivo('Formato do arquivo inválido. Envie um PDF.')
    setErroArquivo('')
    setRascunho({ arquivo: arquivo.name })
  }

  function gerar() {
    if (!rascunho.objetivo.trim()) return setErro('Conte seu objetivo para a IA sugerir a trilha.')
    setProcessando(true)
  }

  const concluir = useCallback(() => {
    if (comMaterial) {
      extrair()
      navegar('/roadmaps/novo/revisar')
    } else {
      const id = criarRoadmap()
      avisar({ texto: 'Roadmap sugerido! Revise e aprove.', tipo: 'sucesso' })
      navegar(`/roadmaps/${id}`)
    }
  }, [comMaterial, extrair, criarRoadmap, avisar, navegar])

  return (
    <>
      <div className="relative">
        <TituloPagina titulo="Novo roadmap" subtitulo="Conte aonde quer chegar. A IA sugere a trilha e você aprova cada passo." />
        <Mascote pose="caminho" className="absolute -top-4 right-6 hidden w-36 xl:block" flutuando />
      </div>
      <Card className="space-y-6 p-6 md:p-8" i={0}>
        <label className="block">
          <span className="mb-3 block text-2xl font-black">Seu objetivo</span>
          <textarea value={rascunho.objetivo} onChange={(e) => (setRascunho({ objetivo: e.target.value }), setErro(''))} rows={3} className={cx('w-full rounded-xl border px-5 py-4 text-xl outline-none transition focus:ring-4 focus:ring-ciano/20', erro ? 'anim-tremer border-perigo' : 'border-ciano/50')} placeholder="Quero passar no concurso do Banco do Brasil em 2027." />
          {erro && <span className="mt-1 block text-perigo">{erro}</span>}
        </label>
        <div className="-mt-2 flex flex-wrap gap-2">
          <span className="text-cinza">Exemplos:</span>
          {exemplos.map((ex) => (
            <button key={ex} onClick={() => (setRascunho({ objetivo: ex }), setErro(''))} className="rounded-full bg-ciano-suave px-3 py-1 text-sm font-semibold text-petroleo transition hover:bg-ciano-claro">
              {ex.replace(/^Quero /, '').replace(/\.$/, '')}
            </button>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-black">
            Material de apoio <span className="text-xl font-normal text-cinza">(opcional)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => entradaArquivo.current?.click()}
              onDragOver={(e) => (e.preventDefault(), setArrastando(true))}
              onDragLeave={() => setArrastando(false)}
              onDrop={(e) => {
                e.preventDefault()
                setArrastando(false)
                escolherArquivo(e.dataTransfer.files[0])
              }}
              className={cx('flex items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-8 transition', arrastando ? 'scale-[1.02] border-ciano bg-ciano-claro' : 'border-ciano/50 hover:bg-ciano-suave')}
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-ciano-suave text-petroleo">
                <Paperclip className="size-7" />
              </span>
              <span className="text-left">
                <span className="block text-xl font-bold text-petroleo">Enviar PDF</span>
                <span className="text-cinza">Edital ou descrição de vaga</span>
              </span>
            </button>
            <input ref={entradaArquivo} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => (escolherArquivo(e.target.files?.[0]), (e.target.value = ''))} />
            <button onClick={() => setColando(!colando)} className={cx('flex items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-8 transition hover:bg-ciano-suave', colando ? 'border-ciano bg-ciano-suave' : 'border-ciano/50')}>
              <span className="flex size-14 items-center justify-center rounded-full bg-ciano-suave text-petroleo">
                <FileText className="size-7" />
              </span>
              <span className="text-xl font-bold text-petroleo">Colar texto</span>
            </button>
          </div>
          {erroArquivo && <p className="anim-tremer mt-3 text-perigo">{erroArquivo}</p>}
          {colando && <textarea value={rascunho.texto} onChange={(e) => setRascunho({ texto: e.target.value })} rows={4} autoFocus className="anim-subir mt-4 w-full rounded-xl border border-borda px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-ciano/20" placeholder="Cole aqui o texto do edital ou da vaga." />}
          {rascunho.arquivo && (
            <span className="anim-pop mt-4 inline-flex items-center gap-3 rounded-xl bg-[#eef3f5] px-4 py-3 text-lg">
              <FileText className="size-6 text-cinza" />
              {rascunho.arquivo}
              <button aria-label="Remover arquivo" onClick={() => setRascunho({ arquivo: null })} className="text-perigo transition hover:scale-110">
                <XCircle className="size-6" />
              </button>
            </span>
          )}
        </div>

        <Botao variante="primario" onClick={gerar} className="w-full py-4 text-2xl" icone={<Sparkles className="size-6" />}>
          {comMaterial ? 'Ler material e gerar roadmap' : 'Gerar roadmap'}
        </Botao>
        <p className="text-center text-lg text-cinza">Nada vira plano sem a sua aprovação.</p>
      </Card>

      {processando && (
        <ProcessandoIA
          titulo={comMaterial ? 'A IA está lendo seu material' : 'A IA está montando sua trilha'}
          passos={comMaterial ? ['Lendo o documento', 'Separando instruções de conteúdo', 'Identificando conteúdos', 'Listando competências'] : ['Entendendo seu objetivo', 'Escolhendo os conteúdos', 'Ordenando em etapas', 'Desenhando a trilha']}
          falhar={params.has('falha')}
          onConcluir={concluir}
          onCancelar={() => setProcessando(false)}
        />
      )}
    </>
  )
}
