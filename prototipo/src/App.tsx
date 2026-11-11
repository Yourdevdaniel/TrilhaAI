import { Navigate, Route, Routes } from 'react-router-dom'
import { Aviso } from './components/Aviso'
import { Confete } from './components/Confete'
import LayoutApp from './layouts/LayoutApp'
import Login from './pages/auth/Login'
import Cadastro from './pages/auth/Cadastro'
import BoasVindas from './pages/onboarding/BoasVindas'
import Inicio from './pages/inicio/Inicio'
import Conta from './pages/conta/Conta'
import MeusRoadmaps from './pages/roadmaps/MeusRoadmaps'
import GerarRoadmap from './pages/roadmaps/GerarRoadmap'
import RevisarExtracao from './pages/roadmaps/RevisarExtracao'
import Roadmap from './pages/roadmaps/Roadmap'
import GerarPlano from './pages/plano/GerarPlano'
import Plano from './pages/plano/Plano'
import Progresso from './pages/progresso/Progresso'
import Avaliacao from './pages/avaliacao/Avaliacao'
import Resultado from './pages/avaliacao/Resultado'
import { useEstado } from './state/estado'

function SoLogado({ children }: { children: React.ReactNode }) {
  const { logado } = useEstado()
  return logado ? children : <Navigate to="/" replace />
}

export default function App() {
  const { logado } = useEstado()
  return (
    <>
      <Routes>
        <Route path="/" element={logado ? <Navigate to="/inicio" replace /> : <Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/boas-vindas" element={<SoLogado><BoasVindas /></SoLogado>} />
        <Route element={<SoLogado><LayoutApp /></SoLogado>}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="/roadmaps" element={<MeusRoadmaps />} />
          <Route path="/roadmaps/novo" element={<GerarRoadmap />} />
          <Route path="/roadmaps/novo/revisar" element={<RevisarExtracao />} />
          <Route path="/roadmaps/:id" element={<Roadmap />} />
          <Route path="/plano/novo" element={<GerarPlano />} />
          <Route path="/plano" element={<Plano />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/avaliacao/resultado" element={<Resultado />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Aviso />
      <Confete />
    </>
  )
}
