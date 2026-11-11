import { BarChart3, CalendarDays, Clock3, Home, Map } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cx, Wordmark } from '../components/ui'
import { useEstado } from '../state/estado'

const itens = [
  { para: '/inicio', rotulo: 'Início', curto: 'Início', icone: Home },
  { para: '/roadmaps', rotulo: 'Minha trilha', curto: 'Trilha', icone: Map },
  { para: '/plano', rotulo: 'Plano semanal', curto: 'Plano', icone: CalendarDays },
  { para: '/avaliacao', rotulo: 'Avaliações', curto: 'Avaliar', icone: BarChart3 },
  { para: '/progresso', rotulo: 'Progresso', curto: 'Progresso', icone: Clock3 },
]

export default function LayoutApp() {
  const { pathname } = useLocation()
  const { usuario } = useEstado()
  const ativo = (prefixo: string) => pathname.startsWith(prefixo)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen md:flex">
      {/* Barra lateral (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-borda bg-nevoa px-4 py-8 md:flex">
        <NavLink to="/inicio" className="mb-10 px-3">
          <Wordmark className="text-4xl" />
        </NavLink>
        <nav className="flex flex-col gap-2">
          {itens.map(({ para, rotulo, icone: Icone }) => (
            <NavLink key={para} to={para} className={cx('relative flex items-center gap-4 rounded-xl px-4 py-3 text-lg font-semibold transition-all duration-200', ativo(para) ? 'bg-ciano-claro text-petroleo' : 'text-tinta hover:translate-x-1 hover:bg-ciano-suave')}>
              {ativo(para) && <span className="anim-pop absolute top-2 bottom-2 left-0 w-1 rounded-full bg-petroleo" />}
              <Icone className="size-6" strokeWidth={ativo(para) ? 2.4 : 1.8} />
              {rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-borda pt-4">
          <NavLink to="/conta" className={cx('flex items-center gap-3 rounded-xl px-3 py-2 text-lg font-bold transition-colors', pathname === '/conta' ? 'bg-ciano-claro' : 'hover:bg-ciano-suave')}>
            <span className="flex size-11 items-center justify-center rounded-full bg-ciano text-xl text-white">{usuario.nome[0]?.toUpperCase()}</span>
            <span className="truncate">{usuario.nome}</span>
          </NavLink>
        </div>
      </aside>

      {/* Navegação no celular (RNF07: utilizável a partir de 360 px) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-borda bg-nevoa/95 px-4 py-3 backdrop-blur md:hidden">
        <NavLink to="/inicio">
          <Wordmark className="text-2xl" />
        </NavLink>
        <NavLink to="/conta" aria-label="Sua conta" className="flex size-9 items-center justify-center rounded-full bg-ciano font-bold text-white">{usuario.nome[0]?.toUpperCase()}</NavLink>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-borda bg-white/95 backdrop-blur md:hidden">
        {itens.map(({ para, curto, icone: Icone }) => (
          <NavLink key={para} to={para} className={cx('flex flex-col items-center gap-1 py-2 text-xs font-semibold transition-colors', ativo(para) ? 'text-petroleo' : 'text-cinza')}>
            <Icone className={cx('size-5 transition-transform', ativo(para) && '-translate-y-0.5 scale-110')} />
            {curto}
          </NavLink>
        ))}
      </nav>

      <main className="min-w-0 flex-1 px-4 pt-6 pb-24 md:px-10 md:py-10">
        <div key={pathname} className="anim-pagina mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
