import { useState } from 'react'
import LiveDepartures from './components/LiveDepartures.jsx'
import PlanJourney from './components/PlanJourney.jsx'
import MyRoutes from './components/MyRoutes.jsx'
import ReportIssues from './components/ReportIssues.jsx'
import MapView from './components/MapView.jsx'

const NAV = [
  { id: 'departures', label: 'Live', icon: LiveIcon },
  { id: 'map', label: 'Map', icon: MapPinIcon },
  { id: 'plan', label: 'Plan', icon: MapIcon },
  { id: 'routes', label: 'My Routes', icon: StarIcon },
  { id: 'report', label: 'Report', icon: FlagIcon },
]

export default function App() {
  const [tab, setTab] = useState('departures')
  const [dark, setDark] = useState(false)

  const theme = {
    dark,
    bg: dark ? '#0f1117' : '#f5f7fa',
    card: dark ? '#1e2130' : '#ffffff',
    border: dark ? '#2a2f42' : '#e8ecf0',
    text: dark ? '#f0f2f8' : '#1a1d2e',
    sub: dark ? '#8890a8' : '#6b7280',
    accent: '#003DA5',
    accentLight: dark ? '#1a3a8c' : '#e8eef8',
    danger: '#e53e3e',
    success: '#38a169',
    warn: '#d69e2e',
  }

  const views = { departures: LiveDepartures, map: MapView, plan: PlanJourney, routes: MyRoutes, report: ReportIssues }
  const View = views[tab]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: theme.bg, minHeight: '100dvh', display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      {/* Status bar */}
      <div style={{ background: theme.accent, color: '#fff', padding: '10px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 500 }}>
        <span>TFI Dublin Bus</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 10, opacity: 0.8 }}>LIVE</span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <button onClick={() => setDark(d => !d)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12, padding: '2px 8px', color: '#fff', cursor: 'pointer', fontSize: 11 }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: tab === 'map' ? 'hidden' : 'auto', paddingBottom: tab === 'map' ? 0 : 80 }}>
        <View theme={theme} />
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: theme.card, borderTop: `1px solid ${theme.border}`, display: 'flex', padding: '8px 0 12px', zIndex: 100 }}>
        {NAV.map(n => {
          const active = tab === n.id
          return (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: active ? theme.accent : theme.sub, transition: 'color 0.15s' }}>
              <n.icon size={22} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{n.label}</span>
              {active && <div style={{ width: 20, height: 2, borderRadius: 1, background: theme.accent, marginTop: 1 }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LiveIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8l5 5-5 5" /><line x1="1" y1="20" x2="16" y2="20" />
    </svg>
  )
}
function MapPinIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function MapIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}
function StarIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function FlagIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}
