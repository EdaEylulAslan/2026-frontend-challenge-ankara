import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:gap-6">
        <Sidebar />
        <section className="min-w-0 flex-1">
          <Header />
          {children}
        </section>
      </div>
    </main>
  )
}

export default AppShell
