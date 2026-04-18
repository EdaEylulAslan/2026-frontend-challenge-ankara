import { useParams } from 'react-router-dom'

const LocationDetailPage = () => {
  const { coords } = useParams()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Location Detail</h2>
      <p className="mt-2 text-sm text-slate-600">
        Selected coordinates: <span className="font-medium text-slate-800">{coords}</span>
      </p>
    </section>
  )
}

export default LocationDetailPage
