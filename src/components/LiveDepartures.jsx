import { useState } from 'react'
import { useLiveDepartures } from '../hooks/useLiveDepartures'
import { nearbyStops } from '../data/routes'

export default function LiveDepartures({ theme }) {
  const [selectedStop, setSelectedStop] = useState(nearbyStops[0])
  const [filter, setFilter] = useState('All')
  const { departures, lastUpdated } = useLiveDepartures(selectedStop.id)

  const operators = ['All', 'Dublin Bus', 'LUAS']
  const filtered = filter === 'All' ? departures : departures.filter(d => d.operator === filter)
  const delayed = filtered.filter(d => d.delayed)

  return (
    <div>
      {/* Header */}
      <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px 20px' }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nearby Stop</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selectedStop.name}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{selectedStop.distance} away · {selectedStop.routes.join(' · ')}</div>

        {/* Stop selector */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {nearbyStops.map(s => (
            <button key={s.id} onClick={() => setSelectedStop(s)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.4)', background: s.id === selectedStop.id ? 'rgba(255,255,255,0.25)' : 'transparent', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: s.id === selectedStop.id ? 600 : 400 }}>
              {s.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Alert banner */}
      {delayed.length > 0 && (
        <div style={{ background: '#fef3c7', borderBottom: `1px solid #fcd34d`, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
            {delayed.length} service{delayed.length > 1 ? 's' : ''} delayed — tap for details
          </span>
        </div>
      )}

      {/* Live indicator + filter */}
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: theme.sub }}>Updated {lastUpdated.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {operators.map(op => (
            <button key={op} onClick={() => setFilter(op)} style={{ padding: '4px 10px', borderRadius: 12, border: `1px solid ${filter === op ? theme.accent : theme.border}`, background: filter === op ? theme.accentLight : 'transparent', color: filter === op ? theme.accent : theme.sub, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: filter === op ? 600 : 400 }}>
              {op}
            </button>
          ))}
        </div>
      </div>

      {/* Departures list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.slice(0, 12).map(d => (
          <DepartureCard key={d.id} d={d} theme={theme} />
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}

function DepartureCard({ d, theme }) {
  const [expanded, setExpanded] = useState(false)
  const crowdingColor = { Low: '#38a169', Medium: '#d69e2e', High: '#e53e3e' }[d.crowding]
  const isNow = d.mins <= 1

  return (
    <div onClick={() => setExpanded(e => !e)} style={{ background: theme.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${d.delayed ? '#fcd34d' : theme.border}`, cursor: 'pointer', transition: 'box-shadow 0.15s', boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.08)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Route badge */}
        <div style={{ background: d.color, color: '#fff', borderRadius: 8, minWidth: 46, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
          {d.operator === 'LUAS' ? '🚊' : '🚌'} {d.route}
        </div>

        {/* Route info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.destination}</div>
          <div style={{ fontSize: 11, color: theme.sub, marginTop: 2 }}>{d.operator} · {d.vehicleId}</div>
        </div>

        {/* Time */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: isNow ? theme.success : d.delayed ? theme.warn : theme.text, lineHeight: 1 }}>
            {isNow ? 'Due' : `${d.mins}m`}
          </div>
          {d.delayed && (
            <div style={{ fontSize: 10, color: theme.warn, fontWeight: 500 }}>+{d.delayMins}m delay</div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        <Tag color={crowdingColor} label={`${d.crowding} occupancy`} />
        {d.accessibility && <Tag color="#3b82f6" label="♿ Accessible" />}
        {d.delayed && <Tag color="#d69e2e" label={`Delayed ${d.delayMins} min`} bg="#fef3c7" textColor="#92400e" />}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 12, color: theme.sub, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Next stops</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' }}>
            {['Baggot St', d.destination.split(' ')[0], 'Donnybrook', d.destination].map((stop, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === arr.length - 1 ? d.color : theme.sub }} />
                <span style={{ fontSize: 11, color: i === arr.length - 1 ? theme.text : theme.sub, fontWeight: i === arr.length - 1 ? 600 : 400 }}>{stop}</span>
                {i < arr.length - 1 && <div style={{ width: 20, height: 1, background: theme.border }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Tag({ color, label, bg, textColor }) {
  return (
    <div style={{ padding: '2px 8px', borderRadius: 10, background: bg || `${color}20`, color: textColor || color, fontSize: 10, fontWeight: 600 }}>
      {label}
    </div>
  )
}
