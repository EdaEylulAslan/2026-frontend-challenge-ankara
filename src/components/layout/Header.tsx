import { Clock3 } from 'lucide-react'
import PodoAvatar from '../PodoAvatar'

const Header = () => {
  return (
    <header className="mb-4 rounded-xl border border-stone-400/70 border-t-[8px] border-t-amber-600 bg-gradient-to-r from-[#faf4e8] via-[#f6eddf] to-[#efe2ce] p-5 shadow-md shadow-amber-950/15 ring-1 ring-black/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <PodoAvatar size="md" alt="Podo" className="shrink-0 shadow-sm ring-2 ring-white" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Podo&apos;nun Kaybı
            </p>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Investigation Board
            </h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-md border border-red-300 bg-red-50 px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-red-700 shadow-sm sm:self-auto">
          <Clock3 size={14} aria-hidden className="text-red-600" />
          CASE #2026-04-18
        </span>
      </div>
    </header>
  )
}

export default Header
