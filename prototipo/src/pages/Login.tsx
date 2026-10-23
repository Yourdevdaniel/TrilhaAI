import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Campo, classeEntrada, LayoutAuth } from '../components/LayoutAuth'
import { Botao } from '../components/ui'
import { usuario } from '../data/mock'

// Tela 01 · UC02.1 Realizar login
export default function Login() {
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')

  function entrar(e: FormEvent) {
    e.preventDefault()
    if (!email || !senha) return setErro('Preencha e-mail e senha.')
    // Protótipo: só a conta de exemplo entra; qualquer outra mostra a exceção de credenciais.
    if (email.trim().toLowerCase() !== usuario.email) return setErro('E-mail ou senha incorretos.')
    navegar('/inicio')
  }

  return (
    <LayoutAuth pose="de-pe" frase="Seu objetivo vira caminho.">
      <h1 className="mb-8 text-5xl font-black">Entrar</h1>
      <form onSubmit={entrar} className="space-y-6" noValidate>
        <Campo rotulo="E-mail">
          <input type="email" className={classeEntrada} placeholder="ana@email.com" value={email} onChange={(e) => (setEmail(e.target.value), setErro(''))} autoComplete="email" />
        </Campo>
        <Campo
          rotulo="Senha"
          erro={erro}
          acao={
            <a href="#" className="text-base text-petroleo underline" onClick={(e) => e.preventDefault()}>
              Esqueci minha senha
            </a>
          }
        >
          <div className="relative">
            <input type={verSenha ? 'text' : 'password'} className={classeEntrada} value={senha} onChange={(e) => (setSenha(e.target.value), setErro(''))} autoComplete="current-password" />
            <button type="button" aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVerSenha(!verSenha)} className="absolute top-1/2 right-4 -translate-y-1/2 text-petroleo">
              {verSenha ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
            </button>
          </div>
        </Campo>
        <Botao variante="primario" type="submit" className="w-full py-4 text-xl">
          Entrar
        </Botao>
      </form>
      <p className="mt-8 border-t border-borda pt-6 text-center text-lg">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="text-petroleo underline">
          Criar conta
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-cinza">Protótipo: entre com {usuario.email} e qualquer senha.</p>
    </LayoutAuth>
  )
}
