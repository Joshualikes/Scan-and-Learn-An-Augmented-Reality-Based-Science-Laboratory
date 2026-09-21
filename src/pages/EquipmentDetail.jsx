import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import { findMachine, withAiDetails } from '../lib/machines'
import { EquipmentArt } from '../components/EquipmentArt'
import { IconBack, IconCube, IconDownload, IconHeart, IconPrint } from '../components/Icons'

export default function EquipmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { equipment, bumpScan } = useApp()
  const item = withAiDetails(equipment.find((e) => e.id === id) || findMachine(id, equipment))
  const [tab, setTab] = useState('info')
  const [notes, setNotes] = useState('')

  if (!item) {
    return (
      <div className="panel-page">
        <p>Equipment not found.</p>
        <Link to="/inventory">Back to Inventory</Link>
      </div>
    )
  }

  const qrValue = item.qrPayload || `SCANLEARN:${item.id}`

  const downloadQr = () => {
    const svg = document.getElementById('detail-qr')
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.id}-qr.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printQr = () => {
    const svg = document.getElementById('detail-qr')
    if (!svg) return
    const popup = window.open('', '_blank', 'width=420,height=520')
    popup.document.write(
      `<html><body style="font-family:Poppins,sans-serif;text-align:center;padding:24px">${svg.outerHTML}<p>${item.name} (${item.id})</p></body></html>`,
    )
    popup.document.close()
    popup.focus()
    popup.print()
  }

  return (
    <div className="scan-result-app detail-as-scan">
      <header className="scan-result-head">
        <button type="button" className="scan-close light" onClick={() => navigate('/inventory')} aria-label="Back">
          <IconBack />
        </button>
        <div>
          <h2>{item.name}</h2>
          <p>{item.id}</p>
        </div>
        <button type="button" className="save-garden-btn" disabled>
          <IconHeart /> Saved to Equipment Inventory
        </button>
      </header>

      <div className="scan-result-photo muted-photo">
        <EquipmentArt type={item.name} />
      </div>

      <div className="scan-result-tabs">
        {[['notes', 'Notes'], ['info', 'Info'], ['care', 'Care Guide']].map(([key, label]) => (
          <button key={key} type="button" className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="scan-result-body">
        {tab === 'notes' && (
          <textarea
            className="scan-notes"
            rows="5"
            placeholder="Add notes about this hospital machine..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        )}
        {tab === 'info' && (
          <>
            <h3>Meaning</h3>
            <p>{item.meaning}</p>
            <h3>What is for</h3>
            <p>{item.whatFor}</p>
            <div className="detail-qr-row">
              <QRCodeSVG id="detail-qr" value={qrValue} size={120} />
              <div className="qr-actions">
                <button type="button" className="chip green" onClick={downloadQr}>
                  <IconDownload /> Download QR
                </button>
                <button type="button" className="chip" onClick={printQr}>
                  <IconPrint /> Print QR
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => {
                    bumpScan()
                    navigate(`/ar?id=${item.id}`)
                  }}
                >
                  <IconCube /> View in AR
                </button>
              </div>
            </div>
          </>
        )}
        {tab === 'care' && (
          <ul className="care-list">
            {(Array.isArray(item.safety) ? item.safety : [item.safety || 'Follow hospital equipment safety rules.']).map(
              (line) => (
                <li key={line}>{line}</li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
