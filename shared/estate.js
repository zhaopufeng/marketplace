import { getCoordsMatcher } from './parcel'

export function isEstate(asset) {
  return !!asset.parcels
}

export function getEstateByParcel(parcel, estates) {
  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(
      estate =>
        estate.data.parcels.filter(p => p.x === parcel.x && p.y === parcel.y)
          .length > 0
    )
}

export function areOnSameEstate(parcels, estateId) {
  return parcels.every(
    parcel => parcel.estate_id && parcel.estate_id === estateId
  )
}

export function toEstateObject(estatesArray) {
  const estate = {}
  estatesArray.forEach(e => {
    estate[e.id] = e
    estate[e.id].parcels = e.data.parcels
  })
  return estate
}

export function calculateZoomAndCenter(parcels) {
  const xs = [...new Set(parcels.map(coords => coords.x).sort())]
  const ys = [...new Set(parcels.map(coords => coords.y).sort())]
  const x = xs[parseInt(xs.length / 2, 10)]
  const y = ys[parseInt(ys.length / 2, 10)]
  const center = { x, y }
  const zoom = 1 / (xs.length + ys.length) * 7.5
  return { center, zoom }
}

export function getInitialEstate(x, y) {
  return {
    data: {
      name: '',
      description: '',
      parcels: [{ x, y }]
    }
  }
}

export function areConnected(
  parcels,
  remaining = [...parcels],
  alreadyTraveled = []
) {
  if (alreadyTraveled.length === parcels.length) {
    return true
  }

  if (remaining.length === 0) {
    return false
  }

  let actual = remaining.pop()

  const neighbours = getNeighbours(actual.x, actual.y, parcels).filter(
    coords => {
      return (
        parcels.some(getCoordsMatcher(coords)) &&
        !alreadyTraveled.some(getCoordsMatcher(coords))
      )
    }
  )

  return areConnected(parcels, remaining, [...alreadyTraveled, ...neighbours])
}

export function isNeighbour(x, y) {
  return coords =>
    (coords.x === x && (coords.y + 1 === y || coords.y - 1 === y)) ||
    (coords.y === y && (coords.x + 1 === x || coords.x - 1 === x))
}

export function hasNeighbour(x, y, parcels) {
  return parcels.some(isNeighbour(x, y))
}

export function getNeighbours(x, y, parcels) {
  return parcels.filter(isNeighbour(x, y))
}
