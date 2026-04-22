import { useState } from 'react'

const CATEGORIES = [
  { id: 'late', emoji: '⏰', label: 'Bus late / no show' },
  { id: 'skipped', emoji: '🚫', label: 'Stop skipped' },
  { id: 'driver', emoji: '🧑‍✈️', label: 'Driver behaviour' },
  { id: 'crowded', emoji: '👥', label: 'Overcrowding' },
  { id: 'cleanliness', emoji: '🧹', label: 'Cleanliness' },
  { id: 'accessibility', emoji: '♿', label: 'Accessibility issue' },
  { id: 'app', emoji: '📱', label: 'App / info wrong' },
  { id: 'other', emoji: '📋', label: 'Other' },
]

const MY_REPORTS = [
  { id: 'rep1', category: 'Bus late / no show', route: '46A', stop: 'O\'Connell St', date: '21 Apr', status: 'In Progress', ref: 'TFI-2891' },
  { id: 'rep2', category: 'App / info wrong', route: '7', stop: 'College Green', date: '18 Apr', status: 'Resolved', ref: 'TFI-2743' },
  { id: 'rep3', category: 'Overcrowding', route: '39A', stop: 'Nassau St', date: '15 Apr', status: 'Open', ref: 'TFI-2611' },
]

const statusColor = { Open: '#3b82f6', 'In Progress': '#d69e2e', Resolved: '#38a169' }
const statusBg = { Open: '#eff6ff', 'In Progress': '#fffbeb', Resolved: '#f0fdf4' }

