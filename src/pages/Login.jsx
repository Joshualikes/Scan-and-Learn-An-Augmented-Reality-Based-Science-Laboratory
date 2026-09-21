import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AuthSplit from '../components/AuthSplit'
import { IconLock, IconUser } from '../components/Icons'
import { homePathFor } from '../lib/supabase'

export default function Login() {
  const { login, supabaseConfigured } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const profile = await login(username, password)
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
        <h2>Login</h2>
        {!supabaseConfigured && (
          <p className="inline-error">Add your Supabase keys to a .env file, then restart the app.</p>
        )}
        <label className="icon-field">
          <IconUser />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            required
          />
        </label>
        <label className="icon-field">
          <IconLock />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="inline-error">{error}</p>}
        <button type="submit" className="cta-btn wide" disabled={busy}>
          {busy ? 'Logging in…' : 'Login'}
        </button>
        <Link to="/register" className="cta-btn wide ghost">
          Register
        </Link>
      </form>
    </AuthSplit>
  )
}
