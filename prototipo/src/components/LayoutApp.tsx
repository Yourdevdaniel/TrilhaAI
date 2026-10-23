import { BarChart3, CalendarDays, CheckCircle2, Clock3, Home, Map, X } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEstado } from '../data/estado'
import { usuario } from '../data/mock'
import { cx, Wordmark } from './ui'

const itens = [
  { para: '/inicio', rotulo: 'Início', curto: 'Início', icone: Home, ativoEm: ['/inicio'] },
  { para: '/roadmaps', rotulo: 'Minha trilha', curto: 'Trilha', icone: Map, ativoEm: ['/roadmaps'] },
  { para: '/plano', rotulo: 'Plano semanal', curto: 'Plano', icone: CalendarDays, ativoEm: ['/plano'] },
  { para: '/avaliacao', rotulo: 'Avaliações', curto: 'Avaliações', icone: BarChart3, ativoEm: ['/avaliacao'] },
  { para: '/progresso', rotulo: 'Histórico', curto: 'Histórico', icone: Clock3, ativoEm: ['/progresso'] },
]

export default function LayoutApp() {
  const { pathname } = useLocation()
  const { aviso, fecharAviso } = useEstado()
  const ativo = (prefixos: string[]) => prefixos.some((p) => pathname.startsWith(p))
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
          {itens.map(({ para, rotulo, icone: Icone, ativoEm }) => (
            <NavLink key={para} to={para} className={cx('flex items-center gap-4 rounded-xl px-4 py-3 text-lg font-semibold transition-colors', ativo(ativoEm) ? 'bg-ciano-claro text-petroleo' : 'text-tinta hover:bg-ciano-suave')}>
              <Icone className="size-6" strokeWidth={ativo(ativoEm) ? 2.4 : 1.8} />
              {rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-borda pt-4">
          <NavLink to="/conta" className={cx('flex items-center gap-3 rounded-xl px-3 py-2 text-lg font-bold', pathname === '/conta' ? 'bg-ciano-claro' : 'hover:bg-ciano-suave')}>
            <span className="flex size-11 items-center justify-center rounded-full bg-ciano text-xl text-white">{usuario.nome[0]}</span>
            {usuario.nome}
          </NavLink>
        </div>
      </aside>

      {/* Navegação no celular (RNF07: utilizável a partir de 360 px) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-borda bg-nevoa/95 px-4 py-3 backdrop-blur md:hidden">
        <Wordmark className="text-2xl" />
        <NavLink to="/conta" className="flex size-9 items-center justify-center rounded-full bg-ciano font-bold text-white">{usuario.nome[0]}</NavLink>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-borda bg-white md:hidden">
        {itens.map(({ para, curto, icone: Icone, ativoEm }) => (
          <NavLink key={para} to={para} className={cx('flex flex-col items-center gap-1 py-2 text-xs font-semibold', ativo(ativoEm) ? 'text-petroleo' : 'text-cinza')}>
            <Icone className="size-5" />
            {curto}
          </NavLink>
        ))}
      </nav>

      <main className="min-w-0 flex-1 px-4 pt-6 pb-24 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {aviso && (
        <div role="status" className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-borda bg-white px-5 py-3 shadow-lg md:bottom-8">
          <CheckCircle2 className="size-6 text-ciano" />
          <span className="font-semibold">{aviso.texto}</span>
          {aviso.desfazer && (
            <button
              className="font-bold text-petroleo hover:underline"
              onClick={() => {
                aviso.desfazer?.()
                fecharAviso()
              }}
            >
              Desfazer
            </button>
          )}
          <button aria-label="Fechar aviso" onClick={fecharAviso} className="text-cinza hover:text-tinta">
            <X className="size-5" />
          </button>
        </div>
      )}
    </div>
  )
}
