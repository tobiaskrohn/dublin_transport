import { useState } from 'react'

const SAMPLE_RESULTS = [
  {
    id: 'r1',
    legs: [
      { type: 'walk', duration: '3 min', label: 'Walk to O\'Connell St' },
      { type: 'bus', route: '46A', color: '#003DA5', from: 'O\'Connell St', to: 'Donnybrook', duration: '14 min', departsIn: 4, crowding: 'Medium' },
      { type: 'walk', duration: '2 min', label: 'Walk to destination' },
    ],
    totalTime: '19 min', totalWalk: '5 min', changes: 0, arrivalTime: '18:42', co2: '0.8 kg saved vs car',
  },
  {
    id: 'r2',
    legs: [
      { type: 'walk', duration: '5 min', label: 'Walk to St. Stephen\'s Green' },
      { type: 'luas', route: 'Green', color: '#009A44', from: 'St. Stephen\'s Green', to: 'Ranelagh', duration: '9 min', departsIn: 2, crowding: 'Low' },
      { type: 'walk', duration: '4 min', label: 'Walk to destination' },
    ],
    totalTime: '18 min', totalWalk: '9 min', changes: 0, arrivalTime: '18:41', co2: '0.8 kg saved vs car',
  },
  {
    id: 'r3',
    legs: [
      { type: 'walk', duration: '2 min', label: 'Walk to Hawkins St' },
      { type: 'bus', route: '7', color: '#003DA5', from: 'Hawkins St', to: 'Donnybrook', duration: '18 min', departsIn: 8, crowding: 'High' },
      { type: 'walk', duration: '2 min', label: 'Walk to destination' },
    ],
    totalTime: '28 min', totalWalk: '4 min', changes: 0, arrivalTime: '18:51', co2: '0.8 kg saved vs car',
  },
]

export default function PlanJourney({ theme }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)

  const suggestions = ['O\'Connell St, Dublin 1', 'Heuston Station', 'UCD Belfield', 'Dún Laoghaire', 'Dublin Airport', 'Tallaght', 'Howth']

  function search() {
    if (!from || !to) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setResults(SAMPLE_RESULTS) }, 900)
  }

  function swap() {
    const tmp = from
    setFrom(to)
    setTo(tmp)
  }

  if (selectedResult) {
    return <JourneyDetail r={selectedResult} theme={theme} onBack={() => setSelectedResult(null)} />
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: theme.accent, padding: '16px 20px 24px', color: '#fff' }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Plan Journey</div>

        {/* Input card */}
        <div style={{ background: theme.card, borderRadius: 16, padding: 16, position: 'relative' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: theme.sub, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>From</div>
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Current location or stop name" style={{ width: '100%', border: 'none', fontSize: 14, color: theme.text, background: 'transparent', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ height: 1, background: theme.border }} />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: theme.sub, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>To</div>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="Destination" style={{ width: '100%', border: 'none', fontSize: 14, color: theme.text, background: 'transparent', outline: 'none', fontFamily: 'inherit' }} />
          </div>

          {/* Swap button */}
          <button onClick={swap} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: theme.accentLight, border: `1px solid ${theme.border}`, color: theme.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⇅</button>
        </div>

        <button onClick={search} disabled={!from || !to} style={{ width: '100%', marginTop: 12, padding: '13px', borderRadius: 12, background: from && to ? '#fff' : 'rgba(255,255,255,0.3)', color: from && to ? theme.accent : '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: from && to ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          {loading ? 'Finding routes…' : 'Search'}
        </button>
      </div>

      {/* Quick suggestions */}
      {!results && (
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: theme.sub, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}>Popular destinations</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => setTo(s)} style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div style={{ padding: '16px 16px' }}>
          <div style={{ fontSize: 13, color: theme.sub, marginBottom: 12 }}>{results.length} routes found</div>
          {results.map((r, i) => (
            <div key={r.id} onClick={() => setSelectedResult(r)} style={{ background: theme.card, borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${i === 0 ? theme.accent : theme.border}`, cursor: 'pointer', position: 'relative' }}>
              {i === 0 && <div style={{ position: 'absolute', top: -1, left: 16, background: theme.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase' }}>Fastest</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: i === 0 ? 8 : 0 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.text }}>{r.totalTime}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Arrive {r.arrivalTime}</div>
                  <div style={{ fontSize: 11, color: theme.sub }}>{r.totalWalk} walking · {r.changes === 0 ? 'No changes' : `${r.changes} change`}</div>
                </div>
              </div>

              {/* Journey line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {r.legs.map((leg, li) => (
                  <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: leg.type !== 'walk' ? 2 : 1 }}>
                    {leg.type === 'walk' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 14 }}>🚶</span>
                        <span style={{ fontSize: 10, color: theme.sub }}>{leg.duration}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: leg.color, position: 'relative' }}>
                          <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: leg.color, color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>{leg.type === 'luas' ? '🚊' : '🚌'} {leg.route}</div>
                        </div>
                      </div>
                    )}
                    {li < r.legs.length - 1 && <div style={{ width: 1, height: 12, background: theme.border }} />}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, fontSize: 11, color: '#38a169', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🌿</span> {r.co2}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function JourneyDetail({ r, theme, onBack }) {
  const now = new Date()
  return (
    <div>
      <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }}>← Back</button>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Journey Details</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Total: {r.totalTime} · Arrive {r.arrivalTime}</div>
      </div>
      <div style={{ padding: 20 }}>
        {r.legs.map((leg, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: leg.type === 'walk' ? theme.border : leg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                {leg.type === 'walk' ? '🚶' : leg.type === 'luas' ? '🚊' : '🚌'}
              </div>
              {i < r.legs.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 30, background: theme.border, margin: '4px 0' }} />}
            </div>
            <div style={{ paddingTop: 4 }}>
              {leg.type === 'walk' ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{leg.label}</div>
                  <div style={{ fontSize: 12, color: theme.sub }}>{leg.duration}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Board {leg.type === 'luas' ? 'LUAS' : 'Bus'} {leg.route}</div>
                  <div style={{ fontSize: 12, color: theme.sub }}>at {leg.from}</div>
                  <div style={{ marginTop: 6, padding: '6px 10px', borderRadius: 8, background: theme.accentLight, display: 'inline-block' }}>
                    <span style={{ fontSize: 12, color: theme.accent, fontWeight: 600 }}>Departs in {leg.departsIn} min · {leg.duration}</span>
                  </div>
                  <div style={{ fontSize: 12, color: theme.sub, marginTop: 6 }}>Alight at {leg.to} · Occupancy: <span style={{ fontWeight: 600, color: leg.crowding === 'High' ? '#e53e3e' : leg.crowding === 'Medium' ? '#d69e2e' : '#38a169' }}>{leg.crowding}</span></div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
