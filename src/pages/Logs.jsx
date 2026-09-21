import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { EquipmentArt } from '../components/EquipmentArt'
import Modal from '../components/Modal'
import { IconBorrow, IconClipboard, IconDown, IconPlus, IconUp, IconWarn } from '../components/Icons'

function formatDate(value) {
  if (!value) return '—'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Logs() {
  const { logs, equipment, stats, recordLog, currentUser } = useApp()
  const [from, setFrom] = useState('2026-04-01')
  const [to, setTo] = useState('2026-04-30')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ equipmentId: equipment[0]?.id || '', action: 'Borrow' })
  const [error, setError] = useState('')

  const filtered = useMemo(
    () =>
      logs.filter((log) => {
        if (from && log.date < from) return false
        if (to && log.date > to) return false
        return true
      }),
    [logs, from, to],
  )

  const nameOf = (id) => equipment.find((e) => e.id === id)?.name || id

  const submitLog = (e) => {
    e.preventDefault()
    setError('')
    try {
      recordLog(form)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="panel-page">
      <div className="panel-head">
        <div>
          <h2>Laboratory Logs</h2>
          <p className="sub">Record of equipment usage, borrowing, and return.</p>
        </div>
        <div className="toolbar-controls">
          <label className="date-range">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span>–</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="button" className="cta-btn compact" onClick={() => setOpen(true)}>
            <IconPlus /> New Log
          </button>
        </div>
      </div>

      <div className="log-stats">
        <article>
          <span className="stat-ico blue">
            <IconClipboard />
          </span>
          <div>
            <p>Total Records</p>
            <strong>{stats.logTotal}</strong>
          </div>
        </article>
        <article>
          <span className="stat-ico orange">
            <IconUp />
          </span>
          <div>
            <p>Borrowed</p>
            <strong>{stats.logBorrowed}</strong>
          </div>
        </article>
        <article>
          <span className="stat-ico green">
            <IconDown />
          </span>
          <div>
            <p>Returned</p>
            <strong>{stats.logReturned}</strong>
          </div>
        </article>
        <article>
          <span className="stat-ico red">
            <IconWarn />
          </span>
          <div>
            <p>Overdue</p>
            <strong className="overdue-num">{stats.logOverdue}</strong>
          </div>
        </article>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>User</th>
              <th>Equipment</th>
              <th>Action</th>
              <th>Status</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-cell">
                  No borrowing or return records in this date range.
                </td>
              </tr>
            )}
            {filtered.map((log, index) => (
              <tr key={log.id}>
                <td>{index + 1}</td>
                <td>{formatDate(log.date)}</td>
                <td>
                  <span className="user-cell">
                    <span className="avatar">{log.user.slice(0, 1)}</span>
                    {log.user}
                  </span>
                </td>
                <td>
                  <div className="equip-cell compact">
                    <div className="mini-art">
                      <EquipmentArt type={nameOf(log.equipmentId)} />
                    </div>
                    <strong>{nameOf(log.equipmentId)}</strong>
                  </div>
                </td>
                <td>{log.action}</td>
                <td>
                  <span className={`status ${log.status.toLowerCase()}`}>{log.status}</span>
                </td>
                <td>{formatDate(log.returnDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title="New Log" onClose={() => setOpen(false)}>
          <form className="modal-form" onSubmit={submitLog}>
            {!currentUser && <p className="inline-error">Please log in to record a log.</p>}
            <label className="full">
              Equipment
              <select value={form.equipmentId} onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}>
                {equipment.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                  </option>
                ))}
              </select>
            </label>
            <label className="full">
              Action
              <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}>
                <option>Borrow</option>
                <option>Return</option>
              </select>
            </label>
            {error && <p className="inline-error">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="chip" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="cta-btn compact">
                <IconBorrow /> Save Log
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
