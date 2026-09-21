import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import { EquipmentArt } from '../components/EquipmentArt'
import { IconCamera, IconCheck, IconClose, IconHeart } from '../components/Icons'
import { HOSPITAL_MACHINES, matchInventoryQr, toInventoryRecord } from '../lib/machines'
import { useApp } from '../context/AppContext'

const ANALYZE_STEPS = ['Analyzing image', 'Detecting Hospital Machine', 'Identifying with AI']
const UNKNOWN = {
  id: 'UNKNOWN',
  name: 'Unknown',
  category: 'Not available',
  meaning: 'This scan did not match a hospital machine QR code from Equipment Inventory.',
  whatFor: 'Scan a QR code generated on the Equipment Inventory page for a hospital machine.',
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Scan() {
  const { equipment, bumpScan, upsertEquipment } = useApp()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const equipmentRef = useRef(equipment)
  const lockedRef = useRef(false)
  equipmentRef.current = equipment

  const [cameraOn, setCameraOn] = useState(false)
  const [phase, setPhase] = useState('camera')
  const [step, setStep] = useState(0)
  const [item, setItem] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [snapshot, setSnapshot] = useState('')
  const [tab, setTab] = useState('info')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) return null
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
  }

  const runAnalysis = async (found, photo) => {
    if (lockedRef.current) return
    lockedRef.current = true
    setSnapshot(photo)
    setPhase('analyzing')
    setStep(0)
    await wait(700)
    setStep(1)
    await wait(900)
    setStep(2)
    await wait(800)
    setItem(found)
    setConfidence(found ? 94 : 0)
    setTab('info')
    setNotes('')
    setSaved(Boolean(found && equipmentRef.current.some((row) => row.id === found.id)))
    setPhase('result')
  }

  const resolveQr = (raw) => {
    const matched = matchInventoryQr(raw, [...HOSPITAL_MACHINES, ...equipmentRef.current])
    return matched && HOSPITAL_MACHINES.some((machine) => machine.id === matched.id) ? matched : null
  }

  useEffect(() => {
    let active = true
    let raf

    const tick = () => {
      if (!active || lockedRef.current) {
        raf = requestAnimationFrame(tick)
        return
      }
      const image = captureFrame()
      if (image) {
        const code = jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' })
        if (code?.data) {
          const photo = canvasRef.current?.toDataURL('image/jpeg', 0.85) || ''
          runAnalysis(resolveQr(code.data), photo)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraOn(true)
          raf = requestAnimationFrame(tick)
        }
      } catch {
        setCameraOn(false)
      }
    }

    start()
    return () => {
      active = false
      cancelAnimationFrame(raf)
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const takePhoto = () => {
    if (lockedRef.current) return
    const image = captureFrame()
    const photo = canvasRef.current?.toDataURL('image/jpeg', 0.85) || ''
    if (!image) {
      runAnalysis(null, photo)
      return
    }
    const code = jsQR(image.data, image.width, image.height, { inversionAttempts: 'attemptBoth' })
    runAnalysis(code?.data ? resolveQr(code.data) : null, photo)
  }

  const scanAgain = () => {
    lockedRef.current = false
    setPhase('camera')
    setStep(0)
    setItem(null)
    setConfidence(0)
    setSnapshot('')
    setSaved(false)
    setNotes('')
  }

  const saveToInventory = () => {
    if (!item) return
    const record = toInventoryRecord(item)
    upsertEquipment(record)
    bumpScan()
    setSaved(true)
    navigate(`/inventory?scanned=${encodeURIComponent(record.id)}`)
  }

  const isKnown = Boolean(item)
  const display = item || UNKNOWN

  return (
    <div className={`scan-app phase-${phase}`}>
      <div className={`scan-camera-stage ${phase === 'result' ? 'is-hidden' : ''}`}>
        <video ref={videoRef} autoPlay playsInline muted className={`scan-feed ${cameraOn ? '' : 'is-hidden'}`} />
        {!cameraOn && <div className="scan-feed scan-feed-empty" />}
        <canvas ref={canvasRef} className="is-hidden" />
        {snapshot && phase === 'analyzing' && <img className="scan-snapshot" src={snapshot} alt="" />}

        <button type="button" className="scan-close" onClick={() => navigate(-1)} aria-label="Close">
          <IconClose />
        </button>

        {phase === 'camera' && (
          <>
            <div className="scan-viewfinder" />
            <button type="button" className="scan-shutter" onClick={takePhoto} aria-label="Scan with camera">
              <IconCamera />
            </button>
          </>
        )}

        {phase === 'analyzing' && (
          <div className="scan-ai-card">
            <h2>Scanning for you</h2>
            <p>Analyzing the Machine with AI</p>
            <ul>
              {ANALYZE_STEPS.map((label, index) => {
                const done = step > index
                const activeStep = step === index
                return (
                  <li key={label} className={done ? 'is-done' : activeStep ? 'is-active' : ''}>
                    <span className="step-ico">
                      {done ? <IconCheck /> : activeStep ? <span className="spin" /> : <span className="pending-dot" />}
                    </span>
                    {label}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {phase === 'result' && (
        <div className="scan-result-app">
          <header className="scan-result-head">
            <button type="button" className="scan-close light" onClick={scanAgain} aria-label="Close">
              <IconClose />
            </button>
            <div>
              <h2>{display.name}</h2>
              <p>{isKnown ? display.id : 'Not available'}</p>
            </div>
            <button type="button" className="save-garden-btn" disabled={!isKnown || saved} onClick={saveToInventory}>
              <IconHeart /> {saved ? 'Saved' : 'Save to Equipment Inventory'}
            </button>
          </header>

          <div className="scan-result-photo">
            {snapshot ? <img src={snapshot} alt={display.name} /> : <EquipmentArt type={display.name} />}
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
                <p>{display.meaning}</p>
                <h3>What is for</h3>
                <p>{display.whatFor}</p>
                <div className="confidence-card">
                  <div>
                    <strong>Identification Confidence</strong>
                    <p>{confidence}% match</p>
                  </div>
                  <span>{confidence}%</span>
                </div>
              </>
            )}
            {tab === 'care' && (
              <ul className="care-list">
                {(isKnown ? display.safety : ['Only hospital machines with an Equipment Inventory QR code can be identified.']).map(
                  (line) => (
                    <li key={line}>{line}</li>
                  ),
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
