import { useState } from 'react'
import { useAuth } from '../lib/auth-context'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: Props) {
  const { signUp, signIn } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.target as HTMLFormElement
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value
    const password = (form.querySelector('[name="password"]') as HTMLInputElement)?.value

    const result = await signIn(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.target as HTMLFormElement
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value
    const password = (form.querySelector('[name="password"]') as HTMLInputElement)?.value
    const username = (form.querySelector('[name="username"]') as HTMLInputElement)?.value
    const ingame = (form.querySelector('[name="ingame"]') as HTMLInputElement)?.value

    if (!username || username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters')
      setLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      setLoading(false)
      return
    }

    const result = await signUp(email, password, username, ingame)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '400px' }}>
        <div className="modal-head">
          <div>
            <div className="modal-sub-lbl">BloodMoney RP</div>
            <h2>Player Account</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tab-bar">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          {error && <div className="form-error">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="Your email" required />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder="Your password" required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-field">
                <label className="form-label">Username</label>
                <input className="form-input" name="username" type="text" placeholder="Choose a username (3-20 chars)" required />
              </div>
              <div className="form-field">
                <label className="form-label">In-Game Name</label>
                <input className="form-input" name="ingame" type="text" placeholder="Your Unturned character name" />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="Your email" required />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder="At least 6 characters" required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
