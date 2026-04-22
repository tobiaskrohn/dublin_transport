import { useState } from 'react'
import { useLiveDepartures } from '../hooks/useLiveDepartures'

const SAVED = [
  { id: 'sr1', name: 'Home to Work', from: 'Ranelagh', to: 'O\'Connell St', routes: ['14', '83', '140'], stopId: 's001', icon: '🏠→💼' },
  { id: 'sr2', name: 'UCD Commute', from: 'O\'Connell St', to: 'UCD Belfield', routes: ['39A', '7'], stopId: 's002', icon: '🎓' },
  { id: 'sr3', name: 'Airport', from: 'City Centre', to: 'Dublin Airport', routes: ['16', '41', 'Airlink'], stopId: 's004', icon: '✈️' },
]

const STATS = [
  { label: 'Trips this month', value: '47', icon: '🚌' },
  { label: 'CO₂ saved', value: '18.4 kg', icon: '🌿' },
  { label: 'Avg wait time', value: '4.2 min', icon: '⏱️' },
  { label: 'On-time rate', value: '82%', icon: '✅' },
]

export default function MyRoutes({ theme }) {
  const [activeRoute, setActiveRoute] = useState(null)
  const { departures } = useLiveDepartures('s001')

  if (activeRoute) {
    const nextDep = departures.filter(d => activeRoute.routes.some(r => d.route.includes(r))).slice(0, 3)
    return (
      <div>
        <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px' }}>
          <button onClick={() => setActiveRoute(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }}>← Back</button>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{activeRoute.icon}</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{activeRoute.name}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{activeRoute.from} → {activeRoute.to}</div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: theme.sub, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}>Next departures</div>
          {nextDep.length > 0 ? nextDep.map(d => (
            <div key={d.id} style={{ background: theme.card, borderRadius: 12, padding: '12px 16px', marginBottom: 8, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: d.color, color: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 13, fontWeight: 700 }}>{d.route}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{d.destination}</div>
                <div style={{ fontSize: 11, color: d.crowding === 'High' ? '#e53e3e' : d.crowding === 'Medium' ? '#d69e2e' : '#38a169' }}>{d.crowding} occupancy</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: d.mins <= 1 ? '#38a169' : theme.text }}>{d.mins <= 1 ? 'Due' : `${d.mins}m`}</div>
            </div>
          )) : (
            <div style={{ color: theme.sub, fontSize: 14, textAlign: 'center', padding: 20 }}>No matching departures nearby</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px 20px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>My Routes</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Your saved journeys & travel stats</div>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: theme.card, borderRadius: 12, padding: 14, border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: theme.sub }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Saved routes */}
      <div style={{ padding: '16px 16px' }}>
        <div style={{ fontSize: 13, color: theme.sub, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}>Saved routes</div>
        {SAVED.map(r => (
          <div key={r.id} onClick={() => setActiveRoute(r)} style={{ background: theme.card, borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{r.name}</div>
              <div style={{ fontSize: 12, color: theme.sub, marginTop: 2 }}>{r.from} → {r.to}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {r.routes.map(rt => (
                  <div key={rt} style={{ padding: '2px 7px', borderRadius: 8, background: theme.accentLight, color: theme.accent, fontSize: 10, fontWeight: 700 }}>{rt}</div>
                ))}
              </div>
            </div>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.sub} strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        ))}

        <button style={{ width: '100%', padding: 14, borderRadius: 14, border: `2px dashed ${theme.border}`, background: 'transparent', color: theme.sub, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>+</span> Add saved route
        </button>
      </div>
    </div>
  )
}
