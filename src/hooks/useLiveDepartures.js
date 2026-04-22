import { useState, useEffect, useCallback } from 'react'
import { busRoutes } from '../data/routes'

function jitter(base, variance) {
  return base + Math.floor((Math.random() - 0.5) * variance * 2)
}

function generateDepartures(stopId) {
  const now = new Date()
  const departures = []

  busRoutes.forEach((r) => {
    const count = r.operator === 'LUAS' ? 2 : 3
    for (let i = 0; i < count; i++) {
      const baseMin = jitter(r.frequency * i + (i === 0 ? 2 : 0), 3)
      const mins = Math.max(0, baseMin)
      const due = new Date(now.getTime() + mins * 60000)
      const delayed = Math.random() < 0.2
      const delayMins = delayed ? jitter(6, 3) : 0
      const crowding = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]

      departures.push({
        id: `${r.id}-${i}-${Date.now()}`,
        route: r.route,
        destination: r.destination,
        operator: r.operator,
        color: r.color,
        mins: mins + delayMins,
        scheduledMins: mins,
        due,
        delayed,
        delayMins,
        crowding,
        vehicleId: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
        accessibility: Math.random() > 0.15,
      })
    }
  })

  return departures.sort((a, b) => a.mins - b.mins)
}

export function useLiveDepartures(stopId) {
  const [departures, setDepartures] = useState(() => generateDepartures(stopId))
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refresh = useCallback(() => {
    setDepartures(generateDepartures(stopId))
    setLastUpdated(new Date())
  }, [stopId])

  useEffect(() => {
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [refresh])

  return { departures, lastUpdated, refresh }
}
