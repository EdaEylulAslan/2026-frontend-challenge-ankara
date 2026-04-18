import { useState, type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

const AppShell = ({ children }: AppShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
        <section className="min-w-0 flex-1 rounded-xl border border-stone-300/70 bg-stone-100/45 p-2 shadow-inner shadow-amber-950/10">
          <Header />
          {children}
        </section>
      </div>
    </main>
  )
}

export default AppShell
