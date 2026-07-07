import { useState } from 'react'
import { useAuth } from '../lib/auth-context'
import { supabase, ROLE_LABELS } from '../lib/supabase'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AccountModal({ open, onClose }: Props) {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [tab, setTab] = useState<'profile' | 'orders' | 'password'>('profile')
  const [steamInput, setSteamInput] = useState(profile?.steam64 || '')
  const [steamMsg, setSteamMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  const saveSteam64 = async () => {
    if (!steamInput || !/^7656119\d{10}$/.test(steamInput)) {
      setSteamMsg({ text: 'Invalid — 17 digits starting with 7656119', ok: false })
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({ steam64: steamInput })
      .eq('id', user?.id)
    setLoading(false)
    if (error) {
      setSteamMsg({ text: error.message, ok: false })
    } else {
      setSteamMsg({ text: '✓ Steam64 saved!', ok: true })
      refreshProfile()
    }
    setTimeout(() => setSteamMsg(null), 3500)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)
    const form = e.target as HTMLFormElement
    const current = (form.querySelector('[name="current"]') as HTMLInputElement)?.value
    const newPass = (form.querySelector('[name="newPass"]') as HTMLInputElement)?.value
    const confirm = (form.querySelector('[name="confirm"]') as HTMLInputElement)?.value

    if (!current || !newPass || !confirm) {
      setPasswordMsg({ text: 'Fill out all fields', ok: false })
      return
    }
    if (newPass !== confirm) {
      setPasswordMsg({ text: 'Passwords do not match', ok: false })
      return
    }
    if (newPass.length < 6) {
      setPasswordMsg({ text: 'Min 6 characters', ok: false })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPass })
    setLoading(false)
    if (error) {
      setPasswordMsg({ text: error.message, ok: false })
    } else {
      setPasswordMsg({ text: '✓ Password updated!', ok: true })
      form.reset()
    }
    setTimeout(() => setPasswordMsg(null), 4000)
  }

  if (!open || !user) return null

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-head">
          <div>
            <div className="modal-sub-lbl">Logged in as</div>
            <h2>{profile?.username || 'Player'}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tab-bar">
            <button className={`tab-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
            <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Purchases</button>
            <button className={`tab-btn ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>Password</button>
          </div>

          {tab === 'profile' && (
            <div className="tab-panel active">
              <div className="acct-stats">
                <div className="acct-stat">
                  <div className="acct-stat-lbl">Role</div>
                  <div className="acct-stat-val">{ROLE_LABELS[profile?.role || 0]}</div>
                </div>
                <div className="acct-stat">
                  <div className="acct-stat-lbl">In-Game Name</div>
                  <div className="acct-stat-val">{profile?.ingame_name || '—'}</div>
                </div>
                <div className="acct-stat">
                  <div className="acct-stat-lbl">Member Since</div>
                  <div className="acct-stat-val">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</div>
                </div>
                <div className="acct-stat">
                  <div className="acct-stat-lbl">Owned Items</div>
                  <div className="acct-stat-val" style={{ fontSize: '11px' }}>{profile?.owned_items?.length ? profile.owned_items.join(', ').toUpperCase() : 'None'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Steam64 ID</div>
                <div style={{ fontSize: '11px', color: '#333', marginBottom: '7px' }}>
                  Link your Steam account for auto in-game delivery (17 digits, starts with 7656119).
                </div>
                <div className="steam-row">
                  <input
                    type="text"
                    placeholder="76561198000000000"
                    maxLength={17}
                    value={steamInput}
                    onChange={(e) => setSteamInput(e.target.value)}
                  />
                  <button className="btn btn-primary btn-sm" onClick={saveSteam64} disabled={loading}>Save</button>
                </div>
                {steamMsg && <div style={{ fontSize: '11px', marginTop: '5px', color: steamMsg.ok ? '#2ecc71' : '#ff6666' }}>{steamMsg.text}</div>}
                <div style={{ fontSize: '11px', color: '#2a2a2a', marginTop: '4px' }}>
                  Saved: <span style={{ color: '#fff' }}>{profile?.steam64 || '—'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a href="/shop" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={onClose}>Visit Shop</a>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={signOut}>Log Out</button>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="tab-panel active">
              <p style={{ color: '#555', textAlign: 'center', padding: '16px', fontSize: '13px' }}>
                Your purchases will appear here. Visit the shop to buy ranks and items.
              </p>
            </div>
          )}

          {tab === 'password' && (
            <div className="tab-panel active">
              <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                <div className="form-field">
                  <label className="form-label">Current Password</label>
                  <input className="form-input" name="current" type="password" placeholder="Enter current password" />
                </div>
                <div className="form-field">
                  <label className="form-label">New Password</label>
                  <input className="form-input" name="newPass" type="password" placeholder="At least 6 characters" minLength={6} />
                </div>
                <div className="form-field">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-input" name="confirm" type="password" placeholder="Repeat new password" />
                </div>
                {passwordMsg && <div style={{ fontSize: '12px', color: passwordMsg.ok ? '#2ecc71' : '#ff6666' }}>{passwordMsg.text}</div>}
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
