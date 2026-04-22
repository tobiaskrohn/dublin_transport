import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DUBLIN_CENTER, busStops, routeLines, getLiveBuses } from '../data/mapData'

export default function MapView({ theme }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const busMarkersRef = useRef({})
  const routeLinesRef = useRef({})
  const [activeRoutes, setActiveRoutes] = useState(new Set(routeLines.map(r => r.id)))
  const [info, setInfo] = useState(null)

  // Init map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = L.map(containerRef.current, {
      center: DUBLIN_CENTER,
      zoom: 13,
      zoomControl: false,
    })

    L.tileLayer(
      theme.dark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>, © CARTO', maxZoom: 19 }
    ).addTo(map)

    // Bus stops
    busStops.forEach(stop => {
      const icon = L.divIcon({
        html: `<div style="width:10px;height:10px;border-radius:50%;background:#fff;border:2.5px solid #003DA5;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        iconAnchor: [5, 5],
        className: '',
      })
      L.marker([stop.lat, stop.lng], { icon })
        .addTo(map)
        .on('click', () => setInfo({ type: 'stop', ...stop }))
    })

    // Route polylines
    routeLines.forEach(r => {
      const line = L.polyline(r.path, { color: r.color, weight: 5, opacity: 0.85 }).addTo(map)
      routeLinesRef.current[r.id] = line
    })

    // User location dot
    L.marker([53.3488, -6.261], {
      icon: L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 5px rgba(59,130,246,0.25)"></div>`,
        iconAnchor: [7, 7],
        className: '',
      }),
    }).addTo(map)

    mapRef.current = map
    map.invalidateSize()

    return () => {
      map.remove()
      mapRef.current = null
      busMarkersRef.current = {}
      routeLinesRef.current = {}
    }
  }, [])

  // Animate buses every 2s
  useEffect(() => {
    function tick() {
      if (!mapRef.current) return
      getLiveBuses().forEach(b => {
        const html = `<div style="background:${b.delayed ? '#d69e2e' : b.color};color:#fff;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;font-family:Inter,sans-serif;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);white-space:nowrap;cursor:pointer">${b.operator === 'LUAS' ? '🚊' : '🚌'} ${b.route}</div>`
        const icon = L.divIcon({ html, iconAnchor: [22, 14], className: '' })
        if (busMarkersRef.current[b.id]) {
          busMarkersRef.current[b.id].setLatLng([b.lat, b.lng])
          busMarkersRef.current[b.id].setIcon(icon)
        } else {
          const m = L.marker([b.lat, b.lng], { icon, zIndexOffset: 500 }).addTo(mapRef.current)
          m.on('click', () => setInfo({ type: 'bus', ...b }))
          busMarkersRef.current[b.id] = m
        }
      })
    }
    tick()
    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [])

  // Toggle route lines
  useEffect(() => {
    routeLines.forEach(r => {
      const line = routeLinesRef.current[r.id]
      if (!line || !mapRef.current) return
      if (activeRoutes.has(r.id)) {
        if (!mapRef.current.hasLayer(line)) line.addTo(mapRef.current)
      } else {
        if (mapRef.current.hasLayer(line)) line.remove()
      }
    })
  }, [activeRoutes])

  function toggleRoute(id) {
    setActiveRoutes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const mapHeight = window.innerHeight - 130

  return (
    <div style={{ position: 'relative' }}>
      {/* The map */}
      <div ref={containerRef} style={{ width: '100%', height: mapHeight }} />

      {/* Filter panel */}
      <FilterPanel activeRoutes={activeRoutes} toggleRoute={toggleRoute} theme={theme} />

      {/* Info popup */}
      {info && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 1000, background: theme.card, borderRadius: 16, padding: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
          <button onClick={() => setInfo(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: theme.sub }}>×</button>
          {info.type === 'bus' ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
                {info.operator} {info.route}
              </div>
              <div style={{ fontSize: 13, color: theme.sub, marginBottom: 8 }}>Vehicle ID: DB-{Math.floor(Math.abs(info.lat) * 1000) % 9000 + 1000}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Chip label={`${info.crowding} occupancy`} color={info.crowding === 'High' ? '#e53e3e' : info.crowding === 'Medium' ? '#d69e2e' : '#38a169'} />
                {info.delayed && <Chip label="Delayed ~6 min" color="#d69e2e" />}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 6 }}>{info.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {info.routes.map(r => <Chip key={r} label={r} color="#003DA5" />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function FilterPanel({ activeRoutes, toggleRoute, theme }) {
  const [open, setOpen] = useState(true)
  const operators = [
    { label: 'Dublin Bus', color: '#003DA5', routes: routeLines.filter(r => r.operator === 'Dublin Bus') },
    { label: 'LUAS', color: '#009A44', routes: routeLines.filter(r => r.operator === 'LUAS') },
  ]
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1000 }}>
      <div style={{ background: theme.card, borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <button onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Live Map · {activeRoutes.size} routes</span>
          </div>
          <span style={{ color: theme.sub, fontSize: 11 }}>{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div style={{ padding: '0 14px 12px', borderTop: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.sub, margin: '8px 0', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>Filter routes</div>
            {operators.map(op => (
              <div key={op.label} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: op.color, marginBottom: 5 }}>{op.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {op.routes.map(r => {
                    const on = activeRoutes.has(r.id)
                    return (
                      <button key={r.id} onClick={() => toggleRoute(r.id)} style={{ padding: '3px 10px', borderRadius: 10, border: `1.5px solid ${r.color}`, background: on ? r.color : 'transparent', color: on ? '#fff' : r.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {r.route}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 14, fontSize: 11, color: theme.sub }}>
              <span>🔵 You</span><span>⚪ Stop</span><span>🚌 Bus</span><span>⚠️ Delayed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Chip({ label, color }) {
  return <div style={{ padding: '3px 10px', borderRadius: 10, background: `${color}20`, color, fontSize: 12, fontWeight: 600 }}>{label}</div>
}
