// src/components/DonationHistory.jsx
// Loads real NFT donation records from the blockchain

import { useEffect, useState } from 'react'

const fmt = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

export default function DonationHistory({ fetchDonations, provider, wallet }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!wallet || !provider) return
    setLoading(true)
    fetchDonations(provider, wallet)
      .then(setRecords)
      .finally(() => setLoading(false))
  }, [wallet, provider])

  if (!wallet) return (
    <p style={{ color: '#a07080', fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>
      Connect wallet to view your donation history
    </p>
  )

  if (loading) return (
    <p style={{ color: '#d4af37', fontSize: 12, fontFamily: "'Share Tech Mono',monospace", animation: 'blink 1s infinite' }}>
      ⛓️ Loading records from blockchain...
    </p>
  )

  if (records.length === 0) return (
    <p style={{ color: '#a07080', fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>
      No donations found for this wallet yet.
    </p>
  )

  return (
    <div>
      {records.map(rec => (
        <div key={rec.tokenId} style={{
          background: '#0e0609',
          border: '1px solid #2a1015',
          borderRadius: 8, padding: '12px 14px',
          marginBottom: 8,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 10,
        }}>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, color: '#e74c3c' }}>
              {rec.bloodType}
            </div>
            <div style={{ fontSize: 13, color: '#d0b0b8', marginTop: 2 }}>{rec.hospital}</div>
            <div style={{ fontSize: 11, color: '#a07080', fontFamily: "'Share Tech Mono',monospace", marginTop: 2 }}>
              {fmt(rec.donationDate)} · {rec.units} ml
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ fontSize: 11, fontFamily: "'Share Tech Mono',monospace", color: '#d4af37' }}>
              Token #{rec.tokenId}
            </div>
            <div style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 10,
              background: '#071a0e', border: '1px solid #1a6b35',
              color: '#2ecc71', fontFamily: "'Share Tech Mono',monospace"
            }}>
              ✔ On-Chain
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
