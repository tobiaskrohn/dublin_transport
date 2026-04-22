import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DUBLIN_CENTER, busStops, routeLines, getLiveBuses } from '../data/mapData'

// Fix default icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function busIcon(color, route, delayed) {
  const bg = delayed ? '#d69e2e' : color
  return L.divIcon({
    className: '',
    html: `<div style="background:${bg};color:#fff;border-radius:8px;padding:3px 6px;font-size:11px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;gap:3px">
      ${color === '#E2231A' || color === '#009A44' ? '🚊' : '🚌'} ${route}
    </div>`,
    iconAnchor: [20, 14],
  })
}

function stopIcon(active) {
  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${active ? '#003DA5' : '#fff'};border:2.5px solid ${active ? '#003DA5' : '#6b7280'};box-shadow:0 1px 4px rgba(0,0,0,0.25)"></div>`,
    iconAnchor: [6, 6],
  })
}

function userIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`,
    iconAnchor: [8, 8],
  })
}

function LiveBuses({ buses }) {
  return buses.map(b => (
    <Marker key={b.id} position={[b.lat, b.lng]} icon={busIcon(b.color, b.route, b.delayed)} zIndexOffset={100}>
      <Popup>
        <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 140 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{b.operator} {b.route}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Vehicle ID: DB-{Math.floor(1000 + Math.abs(b.lat) * 1000) % 9000 + 1000}</div>
          {b.delayed && <div style={{ color: '#d69e2e', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>⚠️ Delayed ~6 min</div>}
          <div style={{ fontSize: 12 }}>Occupancy: <span style={{ fontWeight: 600, color: b.crowding === 'High' ? '#e53e3e' : b.crowding === 'Medium' ? '#d69e2e' : '#38a169' }}>{b.crowding}</span></div>
        </div>
      </Popup>
    </Marker>
  ))
}

function AnimatedBuses() {
  const [buses, setBuses] = useState(getLiveBuses)
  useEffect(() => {
    const id = setInterval(() => setBuses(getLiveBuses()), 2000)
    return () => clearInterval(id)
  }, [])
  return <LiveBuses buses={buses} />
}

function RecenterButton({ center }) {
  const map = useMap()
  return (
    <div style={{ position: 'absolute', bottom: 90, right: 12, zIndex: 1000 }}>
      <button onClick={() => map.setView(center, 13)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📍</button>
    </div>
  )
}

export default function MapView({ theme }) {
  const [activeRoutes, setActiveRoutes] = useState(new Set(routeLines.map(r => r.id)))
  const [selectedStop, setSelectedStop] = useState(null)
  const [showPanel, setShowPanel] = useState(true)

  function toggleRoute(id) {
    setActiveRoutes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const operators = [
    { label: 'Dublin Bus', color: '#003DA5', routes: routeLines.filter(r => r.operator === 'Dublin Bus') },
    { label: 'LUAS', color: '#009A44', routes: routeLines.filter(r => r.operator === 'LUAS') },
  ]

  return (
    <div style={{ position: 'relative', height: 'calc(100dvh - 130px)' }}>
      {/* Map */}
      <MapContainer
        center={DUBLIN_CENTER}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={theme.dark
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
        />

        {/* Route lines */}
        {routeLines.filter(r => activeRoutes.has(r.id)).map(r => (
          <Polyline key={r.id} positions={r.path} pathOptions={{ color: r.color, weight: 4, opacity: 0.85 }} />
        ))}

        {/* Bus stops */}
        {busStops.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={stopIcon(selectedStop?.id === s.id)} eventHandlers={{ click: () => setSelectedStop(s) }}>
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {s.routes.map(r => (
                    <span key={r} style={{ padding: '1px 6px', borderRadius: 6, background: '#003DA520', color: '#003DA5', fontSize: 11, fontWeight: 700 }}>{r}</span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location */}
        <Marker position={[53.3488, -6.2610]} icon={userIcon()}>
          <Popup><div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13 }}>📍 Your location</div></Popup>
        </Marker>

        {/* Live buses */}
        <AnimatedBuses />

        <RecenterButton center={DUBLIN_CENTER} />
      </MapContainer>

      {/* Legend / filter panel */}
      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1000, pointerEvents: 'none' }}>
        <div style={{ background: theme.card, borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', overflow: 'hidden', pointerEvents: 'all' }}>
          <button onClick={() => setShowPanel(p => !p)} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Live Map · {activeRoutes.size} routes shown</span>
            </div>
            <span style={{ color: theme.sub, fontSize: 12 }}>{showPanel ? '▲' : '▼'}</span>
          </button>

          {showPanel && (
            <div style={{ padding: '0 14px 12px', borderTop: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 11, color: theme.sub, marginBottom: 8, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>Filter routes</div>
              {operators.map(op => (
                <div key={op.label} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: op.color, marginBottom: 4 }}>{op.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {op.routes.map(r => {
                      const on = activeRoutes.has(r.id)
                      return (
                        <button key={r.id} onClick={() => toggleRoute(r.id)} style={{ padding: '3px 10px', borderRadius: 10, border: `1.5px solid ${r.color}`, background: on ? r.color : 'transparent', color: on ? '#fff' : r.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}>
                          {r.route}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 16, fontSize: 11, color: theme.sub }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', border: '2px solid #fff', boxShadow: '0 0 0 2px rgba(59,130,246,0.3)' }} /> You</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid #6b7280' }} /> Stop</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 12 }}>🚌</span> Live bus</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 12 }}>⚠️</span> Delayed</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
