// src/components/Certificate.jsx
// Renders the beautiful NFT certificate card

const fmt = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

export default function Certificate({ data, tokenId, txHash, wallet }) {
  const scanUrl  = `https://amoy.polygonscan.com/tx/${txHash}`
  const shortTx  = txHash ? txHash.slice(0, 14) + '...' + txHash.slice(-8) : '—'
  const shortWal = wallet ? wallet.slice(0, 10) + '...' + wallet.slice(-8) : '—'

  const download = () => {
    // In production: use html2canvas to screenshot the cert div, then jsPDF to save
    // For now: browser print dialog
    window.print()
  }

  return (
    <div id="certificate-root" style={{ marginBottom: 20, animation: 'fadeUp .6s ease' }}>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#071a0e', border: '1px solid #1a6b35',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, color: '#2ecc71', fontFamily: "'Share Tech Mono',monospace"
        }}>✔ Verified on Polygon</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#150a1a', border: '1px solid #4a2a6a',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, color: '#a855f7', fontFamily: "'Share Tech Mono',monospace"
        }}>◆ ERC-721 NFT</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#1a1205', border: '1px solid #d4af37',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, color: '#d4af37', fontFamily: "'Share Tech Mono',monospace"
        }}>Token #{tokenId}</span>
      </div>

      {/* Gold gradient border wrapper */}
      <div style={{
        padding: 3,
        borderRadius: 14,
        background: 'linear-gradient(135deg,#d4af37,#8b0000,#d4af37,#8b0000,#d4af37)',
      }}>
        {/* Certificate body */}
        <div style={{
          background: 'linear-gradient(160deg,#130810 0%,#0d0508 50%,#130810 100%)',
          borderRadius: 12,
          padding: '28px 28px 22px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Watermark */}
          <div style={{
            position: 'absolute', fontSize: 160, opacity: .04,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
          }}>🩸</div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 22, borderBottom: '1px solid #3a1510', paddingBottom: 16 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '.3em', color: '#d4af37', marginBottom: 6 }}>
              ✦ LIFELINE BLOOD NETWORK ✦
            </div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 700, color: '#f5d76e', letterSpacing: '.1em' }}>
              Official Donor Certificate
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: '#a07080', letterSpacing: '.15em', marginTop: 4 }}>
              Blockchain Verified · Immutable Record
            </div>
          </div>

          {/* Donor fields grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 20 }}>
            {[
              ['Donor Name',   data.donorName],
              ['Blood Type',   data.bloodType, true],
              ['Hospital',     data.hospital],
              ['City',         data.city || '—'],
              ['Verified By',  data.doctorName || 'Self-declared'],
              ['Donation Date',fmt(data.donationDate)],
              ['Units',        `1 bag · ${data.units || 450} ml`],
              ['Wallet',       shortWal, false, true],
            ].map(([label, val, isBig, isMono]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: '#a07080', fontFamily: "'Share Tech Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                  {label}
                </div>
                <div style={{
                  fontSize:    isBig  ? 22 : isMono ? 11 : 14,
                  fontWeight:  isBig  ? 700 : 500,
                  fontFamily:  isBig  ? "'Cinzel',serif" : isMono ? "'Share Tech Mono',monospace" : 'inherit',
                  color:       isBig  ? '#e74c3c' : isMono ? '#d4af37' : '#f0e0e4',
                  wordBreak:   'break-all',
                }}>
                  {val}
                </div>
              </div>
            ))}
          </div>

          {/* Chain data box */}
          <div style={{
            background: '#0a0306', borderRadius: 8,
            padding: '12px 14px', marginBottom: 16,
            border: '1px solid #2a0f16',
          }}>
            {[
              ['TX HASH',   shortTx],
              ['NETWORK',   'Hardhat Localhost'],
              ['CONTRACT',  '0x7f3a...b821f3d921'],
              ['STANDARD',  'ERC-721 · IPFS Metadata'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontFamily: "'Share Tech Mono',monospace", color: '#a07080', letterSpacing: '.08em' }}>{label}</span>
                <span style={{ fontSize: 11, fontFamily: "'Share Tech Mono',monospace", color: '#d4af37' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={scanUrl} target="_blank" rel="noreferrer" style={btnStyle('#c0392b')}>🔗 PolygonScan</a>
              <button onClick={download} style={btnStyle('#d4af37', true)}>⬇ Download PDF</button>
            </div>
            <div style={{ fontSize: 10, fontFamily: "'Share Tech Mono',monospace", color: '#5a3040', textAlign: 'right' }}>
              LIFELINE·NFT<br />v1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const btnStyle = (color, isGold) => ({
  padding: '8px 14px', borderRadius: 6,
  fontSize: 11, cursor: 'pointer',
  fontFamily: "'Share Tech Mono',monospace",
  letterSpacing: '.04em',
  border: `1px solid ${color}`,
  background: isGold ? '#1a1205' : '#1a080e',
  color: color,
  textDecoration: 'none',
  display: 'inline-block',
  transition: 'all .2s',
})
