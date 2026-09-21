import { useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { MACHINE_CATEGORIES } from '../lib/machines'
import { EquipmentArt } from '../components/EquipmentArt'
import Modal from '../components/Modal'
import { IconEye, IconPencil, IconPlus, IconQr, IconTrash } from '../components/Icons'
import { normalizeRole } from '../lib/supabase'
import { toInventoryRecord, withAiDetails } from '../lib/machines'

const emptyForm = {
  id: '',
  name: '',
  meaning: '',
  whatFor: '',
  category: 'Diagnostic',
  status: 'Available',
  quantity: 1,
  description: '',
  location: 'Science Laboratory',
  brand: '',
  model: '',
  arHint: '',
}

export default function Inventory() {
  const { equipment, upsertEquipment, deleteEquipment, currentUser } = useApp()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('All Status')
  const [form, setForm] = useState(emptyForm)
  const [formMode, setFormMode] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const scannedId = params.get('scanned')
  const canManage = normalizeRole(currentUser?.role) === 'Admin'
  const scannedItem = withAiDetails(equipment.find((item) => item.id === scannedId))

  useEffect(() => {
    setQuery(params.get('q') || '')
  }, [params])

  const filtered = useMemo(
    () =>
      equipment.filter((item) => {
        const q = query.toLowerCase()
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          String(item.meaning || '').toLowerCase().includes(q) ||
          String(item.whatFor || item.description || '').toLowerCase().includes(q)
        const matchesCat = category === 'All Categories' || item.category === category
        const matchesStatus = status === 'All Status' || item.status === status
        return matchesQuery && matchesCat && matchesStatus
      }),
    [equipment, query, category, status],
  )

  const openAdd = () => {
    const nextNum = String(equipment.length + 1).padStart(3, '0')
    setForm({ ...emptyForm, id: `EQ-${nextNum}` })
    setFormMode('add')
  }

  const openEdit = (item) => {
    setForm({ ...emptyForm, ...item })
    setFormMode('edit')
  }

  const saveForm = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.id.trim()) {
      setError('Name and ID are required.')
      return
    }
    upsertEquipment(
      toInventoryRecord({
        ...form,
        quantity: Number(form.quantity) || 1,
        purpose: form.whatFor || form.description,
        arHint:
          form.arHint ||
          `Point your camera at the ${form.name} QR code to launch its AR learning overlay.`,
      }),
    )
    setFormMode(null)
  }

  const confirmDelete = async (e) => {
    e.preventDefault()
    if (!toDelete) return
    setError('')
    setDeleting(true)
    try {
      await deleteEquipment(toDelete.id)
      if (scannedId === toDelete.id) navigate('/inventory', { replace: true })
      setToDelete(null)
    } catch (err) {
      setError(err.message || 'Could not delete this equipment.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="panel-page">
      <div className="panel-head">
        <h2>
          <span className="head-ico">▣</span> Equipment Inventory
        </h2>
        <div className="toolbar-controls">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All Categories</option>
            {MACHINE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All Status</option>
            <option>Available</option>
            <option>Borrowed</option>
          </select>
          {canManage && (
            <button type="button" className="cta-btn compact" onClick={openAdd}>
              <IconPlus /> Add Equipment
            </button>
          )}
        </div>
      </div>

      {scannedItem && (
        <section className="scan-inventory-banner">
          <EquipmentArt type={scannedItem.name} />
          <div>
            <p className="ok-line">Scanned and saved with QR code</p>
            <h3>{scannedItem.name}</h3>
            <p>
              <strong>Name:</strong> {scannedItem.name}
            </p>
            <p>
              <strong>Meaning:</strong> {scannedItem.meaning}
            </p>
            <p>
              <strong>What it is for:</strong> {scannedItem.whatFor}
            </p>
          </div>
          <QRCodeSVG value={scannedItem.qrPayload || `SCANLEARN:${scannedItem.id}`} size={88} />
        </section>
      )}

      {error && !formMode && <p className="inline-error">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Meaning</th>
              <th>What it is for</th>
              <th>Category</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-cell">
                  No scanned hospital machines yet. Open Scan Equipment to add one with a QR code.
                </td>
              </tr>
            )}
            {filtered.map((item, index) => {
              const details = withAiDetails(item)
              return (
                <tr key={item.id} className={item.id === scannedId ? 'is-scanned-row' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="equip-thumb">
                      <EquipmentArt type={item.name} />
                    </div>
                  </td>
                  <td>
                    <strong>{details.name}</strong>
                    <small>{details.id}</small>
                  </td>
                  <td className="inventory-copy">{details.meaning}</td>
                  <td className="inventory-copy">{details.whatFor}</td>
                  <td>{details.category}</td>
                  <td>
                    <button
                      type="button"
                      className="qr-thumb"
                      onClick={() => navigate(`/inventory/${item.id}`)}
                      aria-label={`QR for ${item.name}`}
                    >
                      <QRCodeSVG value={details.qrPayload} size={40} />
                    </button>
                  </td>
                  <td>
                    <div className="action-row">
                      <button type="button" className="chip" onClick={() => navigate(`/inventory/${item.id}`)}>
                        <IconEye /> View
                      </button>
                      {canManage && (
                        <button type="button" className="chip" onClick={() => openEdit(item)}>
                          <IconPencil /> Edit
                        </button>
                      )}
                      <button type="button" className="chip green" onClick={() => navigate(`/inventory/${item.id}`)}>
                        <IconQr /> QR
                      </button>
                      <button
                        type="button"
                        className="chip danger"
                        onClick={() => {
                          setError('')
                          setToDelete(item)
                        }}
                      >
                        <IconTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {toDelete && (
        <Modal title={`Delete equipment · ${toDelete.id}`} onClose={() => !deleting && setToDelete(null)}>
          <form className="modal-form" onSubmit={confirmDelete}>
            <p className="full sub">
              This will permanently remove <strong>{toDelete.name}</strong> ({toDelete.id}) from Equipment Inventory.
            </p>
            {error && <p className="inline-error full">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="chip" onClick={() => setToDelete(null)} disabled={deleting}>
                Cancel
              </button>
              <button type="submit" className="chip danger" disabled={deleting}>
                <IconTrash /> {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {canManage && formMode && (
        <Modal title={formMode === 'add' ? 'Add Equipment' : 'Edit Equipment'} onClose={() => setFormMode(null)}>
          <form className="modal-form" onSubmit={saveForm}>
            <label>
              Equipment ID
              <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={formMode === 'edit'} />
            </label>
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="full">
              Meaning
              <textarea
                rows="2"
                value={form.meaning}
                onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              />
            </label>
            <label className="full">
              What it is for
              <textarea
                rows="2"
                value={form.whatFor}
                onChange={(e) => setForm({ ...form, whatFor: e.target.value })}
              />
            </label>
            <label>
              Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {MACHINE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Available</option>
                <option>Borrowed</option>
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </label>
            <label>
              Location
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </label>
            {error && <p className="inline-error">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="chip" onClick={() => setFormMode(null)}>
                Cancel
              </button>
              <button type="submit" className="cta-btn compact">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
