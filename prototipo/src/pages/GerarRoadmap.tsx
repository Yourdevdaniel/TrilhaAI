import { FileText, Loader2, Paperclip, RotateCcw, XCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Botao, Card, Mascote, TituloPagina } from '../components/ui'
import { useEstado } from '../data/estado'

// Tela 05 · UC04.1 Gerar roadmap com IA, UC03.1 Informar texto, UC03.2 Enviar PDF
export default function GerarRoadmap() {
  const navegar = useNavigate()
  const { arquivo, setArquivo } = useEstado()
  const [objetivo, setObjetivo] = useState('Quero ser desenvolvedora front-end júnior em 6 meses.')
  const [colando, setColando] = useState(false)
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const [gerando, setGerando] = useState(false)
  const [falhou, setFalhou] = useState(false)
  const entradaArquivo = useRef<HTMLInputElement>(null)
  const [params] = useSearchParams()
  const jaFalhou = useRef(false)

  function gerar() {
    if (!objetivo.trim()) return setErro('Conte seu objetivo para a IA sugerir a trilha.')
    setGerando(true)
    setFalhou(false)
    // Simula a chamada à IA. Com material de apoio, a extração passa antes pela revisão (UC03.3).
    // Com ?falha na URL, a primeira tentativa falha para demonstrar o RNF11.
    window.setTimeout(() => {
      setGerando(false)
      if (params.has('falha') && !jaFalhou.current) {
        jaFalhou.current = true
        return setFalhou(true)
      }
      navegar(arquivo || texto.trim() ? '/roadmaps/novo/revisar' : '/roadmaps/novo-roadmap')
    }, 1400)
  }

  return (
    <>
      <div className="relative">
        <TituloPagina titulo="Novo roadmap" subtitulo="Conte aonde quer chegar. A IA sugere a trilha e você aprova cada passo." />
        <Mascote pose="caminho" className="absolute top-0 right-6 hidden w-36 xl:block" />
      </div>
      <Card className="space-y-6 p-8">
        <label className="block">
          <span className="mb-3 block text-2xl font-black">Seu objetivo</span>
          <textarea value={objetivo} onChange={(e) => (setObjetivo(e.target.value), setErro(''))} rows={4} className="w-full rounded-xl border border-ciano/50 px-5 py-4 text-xl outline-none focus:ring-4 focus:ring-ciano/20" placeholder="Quero passar no concurso do Banco do Brasil em 2027." />
          {erro && <span className="mt-1 block text-perigo">{erro}</span>}
        </label>

        <div>
          <h2 className="mb-3 text-2xl font-black">
            Material de apoio <span className="text-xl font-normal text-cinza">(opcional)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <button onClick={() => entradaArquivo.current?.click()} className="flex items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-ciano/50 px-6 py-8 hover:bg-ciano-suave">
              <span className="flex size-14 items-center justify-center rounded-full bg-ciano-suave text-petroleo"><Paperclip className="size-7" /></span>
              <span className="text-left">
                <span className="block text-xl font-bold text-petroleo">Enviar PDF</span>
                <span className="text-cinza">Edital ou descrição de vaga</span>
              </span>
            </button>
            <input ref={entradaArquivo} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setArquivo(e.target.files[0].name)} />
            <button onClick={() => setColando(!colando)} className="flex items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-ciano/50 px-6 py-8 hover:bg-ciano-suave">
              <span className="flex size-14 items-center justify-center rounded-full bg-ciano-suave text-petroleo"><FileText className="size-7" /></span>
              <span className="text-xl font-bold text-petroleo">Colar texto</span>
            </button>
          </div>
          {colando && <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} className="mt-4 w-full rounded-xl border border-borda px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-ciano/20" placeholder="Cole aqui o texto do edital ou da vaga." />}
          {arquivo && (
            <span className="mt-4 inline-flex items-center gap-3 rounded-xl bg-[#eef3f5] px-4 py-3 text-lg">
              <FileText className="size-6 text-cinza" />
              {arquivo}
              <button aria-label="Remover arquivo" onClick={() => setArquivo(null)} className="text-perigo">
                <XCircle className="size-6" />
              </button>
            </span>
          )}
        </div>

        {/* RNF11: falha ou demora da IA deixa tentar de novo sem duplicar dados */}
        {falhou && (
          <p className="flex items-center gap-3 rounded-xl bg-perigo-claro px-4 py-3 text-perigo">
            A IA não respondeu a tempo. Nada foi salvo.
            <button onClick={gerar} className="flex items-center gap-1 font-bold underline"><RotateCcw className="size-4" /> Tentar de novo</button>
          </p>
        )}
        <Botao variante="primario" onClick={gerar} disabled={gerando} className="w-full py-4 text-2xl">
          {gerando ? (
            <>
              <Loader2 className="size-6 animate-spin" /> A IA está montando sua trilha…
            </>
          ) : (
            'Gerar roadmap'
          )}
        </Botao>
        <p className="text-center text-lg text-cinza">Nada é salvo sem a sua aprovação.</p>
      </Card>
    </>
  )
}
