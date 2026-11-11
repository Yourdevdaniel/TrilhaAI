import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Botao, cx } from '../../components/ui'
import { EMAIL_DEMO } from '../../data/seed'
import { Campo, classeEntrada, LayoutAuth } from '../../layouts/LayoutAuth'
import { useEstado } from '../../state/estado'

// UC02.1 Realizar login
export default function Login() {
  const navegar = useNavigate()
  const { entrar, avisar } = useEstado()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState<{ campo: 'email' | 'senha' | 'ambos'; texto: string } | null>(null)
  const [entrando, setEntrando] = useState(false)

  function tentar(e: string, s: string) {
    if (!e.trim() && !s) return setErro({ campo: 'ambos', texto: 'Preencha e-mail e senha.' })
    if (!e.trim()) return setErro({ campo: 'email', texto: 'Informe seu e-mail.' })
    if (!s) return setErro({ campo: 'senha', texto: 'Informe sua senha.' })
    const falha = entrar(e)
    if (falha) return setErro({ campo: 'email', texto: falha })
    setEntrando(true)
    window.setTimeout(() => navegar('/inicio'), 350)
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    tentar(email, senha)
  }

  const erroEm = (c: 'email' | 'senha') => erro && (erro.campo === c || erro.campo === 'ambos')

  return (
    <LayoutAuth pose="de-pe" frase="Seu objetivo vira caminho.">
      <h1 className="mb-8 text-5xl font-black">Entrar</h1>
      <form onSubmit={enviar} className={cx('space-y-6', erro && 'anim-tremer')} key={erro?.texto} noValidate>
        <Campo rotulo="E-mail" erro={erro?.campo === 'email' ? erro.texto : undefined}>
          <input type="email" className={cx(classeEntrada, erroEm('email') && 'border-perigo')} placeholder="voce@email.com" value={email} onChange={(e) => (setEmail(e.target.value), setErro(null))} autoComplete="email" />
        </Campo>
        <Campo
          rotulo="Senha"
          erro={erro && erro.campo !== 'email' ? erro.texto : undefined}
          acao={
            <button type="button" className="text-base text-petroleo underline" onClick={() => avisar({ texto: 'Enviamos um link de recuperação para o seu e-mail.', tipo: 'info' })}>
              Esqueci minha senha
            </button>
          }
        >
          <div className="relative">
            <input type={verSenha ? 'text' : 'password'} className={cx(classeEntrada, erroEm('senha') && 'border-perigo')} value={senha} onChange={(e) => (setSenha(e.target.value), setErro(null))} autoComplete="current-password" />
            <button type="button" aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVerSenha(!verSenha)} className="absolute top-1/2 right-4 -translate-y-1/2 text-petroleo">
              {verSenha ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
            </button>
          </div>
        </Campo>
        <Botao variante="primario" type="submit" disabled={entrando} className="w-full py-4 text-xl">
          {entrando ? 'Entrando…' : 'Entrar'}
        </Botao>
      </form>
      <button
        type="button"
        onClick={() => {
          setEmail(EMAIL_DEMO)
          setSenha('demo1234')
          tentar(EMAIL_DEMO, 'demo1234')
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-ciano py-3 text-lg font-bold text-petroleo transition hover:bg-ciano-suave"
      >
        <Sparkles className="size-5" /> Entrar com a conta de demonstração
      </button>
      <p className="mt-8 border-t border-borda pt-6 text-center text-lg">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="text-petroleo underline">
          Criar conta
        </Link>
      </p>
    </LayoutAuth>
  )
}
