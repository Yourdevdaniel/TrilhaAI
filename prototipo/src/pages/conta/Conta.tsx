import { ArrowRight, Lock, LogOut, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Confirmar } from '../../components/Confirmar'
import { Trilha } from '../../components/Trilha'
import { Botao, Card, cx, Mascote, TituloPagina } from '../../components/ui'
import { EMAIL_DEMO } from '../../data/seed'
import { classeEntrada } from '../../layouts/LayoutAuth'
import { useEstado } from '../../state/estado'

const mascararCpf = (cpf: string) => (cpf.length === 14 ? `***.${cpf.slice(4, 11)}-**` : cpf)

// UC01.2 Editar dados · UC01.3 Excluir conta · UC02.2 Encerrar sessão
export default function Conta() {
  const navegar = useNavigate()
  const { usuario, salvarUsuario, sair, excluirConta, reiniciarDemo, avisar } = useEstado()
  const [nome, setNome] = useState(usuario.nomeCompleto)
  const [email, setEmail] = useState(usuario.email)
  const [erros, setErros] = useState<{ nome?: string; email?: string }>({})
  const [confirmando, setConfirmando] = useState<'sair' | 'excluir' | 'reiniciar' | null>(null)
  const mudou = nome !== usuario.nomeCompleto || email !== usuario.email

  function salvar(e: FormEvent) {
    e.preventDefault()
    // UC01.2, exceção do passo 6: campo obrigatório vazio
    const novos: typeof erros = {}
    if (!nome.trim()) novos.nome = 'Campo obrigatório.'
    if (!email.trim()) novos.email = 'Campo obrigatório.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) novos.email = 'E-mail inválido.'
    setErros(novos)
    if (Object.keys(novos).length) return
    salvarUsuario({ nomeCompleto: nome.trim(), email: email.trim() })
    avisar({ texto: 'Dados salvos com sucesso.', tipo: 'sucesso' })
  }

  return (
    <>
      <TituloPagina titulo="Sua conta" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-7" i={0}>
          <h2 className="mb-5 text-3xl font-black">Dados pessoais</h2>
          <form className={cx('space-y-4', Object.keys(erros).length > 0 && 'anim-tremer')} key={JSON.stringify(erros)} onSubmit={salvar} noValidate>
            <label className="block">
              <span className="mb-1 block text-petroleo">Nome</span>
              <input className={cx(classeEntrada, erros.nome && 'border-perigo')} value={nome} onChange={(e) => (setNome(e.target.value), setErros({ ...erros, nome: undefined }))} />
              {erros.nome && <span className="text-perigo">{erros.nome}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-petroleo">E-mail</span>
              <input type="email" className={cx(classeEntrada, erros.email && 'border-perigo')} value={email} onChange={(e) => (setEmail(e.target.value), setErros({ ...erros, email: undefined }))} />
              {erros.email && <span className="text-perigo">{erros.email}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-petroleo">CPF</span>
              <span className="relative block">
                <input className={`${classeEntrada} bg-[#eef3f5] text-cinza`} value={mascararCpf(usuario.cpf)} readOnly />
                <Lock className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-cinza" />
              </span>
            </label>
            <Botao variante="primario" type="submit" disabled={!mudou} className="mt-2 w-full max-w-md py-3.5 text-lg" iconeDepois={<ArrowRight className="size-5" />}>
              Salvar alterações
            </Botao>
          </form>
        </Card>
        <div className="hidden flex-col items-center justify-center lg:flex">
          <Trilha compacta marcos={[{ rotulo: '', estado: 'concluida' }, { rotulo: '', estado: 'futura' }]} className="w-56" />
          <Mascote className="w-52" flutuando />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-7" i={1}>
          <h2 className="mb-4 text-3xl font-black">Sessão</h2>
          <div className="flex flex-wrap gap-3">
            <Botao onClick={() => setConfirmando('sair')} icone={<LogOut className="size-5" />}>
              Sair da conta
            </Botao>
            <Botao para="/boas-vindas" icone={<Sparkles className="size-5" />}>
              Rever introdução
            </Botao>
          </div>
        </Card>
        <Card className="p-7" i={2}>
          <h2 className="mb-4 text-3xl font-black">Zona de cuidado</h2>
          <div className="flex flex-wrap gap-3">
            <Botao variante="perigo" onClick={() => setConfirmando('excluir')} icone={<Trash2 className="size-5" />}>
              Excluir conta
            </Botao>
            {usuario.email === EMAIL_DEMO && (
              <Botao onClick={() => setConfirmando('reiniciar')} icone={<RotateCcw className="size-5" />}>
                Reiniciar demonstração
              </Botao>
            )}
          </div>
          <p className="mt-3 text-cinza">Ao excluir, seus dados pessoais são apagados em até 30 dias.</p>
        </Card>
      </div>

      <Confirmar
        aberto={confirmando === 'sair'}
        titulo="Sair da conta?"
        texto="Você volta para a tela de login. Seus roadmaps e planos continuam salvos."
        acao="Sair"
        perigo={false}
        onCancelar={() => setConfirmando(null)}
        onConfirmar={() => {
          sair()
          navegar('/')
        }}
      />
      <Confirmar
        aberto={confirmando === 'excluir'}
        titulo="Excluir sua conta?"
        texto="Seus roadmaps, planos e avaliações deixam de ficar acessíveis. Os dados pessoais são apagados em até 30 dias."
        acao="Excluir conta"
        onCancelar={() => setConfirmando(null)}
        onConfirmar={() => {
          excluirConta()
          avisar({ texto: 'Conta excluída. Pedido de exclusão de dados registrado.', tipo: 'info' })
          navegar('/')
        }}
      />
      <Confirmar
        aberto={confirmando === 'reiniciar'}
        titulo="Reiniciar a demonstração?"
        texto="Tudo volta ao estado inicial da conta da Ana: roadmaps, plano, progresso e avaliações."
        acao="Reiniciar"
        perigo={false}
        onCancelar={() => setConfirmando(null)}
        onConfirmar={() => {
          reiniciarDemo()
          setConfirmando(null)
          avisar({ texto: 'Demonstração reiniciada.', tipo: 'info' })
          navegar('/inicio')
        }}
      />
    </>
  )
}
