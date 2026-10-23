import { Eye, IdCard, Lock, Mail, User } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutAuth } from '../components/LayoutAuth'
import { Botao, cx } from '../components/ui'
import { cpfJaCadastrado } from '../data/mock'

type CampoNome = 'nome' | 'cpf' | 'email' | 'senha' | 'confirmar'

// Tela 02 · UC01.1 Cadastrar usuário
export default function Cadastro() {
  const navegar = useNavigate()
  const [dados, setDados] = useState<Record<CampoNome, string>>({ nome: '', cpf: '', email: '', senha: '', confirmar: '' })
  const [termos, setTermos] = useState(false)
  const [erros, setErros] = useState<Partial<Record<CampoNome | 'termos', string>>>({})

  const mudar = (campo: CampoNome) => (valor: string) => {
    setDados({ ...dados, [campo]: campo === 'cpf' ? mascararCpf(valor) : valor })
    setErros({ ...erros, [campo]: undefined })
  }

  function criar(e: FormEvent) {
    e.preventDefault()
    const novos: typeof erros = {}
    for (const campo of Object.keys(dados) as CampoNome[]) if (!dados[campo].trim()) novos[campo] = 'Campo obrigatório.'
    if (dados.cpf === cpfJaCadastrado) novos.cpf = 'Este CPF já está cadastrado.'
    if (dados.senha && dados.confirmar && dados.senha !== dados.confirmar) novos.confirmar = 'As senhas não conferem.'
    if (!termos) novos.termos = 'Aceite os termos para continuar.'
    setErros(novos)
    if (Object.keys(novos).length === 0) navegar('/inicio')
  }

  return (
    <LayoutAuth pose="caminho">
      <h1 className="mb-8 text-center text-5xl font-black">Criar conta</h1>
      <form onSubmit={criar} className="space-y-4" noValidate>
        <Entrada icone={<User />} placeholder="Nome completo" valor={dados.nome} onMudar={mudar('nome')} erro={erros.nome} />
        <Entrada icone={<IdCard />} placeholder="CPF" valor={dados.cpf} onMudar={mudar('cpf')} erro={erros.cpf} inputMode="numeric" />
        <Entrada icone={<Mail />} placeholder="E-mail" tipo="email" valor={dados.email} onMudar={mudar('email')} erro={erros.email} />
        <Entrada icone={<Lock />} placeholder="Senha" tipo="password" valor={dados.senha} onMudar={mudar('senha')} erro={erros.senha} olho />
        <Entrada icone={<Lock />} placeholder="Confirmar senha" tipo="password" valor={dados.confirmar} onMudar={mudar('confirmar')} erro={erros.confirmar} olho />
        <label className="flex items-center gap-3 pt-2 text-lg">
          <input type="checkbox" checked={termos} onChange={(e) => (setTermos(e.target.checked), setErros({ ...erros, termos: undefined }))} className="size-6 accent-petroleo" />
          Li e aceito os termos de uso
        </label>
        {erros.termos && <p className="text-perigo">{erros.termos}</p>}
        <Botao variante="primario" type="submit" className="mt-2 w-full py-4 text-xl">
          Criar conta
        </Botao>
      </form>
      <p className="mt-8 border-t border-borda pt-6 text-center text-lg">
        Já tem conta?{' '}
        <Link to="/" className="text-petroleo underline">
          Entrar
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-cinza">Protótipo: o CPF {cpfJaCadastrado} simula um cadastro duplicado.</p>
    </LayoutAuth>
  )
}

function Entrada({ icone, placeholder, valor, onMudar, erro, tipo = 'text', olho, inputMode }: { icone: ReactNode; placeholder: string; valor: string; onMudar: (v: string) => void; erro?: string; tipo?: string; olho?: boolean; inputMode?: 'numeric' }) {
  const [ver, setVer] = useState(false)
  return (
    <div>
      <div className={cx('flex items-center gap-3 rounded-xl border px-4 py-3.5 transition focus-within:ring-4', erro ? 'border-perigo bg-perigo-claro focus-within:ring-perigo/20' : 'border-borda focus-within:border-ciano focus-within:ring-ciano/20')}>
        <span className="text-petroleo [&>svg]:size-6">{icone}</span>
        <input aria-label={placeholder} type={olho && ver ? 'text' : tipo} placeholder={placeholder} value={valor} onChange={(e) => onMudar(e.target.value)} inputMode={inputMode} className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-cinza" />
        {olho && (
          <button type="button" aria-label="Mostrar senha" onClick={() => setVer(!ver)} className="text-petroleo">
            <Eye className="size-6" />
          </button>
        )}
      </div>
      {erro && <p className="mt-1.5 text-perigo">{erro}</p>}
    </div>
  )
}

function mascararCpf(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
