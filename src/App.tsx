import { useEffect } from 'react'
import { getSubmissions } from './api/jotform'
import { normalizeSubmission } from './data/normalize'

function App() {
  useEffect(() => {
    const checkinsFormId = import.meta.env.VITE_FORM_CHECKINS

    if (!checkinsFormId) {
      console.error('Missing VITE_FORM_CHECKINS')
      return
    }

    const run = async (): Promise<void> => {
      try {
        const submissions = await getSubmissions(checkinsFormId)
        const normalized = submissions.map(normalizeSubmission)
        console.log('Checkins submissions (raw):', submissions)
        console.log('Checkins submissions (normalized):', normalized)
      } catch (error) {
        console.error('Failed to fetch checkins submissions:', error)
      }
    }

    void run()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Podo Investigation Board
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Frontend bootstrapped with React, TypeScript, TanStack Query, Router,
          and Tailwind.
        </p>
      </div>
    </main>
  )
}

export default App
