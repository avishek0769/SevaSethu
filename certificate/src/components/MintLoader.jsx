// src/components/MintLoader.jsx
// Shows animated 3-stage loading during blockchain transaction

const STAGES = [
  { key: 'signing',      icon: '✍️',  label: 'Waiting for MetaMask signature...' },
  { key: 'broadcasting', icon: '📡',  label: 'Broadcasting to Polygon network...' },
  { key: 'confirming',   icon: '⛓️',  label: 'Waiting for block confirmation...' },
  { key: 'done',         icon: '✅',  label: 'Certificate minted on blockchain!' },
]

const PROGRESS = { signing: 15, broadcasting: 45, confirming: 80, done: 100 }

export default function MintLoader({ step, txHash }) {
  const currentIdx = STAGES.findIndex(s => s.key === step)

  return (
    <div style={{
      background: '#0e0609',
      border: '1px solid #3a1a20',
      borderRadius: '10px',
      padding: '20px 24px',
      marginBottom: '20px',
    }}>
      {STAGES.map((s, i) => {
        const isDone   = i < currentIdx
        const isActive = s.key === step
        return (
          <div key={s.key} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 0',
            opacity: isDone || isActive ? 1 : 0.25,
            color: isDone ? '#2ecc71' : isActive ? '#f5a0b0' : '#f0e6e8',
            transition: 'all .4s',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: `1.5px solid ${isDone ? '#2ecc71' : isActive ? '#c0392b' : '#3a1a20'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13,
              animation: isActive ? 'pulseRing 1s infinite' : 'none',
            }}>
              {isDone ? '✓' : s.icon}
            </div>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: '.04em' }}>
              {s.label}
            </span>
          </div>
        )
      })}

      {/* Progress bar */}
      <div style={{ height: 3, background: '#1a0810', borderRadius: 2, marginTop: 14 }}>
        <div style={{
          height: '100%',
          width: `${PROGRESS[step] || 0}%`,
          background: 'linear-gradient(90deg,#8b0000,#d4af37)',
          borderRadius: 2,
          transition: 'width .8s ease',
        }} />
      </div>

      {/* Live TX hash link (once broadcast) */}
      {txHash && (
        <div style={{ marginTop: 12, fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
          <span style={{ color: '#a07080' }}>TX: </span>
          <a
            href={`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#d4af37', textDecoration: 'none' }}
          >
            {txHash.slice(0, 14)}...{txHash.slice(-10)} ↗
          </a>
        </div>
      )}
    </div>
  )
}
