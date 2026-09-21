import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { currentUser, logout, updateAccount, updatePassword } = useApp()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ fullname: '', username: '' })
  const [passwords, setPasswords] = useState({ next: '', confirm: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)
  const [passwordBusy, setPasswordBusy] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    setProfile({
      fullname: currentUser.fullname || '',
      username: currentUser.username || '',
    })
  }, [currentUser])

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileMsg('')
    setProfileBusy(true)
    try {
      await updateAccount(profile)
      setProfileMsg('Account details saved.')
    } catch (err) {
      setProfileError(err.message)
    } finally {
      setProfileBusy(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMsg('')
    if (passwords.next !== passwords.confirm) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordBusy(true)
    try {
      await updatePassword(passwords.next)
      setPasswords({ next: '', confirm: '' })
      setPasswordMsg('Password updated.')
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setPasswordBusy(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="panel-page settings-page">
        <h2>Settings</h2>
        <div className="settings-card">
          <p>Sign in to manage your laboratory account.</p>
          <button type="button" className="cta-btn compact" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-page settings-page">
      <h2>Settings</h2>
      <div className="settings-grid">
        <form className="settings-card" onSubmit={saveProfile}>
          <h3>Account</h3>
          <p>
            <strong>Role</strong>
            {currentUser.role}
          </p>
          <label>
            Full name
            <input
              value={profile.fullname}
              onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
              required
            />
          </label>
          <label>
            Username
            <input
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              autoComplete="username"
              required
            />
          </label>
          {profileError && <p className="inline-error">{profileError}</p>}
          {profileMsg && <p className="inline-ok">{profileMsg}</p>}
          <button type="submit" className="cta-btn compact" disabled={profileBusy}>
            {profileBusy ? 'Saving…' : 'Save account'}
          </button>
        </form>

        <form className="settings-card" onSubmit={savePassword}>
          <h3>Password</h3>
          <label>
            New password
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          {passwordError && <p className="inline-error">{passwordError}</p>}
          {passwordMsg && <p className="inline-ok">{passwordMsg}</p>}
          <button type="submit" className="cta-btn compact" disabled={passwordBusy}>
            {passwordBusy ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <div className="settings-card">
          <h3>Session</h3>
          <p>Sign out of Scan-and-Learn on this device.</p>
          <button
            type="button"
            className="cta-btn compact"
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
