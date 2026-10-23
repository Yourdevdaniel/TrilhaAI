import { ArrowRight, Lock, LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Confirmar } from '../components/Confirmar'
import { classeEntrada } from '../components/LayoutAuth'
import { Trilha } from '../components/Trilha'
import { Botao, Card, Mascote, TituloPagina } from '../components/ui'
import { useEstado } from '../data/estado'
import { usuario } from '../data/mock'

// Tela 03 · UC01.2 Editar dados, UC01.3 Excluir conta, UC02.2 Encerrar sessão
export default function Conta() {
  const navegar = useNavigate()
  const { avisar } = useEstado()
  const [nome, setNome] = useState(usuario.nomeCompleto)
  const [email, setEmail] = useState(usuario.email)
  const [confirmando, setConfirmando] = useState(false)

  return (
    <>
      <TituloPagina titulo="Sua conta" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-7">
          <h2 className="mb-5 text-3xl font-black">Dados pessoais</h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              avisar({ texto: 'Dados salvos' })
            }}
          >
            <label className="block">
              <span className="mb-1 block text-petroleo">Nome</span>
              <input className={classeEntrada} value={nome} onChange={(e) => setNome(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-petroleo">E-mail</span>
              <input type="email" className={classeEntrada} value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-petroleo">CPF</span>
              <span className="relative block">
                <input className={`${classeEntrada} bg-[#eef3f5] text-cinza`} value={usuario.cpfMascarado} readOnly />
                <Lock className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-cinza" />
              </span>
            </label>
            <Botao variante="primario" type="submit" className="mt-2 w-full max-w-md py-3.5 text-lg" iconeDepois={<ArrowRight className="size-5" />}>
              Salvar alterações
            </Botao>
          </form>
        </Card>
        <div className="hidden flex-col items-center justify-center lg:flex">
          <Trilha compacta marcos={[{ rotulo: '', estado: 'concluida' }, { rotulo: '', estado: 'futura' }]} className="w-56" />
          <Mascote className="w-52" />
        </div>
      </div>

      <Card className="mt-6 p-7">
        <h2 className="mb-4 text-3xl font-black">Sessão</h2>
        <Botao onClick={() => navegar('/')} icone={<LogOut className="size-5" />}>
          Sair da conta
        </Botao>
      </Card>

      <Card className="mt-6 p-7">
        <h2 className="mb-4 text-3xl font-black">Zona de cuidado</h2>
        <Botao variante="perigo" onClick={() => setConfirmando(true)} icone={<Trash2 className="size-5" />}>
          Excluir conta
        </Botao>
        <p className="mt-3 text-cinza">Seus dados pessoais são apagados em até 30 dias.</p>
      </Card>

      <Confirmar
        aberto={confirmando}
        titulo="Excluir sua conta?"
        texto="Seus roadmaps, planos e avaliações deixam de ficar acessíveis. Os dados pessoais são apagados em até 30 dias."
        acao="Excluir conta"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={() => navegar('/')}
      />
    </>
  )
}
