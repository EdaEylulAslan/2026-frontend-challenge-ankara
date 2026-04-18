import { LayoutDashboard, Map, MapPin, PanelLeftClose, PanelLeftOpen, Route, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

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
      className={`w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-[width] duration-200 ease-out lg:sticky lg:top-6 lg:self-start ${
        collapsed ? 'lg:w-[4.25rem]' : 'lg:w-64'
      }`}
    >
      <div
        className={`flex items-center gap-2 p-4 ${collapsed ? 'lg:flex-col lg:items-stretch' : 'justify-between'}`}
      >
        <h1
          className={`min-w-0 font-serif text-xl font-semibold text-slate-900 ${
            collapsed ? 'lg:sr-only' : ''
          }`}
        >
          Podo Investigation
        </h1>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="ml-auto hidden shrink-0 rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 lg:ml-0 lg:flex lg:items-center lg:justify-center"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <nav className={`flex flex-col gap-1 pb-4 ${collapsed ? 'lg:px-1.5' : 'px-2'}`}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                collapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                isActive
                  ? 'bg-slate-900 text-slate-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            <span className={collapsed ? 'lg:sr-only' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
