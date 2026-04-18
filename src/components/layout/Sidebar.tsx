import { LayoutDashboard, Map, MapPin, PanelLeftClose, PanelLeftOpen, Route, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import PodoAvatar from '../PodoAvatar'

const links = [
  { to: '/', label: 'Timeline', icon: Route },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/people', label: 'People', icon: Users },
  { to: '/locations', label: 'Locations', icon: MapPin },
  { to: '/map', label: 'Map', icon: Map },
]

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <aside
      className={`w-full shrink-0 overflow-hidden rounded-xl border border-stone-400/70 bg-gradient-to-b from-[#f9f3e6] to-[#efe5d1] shadow-lg shadow-amber-950/20 ring-1 ring-black/10 transition-[width] duration-200 ease-out lg:sticky lg:top-6 lg:self-start ${
        collapsed ? 'lg:w-[4.25rem]' : 'lg:w-64'
      }`}
    >
      <div
        className={`flex items-center gap-2 border-b border-stone-200 p-4 ${collapsed ? 'lg:flex-col lg:items-stretch' : 'justify-between'}`}
      >
        <div className={`flex min-w-0 items-center gap-2 ${collapsed ? 'lg:justify-center' : ''}`}>
          <PodoAvatar size="sm" alt="Podo" />
          <h1
            className={`min-w-0 font-serif text-2xl font-semibold text-slate-900 ${
              collapsed ? 'lg:sr-only' : ''
            }`}
          >
            Podo Investigation
          </h1>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="ml-auto hidden shrink-0 rounded-lg border border-stone-300 bg-white/70 p-1.5 text-slate-700 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 lg:ml-0 lg:flex lg:items-center lg:justify-center"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <nav className={`flex flex-col gap-1 pb-3 pt-2 ${collapsed ? 'lg:px-1.5' : 'px-2'}`}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `group flex items-center gap-2 rounded-r-lg border-l-4 px-3 py-2 text-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                isActive
                  ? 'border-amber-600 bg-amber-100/80 text-slate-900 shadow-sm'
                  : 'border-transparent text-slate-700 hover:border-amber-400 hover:bg-stone-100/90 hover:text-slate-900'
              }`
            }
          >
            <Icon size={16} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className={collapsed ? 'lg:sr-only' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div
        className={`border-t border-stone-200 px-3 py-3 ${collapsed ? 'lg:px-2 lg:py-2' : ''}`}
      >
        <div
          className={`rounded-lg bg-stone-100/80 px-3 py-2 ${collapsed ? 'lg:flex lg:justify-center lg:px-2' : ''}`}
        >
          <p
            className={`text-[10px] font-semibold uppercase tracking-wide text-slate-500 ${collapsed ? 'lg:sr-only' : ''}`}
          >
            Case Status
          </p>
          <div className={`mt-1 flex items-center gap-2 ${collapsed ? 'lg:mt-0' : ''}`}>
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600 shadow-sm shadow-red-600/60" />
            <span
              className={`text-xs font-medium text-slate-700 ${collapsed ? 'lg:sr-only' : ''}`}
            >
              Active Investigation
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