export default function ReportIssues({ theme }) {
  const [step, setStep] = useState('home') // home | category | detail | confirm | submitted
  const [category, setCategory] = useState(null)
  const [detail, setDetail] = useState({ route: '', stop: 'O\'Connell St (GPS auto-filled)', description: '', rating: 0 })
  const [showMyReports, setShowMyReports] = useState(false)

  function reset() { setStep('home'); setCategory(null); setDetail({ route: '', stop: 'O\'Connell St (GPS auto-filled)', description: '', rating: 0 }) }

  if (step === 'submitted') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', minHeight: 400 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Report Submitted</div>
        <div style={{ fontSize: 14, color: theme.sub, marginBottom: 4 }}>Reference: <strong style={{ color: theme.text }}>TFI-{Math.floor(2900 + Math.random() * 100)}</strong></div>
        <div style={{ fontSize: 13, color: theme.sub, maxWidth: 280, lineHeight: 1.6, marginBottom: 8 }}>Your report has been received and routed to the Operations team. You\'ll receive a status update within 2 hours.</div>
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 16px', marginBottom: 24, fontSize: 13, color: '#166534' }}>
          📊 This report contributes to real-time service monitoring on 50+ routes
        </div>
        <button onClick={reset} style={{ padding: '12px 32px', borderRadius: 12, background: theme.accent, color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div>
        <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px' }}>
          <button onClick={() => setStep('detail')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }}>← Back</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Confirm Report</div>
          <StepDots current={3} theme={theme} />
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: theme.card, borderRadius: 14, padding: 16, border: `1px solid ${theme.border}`, marginBottom: 16 }}>
            <Row label="Issue type" value={`${category?.emoji} ${category?.label}`} theme={theme} />
            <Row label="Route" value={detail.route || 'Not specified'} theme={theme} />
            <Row label="Stop" value={detail.stop} theme={theme} />
            {detail.description && <Row label="Details" value={detail.description} theme={theme} />}
            {detail.rating > 0 && <Row label="Experience rating" value={'⭐'.repeat(detail.rating)} theme={theme} />}
          </div>
          <div style={{ fontSize: 12, color: theme.sub, marginBottom: 20, lineHeight: 1.6 }}>
            📍 Your current location will be attached to this report. Data is processed in accordance with GDPR and Dublin Bus privacy policy.
          </div>
          <button onClick={() => setStep('submitted')} style={{ width: '100%', padding: 14, borderRadius: 12, background: theme.accent, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Submit Report
          </button>
        </div>
      </div>
    )
  }

  if (step === 'detail') {
    return (
      <div>
        <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px 20px' }}>
          <button onClick={() => setStep('category')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }}>← Back</button>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{category?.emoji}</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{category?.label}</div>
          <StepDots current={2} theme={theme} />
        </div>
        <div style={{ padding: 20 }}>
          <Field label="Route number (e.g. 46A)" value={detail.route} onChange={v => setDetail(d => ({ ...d, route: v }))} placeholder="Enter route or leave blank" theme={theme} />
          <Field label="Stop / location" value={detail.stop} onChange={v => setDetail(d => ({ ...d, stop: v }))} theme={theme} note="📍 Auto-filled from GPS" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: theme.sub, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Additional details (optional)</div>
            <textarea value={detail.description} onChange={e => setDetail(d => ({ ...d, description: e.target.value }))} placeholder="Describe what happened…" rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize: 14, fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: theme.sub, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Rate your experience</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setDetail(d => ({ ...d, rating: n }))} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', opacity: n <= detail.rating ? 1 : 0.3, transition: 'opacity 0.15s' }}>⭐</button>
              ))}
            </div>
          </div>

          <button onClick={() => setStep('confirm')} style={{ width: '100%', padding: 14, borderRadius: 12, background: theme.accent, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Review Report →
          </button>
        </div>
      </div>
    )
  }

  if (step === 'category') {
    return (
      <div>
        <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px 20px' }}>
          <button onClick={() => setStep('home')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }}>← Back</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>What happened?</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Select the issue type</div>
          <StepDots current={1} theme={theme} />
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => { setCategory(c); setStep('detail') }} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '16px 12px', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', transition: 'border-color 0.15s' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{c.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, lineHeight: 1.3 }}>{c.label}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Home
  return (
    <div>
      <div style={{ background: theme.accent, color: '#fff', padding: '16px 20px 20px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Report an Issue</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Help improve Dublin Bus for everyone</div>
      </div>

      <div style={{ padding: 20 }}>
        {/* CTA */}
        <div style={{ background: theme.card, borderRadius: 16, padding: 20, border: `1px solid ${theme.border}`, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📢</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Something wrong?</div>
          <div style={{ fontSize: 13, color: theme.sub, marginBottom: 16, lineHeight: 1.5 }}>Report in 3 taps. Your feedback is routed directly to operations and helps improve service on 50+ routes.</div>
          <button onClick={() => setStep('category')} style={{ width: '100%', padding: '13px', borderRadius: 12, background: theme.accent, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Report an Issue
          </button>
        </div>

        {/* My reports toggle */}
        <button onClick={() => setShowMyReports(s => !s)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showMyReports ? 10 : 0 }}>
          <span>My Reports ({MY_REPORTS.length})</span>
          <span>{showMyReports ? '▲' : '▼'}</span>
        </button>

        {showMyReports && MY_REPORTS.map(rep => (
          <div key={rep.id} style={{ background: theme.card, borderRadius: 12, padding: '12px 16px', marginBottom: 8, border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{rep.category}</div>
                <div style={{ fontSize: 11, color: theme.sub, marginTop: 2 }}>Route {rep.route} · {rep.stop} · {rep.date}</div>
                <div style={{ fontSize: 11, color: theme.sub }}>Ref: {rep.ref}</div>
              </div>
              <div style={{ padding: '3px 10px', borderRadius: 20, background: statusBg[rep.status], color: statusColor[rep.status], fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{rep.status}</div>
            </div>
          </div>
        ))}

        {/* Stats */}
        <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 16px', marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 8 }}>Community impact this month</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['4,821', 'Reports filed'], ['94%', 'Resolution rate'], ['1.8 hrs', 'Avg resolution'], ['12', 'Routes improved']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}>{v}</div>
                <div style={{ fontSize: 11, color: '#166534', opacity: 0.8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepDots({ current, theme }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
      {[1, 2, 3].map(n => (
        <div key={n} style={{ height: 3, borderRadius: 2, flex: n <= current ? 1.5 : 1, background: n <= current ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'flex 0.2s' }} />
      ))}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, theme, note }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: theme.sub, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      {note && <div style={{ fontSize: 11, color: '#38a169', marginBottom: 4 }}>{note}</div>}
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  )
}

function Row({ label, value, theme }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: 13, color: theme.sub }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, textAlign: 'right', maxWidth: '60%' }}>{value}</div>
    </div>
  )
}
