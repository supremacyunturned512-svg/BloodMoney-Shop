import { useState, useEffect } from 'react'
import { useCart } from '../lib/cart-context'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'
import type { Supporter } from '../lib/supabase'

export default function Shop() {
  const { addToCart } = useCart()
  const { user, profile } = useAuth()
  const [tab, setTab] = useState<'ranks' | 'upgrades' | 'vault' | 'donate'>('ranks')
  const [donationAmount, setDonationAmount] = useState('')
  const [topSupporter, setTopSupporter] = useState<{ username: string; total: number } | null>(null)
  const [recentSupporters, setRecentSupporters] = useState<Supporter[]>([])

  useEffect(() => {
    const fetchSupporters = async () => {
      const { data: recent } = await supabase
        .from('supporters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (recent) setRecentSupporters(recent)

      // Calculate top supporter
      const { data: all } = await supabase
        .from('supporters')
        .select('*')

      if (all && all.length > 0) {
        const totals: Record<string, number> = {}
        all.forEach(s => {
          totals[s.username] = (totals[s.username] || 0) + s.amount
        })
        const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
        if (sorted[0]) {
          setTopSupporter({ username: sorted[0][0], total: sorted[0][1] })
        }
      }
    }
    fetchSupporters()
  }, [])

  const handleAddToCart = (name: string, price: number, itemKey: string, requiresKey: string | null) => {
    if (!user) {
      alert('Please log in to add items to your cart')
      return
    }
    if (requiresKey && profile?.owned_items && !profile.owned_items.includes(requiresKey)) {
      const names: Record<string, string> = {
        'vip': 'VIP',
        'vip-plus': 'VIP+',
        'mvp': 'MVP',
        'vault-15': '15-Slot Vault',
        'vault-20': '20-Slot Vault',
        'vault-25': '25-Slot Vault'
      }
      alert(`You need ${names[requiresKey] || requiresKey} before purchasing this upgrade.`)
      return
    }
    if (profile?.owned_items?.includes(itemKey)) {
      alert('You already own this item.')
      return
    }
    addToCart(name, price, itemKey, requiresKey)
  }

  const handleDonation = () => {
    const amount = parseFloat(donationAmount)
    if (!amount || amount < 1) {
      alert('Please enter at least $1')
      return
    }
    if (!user) {
      alert('Please log in to donate')
      return
    }
    addToCart(`Donation ($${amount.toFixed(2)})`, amount, `donation-${Date.now()}`, null)
    setDonationAmount('')
  }

  return (
    <>
      <div className="shop-hero">
        <h1>BMRP <span>Store</span></h1>
        <p>Support the server · Get exclusive perks · Dominate in style</p>
      </div>

      <div className="sup-row">
        <div className="sup-box top">
          <div className="sup-lbl">👑 Top Customer</div>
          <div className="top-name">{topSupporter?.username || 'No top supporter yet'}</div>
          <div className="top-amt">{topSupporter ? `Total: $${topSupporter.total.toFixed(2)}` : 'Be the first to support BMRP'}</div>
        </div>
        <div className="sup-box recent">
          <div className="sup-lbl">🩸 Recent Supporters</div>
          <ul className="recent-list">
            {recentSupporters.length > 0 ? (
              recentSupporters.map(s => (
                <li key={s.id}>
                  <span>{s.username}</span>
                  <span style={{ color: '#7B68EE' }}>${s.amount.toFixed(2)}</span>
                </li>
              ))
            ) : (
              <li style={{ color: '#2a2a2a', fontStyle: 'italic', fontSize: '11px' }}>No purchases yet</li>
            )}
          </ul>
        </div>
      </div>

      <div className="shop-tabs">
        <button className={`shop-tab ${tab === 'ranks' ? 'active' : ''}`} onClick={() => setTab('ranks')}>Rank Packages</button>
        <button className={`shop-tab ${tab === 'upgrades' ? 'active' : ''}`} onClick={() => setTab('upgrades')}>Upgrades</button>
        <button className={`shop-tab ${tab === 'vault' ? 'active' : ''}`} onClick={() => setTab('vault')}>Vault Upgrades</button>
        <button className={`shop-tab ${tab === 'donate' ? 'active' : ''}`} onClick={() => setTab('donate')}>Donate</button>
      </div>

      {/* Ranks Tab */}
      <div className={`shop-pane ${tab === 'ranks' ? 'active' : ''}`}>
        <div className="ranks-grid">
          <div className="rank-card vip">
            <div className="rank-head">
              <span className="rank-icon">⭐</span>
              <div className="rank-name">VIP</div>
              <div className="rank-price">$5 <span>/ one-time</span></div>
            </div>
            <div className="rank-body">
              <ul className="rank-features">
                <li>Custom VIP chat tag</li>
                <li>Priority queue access</li>
                <li>Exclusive VIP Discord role</li>
                <li>Bonus starter kit</li>
                <li>Access to VIP lounge</li>
              </ul>
              <button className="btn-buy" onClick={() => handleAddToCart('VIP', 5, 'vip', null)}>Add to Cart</button>
            </div>
          </div>

          <div className="rank-card vipp">
            <div className="rank-badge rb-pop">Popular</div>
            <div className="rank-head">
              <span className="rank-icon">🌟</span>
              <div className="rank-name">VIP+</div>
              <div className="rank-price">$10 <span>/ one-time</span></div>
            </div>
            <div className="rank-body">
              <ul className="rank-features">
                <li>Everything in VIP</li>
                <li>Enhanced VIP+ chat tag</li>
                <li>Larger starter kit</li>
                <li>Custom nickname in-game</li>
                <li>Early access to events</li>
                <li>Bonus in-game currency</li>
              </ul>
              <button className="btn-buy" onClick={() => handleAddToCart('VIP+', 10, 'vip-plus', null)}>Add to Cart</button>
            </div>
          </div>

          <div className="rank-card mvp">
            <div className="rank-head">
              <span className="rank-icon">💎</span>
              <div className="rank-name">MVP</div>
              <div className="rank-price">$15 <span>/ one-time</span></div>
            </div>
            <div className="rank-body">
              <ul className="rank-features">
                <li>Everything in VIP+</li>
                <li>MVP purple chat tag</li>
                <li>Premium starter kit</li>
                <li>Reserved server slot</li>
                <li>Exclusive MVP events</li>
                <li>Custom spawn point</li>
                <li>MVP Discord channel</li>
              </ul>
              <button className="btn-buy" onClick={() => handleAddToCart('MVP', 15, 'mvp', 'vip-plus')}>Add to Cart</button>
            </div>
          </div>

          <div className="rank-card mvpp">
            <div className="rank-badge rb-best">Best Value</div>
            <div className="rank-head">
              <span className="rank-icon">👑</span>
              <div className="rank-name">MVP+</div>
              <div className="rank-price">$20 <span>/ one-time</span></div>
            </div>
            <div className="rank-body">
              <ul className="rank-features">
                <li>Everything in MVP</li>
                <li>Exclusive MVP+ gradient tag</li>
                <li>Ultimate starter kit</li>
                <li>Direct staff line access</li>
                <li>Monthly bonus drops</li>
                <li>Nameplate cosmetic</li>
                <li>Founder recognition</li>
                <li>Permanent VIP perks</li>
              </ul>
              <button className="btn-buy" onClick={() => handleAddToCart('MVP+', 20, 'mvp-plus', 'mvp')}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrades Tab */}
      <div className={`shop-pane ${tab === 'upgrades' ? 'active' : ''}`}>
        <div className="upg-wrap">
          <p style={{ color: '#555', fontSize: '13px', textAlign: 'center', marginBottom: '24px', lineHeight: 1.7 }}>
            Already have a rank? Upgrade and only pay the difference. You must own the previous rank.
          </p>
          <div className="upg-row" style={{ borderLeft: '4px solid #1abc9c' }}>
            <div className="upg-from" style={{ color: '#b8860b' }}>VIP</div>
            <div className="upg-arrow">→</div>
            <div className="upg-to" style={{ color: '#1abc9c' }}>VIP+</div>
            <div className="upg-info"><p>Unlock custom nickname, larger kit, bonus currency, and early event access.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$5</span>
              <span className="upg-note">difference</span>
              <button className="btn-upg" style={{ background: '#1abc9c', color: '#fff' }} onClick={() => handleAddToCart('VIP→VIP+ Upgrade', 5, 'upg-vip-vipp', 'vip')}>Add to Cart</button>
            </div>
          </div>
          <div className="upg-row" style={{ borderLeft: '4px solid #9b59b6' }}>
            <div className="upg-from" style={{ color: '#1abc9c' }}>VIP+</div>
            <div className="upg-arrow">→</div>
            <div className="upg-to" style={{ color: '#9b59b6' }}>MVP</div>
            <div className="upg-info"><p>Get reserved slot, exclusive MVP events, custom spawn, and the purple MVP tag.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$5</span>
              <span className="upg-note">difference</span>
              <button className="btn-upg" style={{ background: '#9b59b6', color: '#fff' }} onClick={() => handleAddToCart('VIP+→MVP Upgrade', 5, 'upg-vipp-mvp', 'vip-plus')}>Add to Cart</button>
            </div>
          </div>
          <div className="upg-row" style={{ borderLeft: '4px solid #e74c3c' }}>
            <div className="upg-from" style={{ color: '#9b59b6' }}>MVP</div>
            <div className="upg-arrow">→</div>
            <div className="upg-to" style={{ color: '#e74c3c' }}>MVP+</div>
            <div className="upg-info"><p>Reach the top. Gradient tag, ultimate kit, staff line, and founder recognition.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$5</span>
              <span className="upg-note">difference</span>
              <button className="btn-upg" style={{ background: 'linear-gradient(135deg, #9b59b6, #e74c3c)', color: '#fff' }} onClick={() => handleAddToCart('MVP→MVP+ Upgrade', 5, 'upg-mvp-mvpp', 'mvp')}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Tab */}
      <div className={`shop-pane ${tab === 'vault' ? 'active' : ''}`}>
        <div className="upg-wrap">
          <p style={{ color: '#555', fontSize: '13px', textAlign: 'center', marginBottom: '24px', lineHeight: 1.7 }}>
            Vault upgrades increase your in-game storage. Purchase tiers in order.
          </p>
          <div className="upg-row" style={{ borderLeft: '4px solid #3498db' }}>
            <div className="upg-from" style={{ color: '#3498db', fontSize: '13px' }}>15 Slots</div>
            <div className="upg-arrow">📦</div>
            <div className="upg-info"><p>Expand storage to 15 slots.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$10</span>
              <span className="upg-note">one-time</span>
              <button className="btn-upg" style={{ background: '#3498db', color: '#fff' }} onClick={() => handleAddToCart('Vault — 15 Slots', 10, 'vault-15', null)}>Add to Cart</button>
            </div>
          </div>
          <div className="upg-row" style={{ borderLeft: '4px solid #2ecc71' }}>
            <div className="upg-from" style={{ color: '#2ecc71', fontSize: '13px' }}>20 Slots</div>
            <div className="upg-arrow">📦</div>
            <div className="upg-info"><p>Expand to 20 slots. Requires 15-slot upgrade.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$15</span>
              <span className="upg-note">one-time</span>
              <button className="btn-upg" style={{ background: '#2ecc71', color: '#fff' }} onClick={() => handleAddToCart('Vault — 20 Slots', 15, 'vault-20', 'vault-15')}>Add to Cart</button>
            </div>
          </div>
          <div className="upg-row" style={{ borderLeft: '4px solid #9b59b6' }}>
            <div className="upg-from" style={{ color: '#9b59b6', fontSize: '13px' }}>25 Slots</div>
            <div className="upg-arrow">📦</div>
            <div className="upg-info"><p>Expand to 25 slots. Requires 20-slot upgrade.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$20</span>
              <span className="upg-note">one-time</span>
              <button className="btn-upg" style={{ background: '#9b59b6', color: '#fff' }} onClick={() => handleAddToCart('Vault — 25 Slots', 20, 'vault-25', 'vault-20')}>Add to Cart</button>
            </div>
          </div>
          <div className="upg-row" style={{ borderLeft: '4px solid #C8A040' }}>
            <div className="upg-from" style={{ color: '#C8A040', fontSize: '13px' }}>30 Slots</div>
            <div className="upg-arrow">📦</div>
            <div className="upg-info"><p>Maximum vault size. Requires 25-slot upgrade.</p></div>
            <div className="upg-price-wrap">
              <span className="upg-price">$25</span>
              <span className="upg-note">max tier</span>
              <button className="btn-upg" style={{ background: '#C8A040', color: '#000' }} onClick={() => handleAddToCart('Vault — 30 Slots (Max)', 25, 'vault-30', 'vault-25')}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Tab */}
      <div className={`shop-pane ${tab === 'donate' ? 'active' : ''}`}>
        <div className="donate-wrap">
          <div className="donate-card">
            <span className="donate-icon">🩸</span>
            <h2>Support BloodMoney RP</h2>
            <p>Any amount helps keep the server running and funds new development. No specific perks guaranteed — just a direct way to support.</p>
            <div className="donate-row">
              <span className="donate-dollar">$</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount"
                className="donate-input"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-full" onClick={handleDonation}>Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  )
}
