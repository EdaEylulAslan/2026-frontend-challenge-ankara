import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import RouteErrorBoundary from './components/states/RouteErrorBoundary'
import Dashboard from './pages/Dashboard'
import LocationDetailPage from './pages/LocationDetailPage'
import LocationsPage from './pages/LocationsPage'
import MapPage from './pages/MapPage'
import PeoplePage from './pages/PeoplePage'
import PersonDetailPage from './pages/PersonDetailPage'
import TimelinePage from './pages/TimelinePage'

function App() {
  return (
    <AppShell>
      <RouteErrorBoundary>
        <Routes>
          <Route path="/" element={<TimelinePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:canonicalName" element={<PersonDetailPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/locations/:coords" element={<LocationDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouteErrorBoundary>
    </AppShell>
  )
}

export default App
