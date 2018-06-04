import { buildCoordinate } from 'lib/utils'

export const calculateZoomAndCenter = parcels => {
  const xs = [...new Set(parcels.map(coords => coords.x).sort())]
  const ys = [...new Set(parcels.map(coords => coords.y).sort())]
  const x = xs[parseInt(xs.length / 2, 10)]
  const y = ys[parseInt(ys.length / 2, 10)]
  const center = { x, y }
  const zoom = 1 / (xs.length + ys.length) * 7.5
  return { center, zoom }
}

export const toEstateObject = estatesArray => {
  const estate = {}
  estatesArray.forEach(e => {
    estate[e.id] = e
  })
  return estate
}

export const getParcelEstate = (estates, parcel) => {
  if (!parcel.in_estate) {
    return
  }

  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(estate => estate.parcels.some(p => p.id === parcel.id))
}

export const getEstateConnections = (parcel, estate) => {
  const { x, y } = parcel
  const leftId = buildCoordinate(x - 1, y)
  const topId = buildCoordinate(x, y + 1)
  const topLeftId = buildCoordinate(x - 1, y + 1)

  const connectedLeft = estate.parcels.some(
    p => buildCoordinate(p.x, p.y) === leftId
  )
  const connectedTop = estate.parcels.some(
    p => buildCoordinate(p.x, p.y) === topId
  )
  const connectedTopLeft = estate.parcels.some(
    p => buildCoordinate(p.x, p.y) === topLeftId
  )

  return { connectedLeft, connectedTop, connectedTopLeft }
}