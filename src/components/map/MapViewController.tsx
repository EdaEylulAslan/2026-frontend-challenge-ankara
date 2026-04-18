import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

const ANKARA_CENTER: [number, number] = [39.9334, 32.8597]

interface MapViewControllerProps {
  /** When true, prioritize fitting journey; otherwise fit all locations or default center */
  showRoute: boolean
  journeyPositions: [number, number][]
  locationPositions: [number, number][]
}

/**
 * Keeps the map framed on the route (or all pins) so start → end is visible at a glance.
 */
const MapViewController = ({
  showRoute,
  journeyPositions,
  locationPositions,
}: MapViewControllerProps) => {
  const map = useMap()

  useEffect(() => {
    if (showRoute && journeyPositions.length >= 2) {
      map.fitBounds(L.latLngBounds(journeyPositions), { padding: [56, 56], maxZoom: 14 })
      return
    }

    if (showRoute && journeyPositions.length === 1) {
      map.setView(journeyPositions[0], 14)
      return
    }

    if (!showRoute && locationPositions.length >= 2) {
      map.fitBounds(L.latLngBounds(locationPositions), { padding: [48, 48], maxZoom: 13 })
      return
    }

    if (!showRoute && locationPositions.length === 1) {
      map.setView(locationPositions[0], 13)
      return
    }

    map.setView(ANKARA_CENTER, 13)
  }, [showRoute, journeyPositions, locationPositions, map])

  return null
}

export default MapViewController
