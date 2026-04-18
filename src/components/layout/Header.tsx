import { Clock3 } from 'lucide-react'

const Header = () => {
  return (
    <header className="mb-4 rounded-xl border border-stone-200 border-t-4 border-t-amber-500 bg-stone-50/90 p-4 shadow-sm shadow-amber-900/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Podo&apos;nun Kaybı
          </p>
          <h2 className="font-serif text-3xl font-semibold text-slate-900">
            Investigation Board
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-stone-300 bg-stone-100 px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-slate-700 sm:self-auto">
          <Clock3 size={14} aria-hidden className="text-amber-600" />
          CASE #2026-04-18
        </span>
      </div>
    </header>
  )
}

export default Header
