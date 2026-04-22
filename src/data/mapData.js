// Real Dublin coordinates

export const DUBLIN_CENTER = [53.3498, -6.2603]

export const busStops = [
  { id: 'bs1', name: "O'Connell St (Stop 1)", lat: 53.3496, lng: -6.2602, routes: ['1', '7', '13', '39A', '46A'] },
  { id: 'bs2', name: 'College Green', lat: 53.3448, lng: -6.2597, routes: ['7', '39A', '46A'] },
  { id: 'bs3', name: 'Nassau St', lat: 53.3419, lng: -6.2543, routes: ['46A', '7', '145'] },
  { id: 'bs4', name: 'Hawkins St', lat: 53.3452, lng: -6.2562, routes: ['1', '13'] },
  { id: 'bs5', name: 'Donnybrook', lat: 53.3247, lng: -6.2302, routes: ['7', '46A', '39A'] },
  { id: 'bs6', name: 'Rathmines', lat: 53.3233, lng: -6.2665, routes: ['14', '83', '140'] },
  { id: 'bs7', name: "St. Stephen's Green", lat: 53.3381, lng: -6.2591, routes: ['Green', '14', '65'] },
  { id: 'bs8', name: 'Heuston Station', lat: 53.3461, lng: -6.2938, routes: ['145', 'Red'] },
  { id: 'bs9', name: 'Connolly Station', lat: 53.3521, lng: -6.2490, routes: ['Red', '1', '41'] },
  { id: 'bs10', name: 'Parnell Sq', lat: 53.3533, lng: -6.2637, routes: ['1', '13', '16'] },
  { id: 'bs11', name: 'UCD Belfield', lat: 53.3065, lng: -6.2235, routes: ['39A', '7'] },
  { id: 'bs12', name: 'Ranelagh', lat: 53.3279, lng: -6.2552, routes: ['Green', '14'] },
]

export const routeLines = [
  {
    id: 'r46a', route: '46A', color: '#003DA5', operator: 'Dublin Bus',
    path: [
      [53.3496, -6.2602], [53.3448, -6.2597], [53.3419, -6.2543],
      [53.3310, -6.2412], [53.3247, -6.2302], [53.3156, -6.2180],
      [53.3001, -6.1352],
    ],
  },
  {
    id: 'r7', route: '7', color: '#003DA5', operator: 'Dublin Bus',
    path: [
      [53.3496, -6.2602], [53.3452, -6.2562], [53.3448, -6.2597],
      [53.3310, -6.2412], [53.3247, -6.2302], [53.3065, -6.2235],
    ],
  },
  {
    id: 'r39a', route: '39A', color: '#0066CC', operator: 'Dublin Bus',
    path: [
      [53.3496, -6.2602], [53.3419, -6.2543], [53.3310, -6.2412],
      [53.3247, -6.2302], [53.3065, -6.2235],
    ],
  },
  {
    id: 'luas-green', route: 'Green', color: '#009A44', operator: 'LUAS',
    path: [
      [53.3381, -6.2591], [53.3279, -6.2552], [53.3233, -6.2665],
      [53.3156, -6.2580], [53.3001, -6.2490], [53.2801, -6.2103],
    ],
  },
  {
    id: 'luas-red', route: 'Red', color: '#E2231A', operator: 'LUAS',
    path: [
      [53.3461, -6.2938], [53.3480, -6.2820], [53.3460, -6.2690],
      [53.3452, -6.2562], [53.3521, -6.2490], [53.3490, -6.2350],
    ],
  },
  {
    id: 'r145', route: '145', color: '#003DA5', operator: 'Dublin Bus',
    path: [
      [53.3461, -6.2938], [53.3363, -6.2765], [53.3233, -6.2665],
      [53.2850, -6.2512], [53.2660, -6.3610],
    ],
  },
]

// Simulate a few live buses along their routes
export function getLiveBuses() {
  const time = Date.now()
  return routeLines.map((r, i) => {
    const progress = ((time / 1000 / (30 + i * 7)) % 1)
    const idx = Math.min(Math.floor(progress * (r.path.length - 1)), r.path.length - 2)
    const t = (progress * (r.path.length - 1)) - idx
    const [lat1, lng1] = r.path[idx]
    const [lat2, lng2] = r.path[idx + 1]
    return {
      id: `bus-${r.id}`,
      route: r.route,
      color: r.color,
      operator: r.operator,
      lat: lat1 + (lat2 - lat1) * t,
      lng: lng1 + (lng2 - lng1) * t,
      delayed: Math.abs(Math.sin(time / 30000 + i)) > 0.8,
      crowding: ['Low', 'Medium', 'High'][i % 3],
    }
  })
}
