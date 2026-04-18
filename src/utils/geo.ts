/**
 * Initial bearing from point a to b (degrees, clockwise from north; range −180…180).
 */
export const bearingBetween = (a: [number, number], b: [number, number]): number => {
  const [lat1, lon1] = a.map((deg) => (deg * Math.PI) / 180)
  const [lat2, lon2] = b.map((deg) => (deg * Math.PI) / 180)
  const dLon = lon2 - lon1
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return (Math.atan2(y, x) * 180) / Math.PI
}

export const midpoint = (a: [number, number], b: [number, number]): [number, number] => [
  (a[0] + b[0]) / 2,
  (a[1] + b[1]) / 2,
]
