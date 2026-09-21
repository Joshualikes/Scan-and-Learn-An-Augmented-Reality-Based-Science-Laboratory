import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EquipmentArt } from '../components/EquipmentArt'
import { IconCube, IconSearch, IconWarn } from '../components/Icons'
import { MACHINE_CATEGORIES, findMachine, withAiDetails } from '../lib/machines'
import { useApp } from '../context/AppContext'

export default function AR() {
  const { equipment, bumpScan } = useApp()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState(params.get('id') || '')
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [cameraOn, setCameraOn] = useState(false)

  const machines = useMemo(() => equipment.map(withAiDetails), [equipment])

  const filtered = machines.filter((item) => {
    const q = query.toLowerCase()
    const matchesQuery = item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    const matchesCat = category === 'All' || item.category === category
    return matchesQuery && matchesCat
  })

  const selected = withAiDetails(findMachine(selectedId, machines) || filtered[0] || machines[0])

  useEffect(() => {
    const fromUrl = params.get('id')
    if (fromUrl) {
      setSelectedId(fromUrl)
      return
    }
    if (!machines.some((item) => item.id === selectedId)) {
      setSelectedId(machines[0]?.id || '')
    }
  }, [params, machines, selectedId])

  useEffect(() => {
    let stream
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraOn(true)
        }
      } catch {
        setCameraOn(false)
      }
    }
    start()
    return () => stream?.getTracks().forEach((track) => track.stop())
  }, [])

  return (
    <div className="ar-page">
      <header className="page-head">
        <span className="page-ico">
          <IconCube />
        </span>
        <div>
          <h2>AR Preview</h2>
          <p>View and explore hospital machines in Augmented Reality</p>
        </div>
      </header>

      <div className="ar-tools">
        <label className="filter-card">
          <strong>Equipment Search</strong>
          <span className="search-field">
            <IconSearch />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search machine name or ID..." />
          </span>
        </label>
        <div className="filter-card">
          <strong>Filter by Category</strong>
          <div className="chip-row">
            {['All', ...MACHINE_CATEGORIES].map((cat) => (
              <button key={cat} type="button" className={category === cat ? 'chip-pill active' : 'chip-pill'} onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="machine-row">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`machine-thumb ${selected?.id === item.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedId(item.id)
              setRotation(0)
              setZoom(1)
            }}
          >
            <EquipmentArt type={item.name} />
            <span>{item.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="empty-note">
            {machines.length === 0
              ? 'No equipment in inventory yet. Scan a QR code to add a machine and view it in AR.'
              : 'No hospital machines match that search.'}
          </p>
        )}
      </div>

      {selected && (
        <div className="ar-stage-grid">
          <div className="ar-viewport">
            <div className="ar-live-tag">
              <IconCube /> AR View {cameraOn ? '· Live Camera' : '· Preview'}
            </div>
            <video ref={videoRef} autoPlay playsInline muted className={`ar-cam ${cameraOn ? '' : 'is-hidden'}`} />
            {!cameraOn && (
              <img
                className="ar-cam"
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80"
                alt="Hospital room"
              />
            )}
            <div className="ar-frame" />
            <div className="ar-model" style={{ transform: `scale(${zoom}) rotateY(${rotation}deg)` }}>
              <EquipmentArt type={selected.name} />
            </div>
            <div className="ar-controls">
              <button type="button" onClick={() => setRotation((n) => n + 25)}>
                Rotate
              </button>
              <button type="button" onClick={() => setZoom((n) => Math.min(n + 0.15, 1.8))}>
                Zoom In
              </button>
              <button type="button" onClick={() => setZoom((n) => Math.max(n - 0.15, 0.7))}>
                Zoom Out
              </button>
            </div>
            <button
              type="button"
              className="cta-btn compact ar-view-btn"
              onClick={() => bumpScan()}
            >
              <IconCube /> View in AR
            </button>
          </div>

          <aside className="machine-facts">
            <h3>{selected.name}</h3>
            <span className="cat-badge">{selected.category}</span>
            <dl>
              <div>
                <dt>Machine Name</dt>
                <dd>{selected.name}</dd>
              </div>
              <div>
                <dt>Equipment ID</dt>
                <dd>{selected.id}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{selected.category}</dd>
              </div>
              <div>
                <dt>Manufacturer</dt>
                <dd>{selected.manufacturer}</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>{selected.model}</dd>
              </div>
              <div>
                <dt>Purpose / Function</dt>
                <dd>{selected.purpose}</dd>
              </div>
            </dl>
            <div className="safety-box">
              <strong>
                <IconWarn /> Safety Information
              </strong>
              <ul>
                {selected.safety.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      <button type="button" className="explore-banner" onClick={() => navigate('/scan')}>
        <span>
          <strong>Scan equipment to view it in AR</strong>
          <em>Only machines saved in Equipment Inventory appear here. Scan a QR code to add one, then open it in Augmented Reality.</em>
        </span>
        <span className="banner-go">→</span>
      </button>
    </div>
  )
}
