import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import { IconLock, IconSearch, IconTrash, IconUser } from '../components/Icons'

function formatWhen(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Users() {
  const { listStudentLogins, resetStudentPassword, deleteStudentAccount } = useApp()
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [resetError, setResetError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadStudents = async () => {
    setError('')
    setLoading(true)
    try {
      setStudents(await listStudentLogins())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter((student) => {
      const username = String(student.username || '').toLowerCase()
      const fullname = String(student.fullname || '').toLowerCase()
      return username.includes(q) || fullname.includes(q)
    })
  }, [students, query])

  const openReset = (student) => {
    setToDelete(null)
    setSelected(student)
    setForm({ password: '', confirm: '' })
    setResetError('')
  }

  const openDelete = (student) => {
    setSelected(null)
    setToDelete(student)
    setDeleteError('')
  }

  const submitReset = async (e) => {
    e.preventDefault()
    setResetError('')
    if (form.password !== form.confirm) {
      setResetError('Passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await resetStudentPassword(selected.id, form.password)
      setStudents((prev) =>
        prev.map((student) =>
          student.id === selected.id ? { ...student, password: form.password } : student,
        ),
      )
      setSelected(null)
    } catch (err) {
      setResetError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const submitDelete = async (e) => {
    e.preventDefault()
    if (!toDelete) return
    setDeleteError('')
    setBusy(true)
    try {
      await deleteStudentAccount(toDelete.id)
      setStudents((prev) => prev.filter((student) => student.id !== toDelete.id))
      setToDelete(null)
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel-page">
      <div className="panel-head">
        <div>
          <h2>Student Users</h2>
          <p className="sub">All student logins registered in Scan-and-Learn.</p>
        </div>
        <label className="user-search">
          <IconSearch />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or username..."
          />
        </label>
      </div>

      {error && <p className="inline-error">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Full name</th>
              <th>Password</th>
              <th>Date of register</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="empty-cell">
                  Loading student accounts…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No student accounts in Supabase yet. Register a Student login, then refresh this page.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="user-cell">
                      <span className="avatar">{String(student.username || '?').slice(0, 1).toUpperCase()}</span>
                      {student.username}
                    </span>
                  </td>
                  <td>{student.fullname || '—'}</td>
                  <td>
                    <code className="password-cell">{student.password || 'Reset to view'}</code>
                  </td>
                  <td>{formatWhen(student.created_at)}</td>
                  <td>
                    <div className="action-row">
                      <button type="button" className="chip" onClick={() => openReset(student)}>
                        <IconLock /> Reset password
                      </button>
                      <button type="button" className="chip danger" onClick={() => openDelete(student)}>
                        <IconTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Reset password · ${selected.username}`} onClose={() => setSelected(null)}>
          <form className="modal-form" onSubmit={submitReset}>
            <p className="full sub">
              Set a new password for <strong>{selected.fullname || selected.username}</strong>. The student can use it
              on the next login.
            </p>
            <label className="full">
              New password
              <input
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                required
              />
            </label>
            <label className="full">
              Confirm password
              <input
                type="text"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                minLength={6}
                required
              />
            </label>
            {resetError && <p className="inline-error full">{resetError}</p>}
            <div className="modal-actions">
              <button type="button" className="chip" onClick={() => setSelected(null)}>
                Cancel
              </button>
              <button type="submit" className="cta-btn compact" disabled={busy}>
                <IconUser /> {busy ? 'Saving…' : 'Save password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <Modal title={`Delete user · ${toDelete.username}`} onClose={() => setToDelete(null)}>
          <form className="modal-form" onSubmit={submitDelete}>
            <p className="full sub">
              This will permanently delete <strong>{toDelete.fullname || toDelete.username}</strong> (
              {toDelete.username}) from Supabase Auth. The student will no longer be able to sign in.
            </p>
            {deleteError && <p className="inline-error full">{deleteError}</p>}
            <div className="modal-actions">
              <button type="button" className="chip" onClick={() => setToDelete(null)}>
                Cancel
              </button>
              <button type="submit" className="chip danger" disabled={busy}>
                <IconTrash /> {busy ? 'Deleting…' : 'Delete user'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
