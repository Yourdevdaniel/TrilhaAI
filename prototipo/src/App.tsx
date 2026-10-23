import { Navigate, Route, Routes } from 'react-router-dom'
import LayoutApp from './components/LayoutApp'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Inicio from './pages/Inicio'
import Conta from './pages/Conta'
import MeusRoadmaps from './pages/MeusRoadmaps'
import GerarRoadmap from './pages/GerarRoadmap'
import RevisarExtracao from './pages/RevisarExtracao'
import Roadmap from './pages/Roadmap'
import GerarPlano from './pages/GerarPlano'
import Plano from './pages/Plano'
import Progresso from './pages/Progresso'
import Avaliacao from './pages/Avaliacao'
import Resultado from './pages/Resultado'

// Cada rota corresponde a uma tela de discovery/telas-codex (número no comentário).
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* 01 */}
      <Route path="/cadastro" element={<Cadastro />} /> {/* 02 */}
      <Route element={<LayoutApp />}>
        <Route path="/inicio" element={<Inicio />} /> {/* home A */}
        <Route path="/conta" element={<Conta />} /> {/* 03 */}
        <Route path="/roadmaps" element={<MeusRoadmaps />} /> {/* 04 */}
        <Route path="/roadmaps/novo" element={<GerarRoadmap />} /> {/* 05 */}
        <Route path="/roadmaps/novo/revisar" element={<RevisarExtracao />} /> {/* 06 */}
        <Route path="/roadmaps/:id" element={<Roadmap />} /> {/* 07 */}
        <Route path="/plano/novo" element={<GerarPlano />} /> {/* 08 */}
        <Route path="/plano" element={<Plano />} /> {/* 09 */}
        <Route path="/progresso" element={<Progresso />} /> {/* 10 */}
        <Route path="/avaliacao" element={<Avaliacao />} /> {/* 11 */}
        <Route path="/avaliacao/resultado" element={<Resultado />} /> {/* 12 */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
