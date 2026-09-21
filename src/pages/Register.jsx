import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AuthSplit from '../components/AuthSplit'
import { IconLock, IconUser } from '../components/Icons'
import { homePathFor, ROLES } from '../lib/supabase'

export default function Register() {
  const { register, supabaseConfigured } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullname: '',
    role: '',
    username: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!ROLES.includes(form.role)) {
      setError('Role must be Admin or Student.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    try {
      const profile = await register({
        fullname: form.fullname,
        role: form.role,
        username: form.username,
        password: form.password,
      })
      navigate(homePathFor(profile))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthSplit>
      <form className="login-form" onSubmit={submit}>
        <h2>Register</h2>
        {!supabaseConfigured && (
          <p className="inline-error">Add your Supabase keys to a .env file, then restart the app.</p>
        )}
        <label className="icon-field">
          <IconUser />
          <input value={form.fullname} onChange={update('fullname')} placeholder="Full name" required />
        </label>
        <label className="icon-field">
          <select className={form.role ? '' : 'is-placeholder'} value={form.role} onChange={update('role')} required>
            <option value="" disabled>
              Admin or Student
            </option>
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
          </select>
        </label>
        <label className="icon-field">
          <IconUser />
          <input value={form.username} onChange={update('username')} placeholder="Username" required />
        </label>
        <label className="icon-field">
          <IconLock />
          <input type="password" value={form.password} onChange={update('password')} placeholder="Password" minLength={6} required />
        </label>
        <label className="icon-field">
          <IconLock />
          <input type="password" value={form.confirm} onChange={update('confirm')} placeholder="Confirm password" minLength={6} required />
        </label>
        {error && <p className="inline-error">{error}</p>}
        <button type="submit" className="cta-btn wide" disabled={busy}>
          {busy ? 'Creating account…' : 'Register'}
        </button>
        <Link to="/login" className="cta-btn wide ghost">
          Login here
        </Link>
      </form>
    </AuthSplit>
  )
}
