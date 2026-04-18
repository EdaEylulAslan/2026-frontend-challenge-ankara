import { Clock3 } from 'lucide-react'

const Header = () => {
  return (
    <header className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Podo&apos;nun Kaybı
          </p>
          <h2 className="font-serif text-2xl font-semibold text-slate-900">
            Investigation Board
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 size={14} />
          <span>Ankara Timeline</span>
        </div>
      </div>
    </header>
  )
}

export default Header
