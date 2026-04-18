import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

/**
 * Vite does not resolve Leaflet's default asset URLs; set explicit image paths.
 */
export const fixLeafletDefaultIcons = (): void => {
  const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: string }
  delete proto._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  })
}
