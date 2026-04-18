import { useParams } from 'react-router-dom'

const PersonDetailPage = () => {
  const { canonicalName } = useParams()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Person Detail</h2>
      <p className="mt-2 text-sm text-slate-600">
        Selected person: <span className="font-medium text-slate-800">{canonicalName}</span>
      </p>
    </section>
  )
}

export default PersonDetailPage
