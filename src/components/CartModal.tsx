import { useState } from 'react'
import { useCart } from '../lib/cart-context'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartModal({ open, onClose }: Props) {
  const { items, removeFromCart, clearCart, total } = useCart()
  const { user, profile } = useAuth()
  const [step, setStep] = useState<'cart' | 'payment' | 'confirm'>('cart')
  const [purchaseType, setPurchaseType] = useState<'self' | 'gift'>('self')
  const [giftSteam64, setGiftSteam64] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const generateOrderId = () => {
    return 'BMRP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase()
  }

  const handlePayment = async () => {
    if (!user || !profile) return

    if (purchaseType === 'gift' && !/^7656119\d{10}$/.test(giftSteam64)) {
      alert('Please enter a valid Steam64 ID')
      return
    }

    setLoading(true)
    const newOrderId = generateOrderId()

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      order_id: newOrderId,
      steam64: purchaseType === 'self' ? profile.steam64 : '',
      gift_steam64: purchaseType === 'gift' ? giftSteam64 : '',
      is_gift: purchaseType === 'gift',
      items: items.map(i => ({ name: i.name, price: i.price, itemKey: i.itemKey })),
      total,
      payment_status: 'Paid',
      order_status: 'Completed',
      delivery_status: 'Delivered'
    })

    if (error) {
      alert('Error creating order: ' + error.message)
      setLoading(false)
      return
    }

    // Add to supporters
    if (items.length > 0) {
      await supabase.from('supporters').insert({
        username: profile.username,
        amount: total
      })
    }

    setOrderId(newOrderId)
    setLoading(false)
    setStep('confirm')
    clearCart()
  }

  const handleClose = () => {
    setStep('cart')
    setPurchaseType('self')
    setGiftSteam64('')
    setOrderId(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={`modal ${step === 'confirm' ? 'modal-wide' : ''}`}>
        <div className="modal-head">
          <div>
            <div className="modal-sub-lbl">BloodMoney RP</div>
            <h2>{step === 'cart' ? 'Your Cart' : step === 'payment' ? 'Complete Payment' : 'Order Confirmation'}</h2>
          </div>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>
        <div className="modal-body">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#555', padding: '24px', fontSize: '13px' }}>Your cart is empty.</p>
              ) : (
                <>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #161616', gap: '10px' }}>
                      <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '13px', color: '#fff' }}>{item.name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '13px', color: '#7B68EE', fontWeight: 700 }}>${item.price.toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '14px', padding: '0 3px', lineHeight: 1 }}>✕</button>
                      </span>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {step === 'payment' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#8B0000', textTransform: 'uppercase', marginBottom: '8px' }}>Your Order</div>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #111', fontSize: '13px' }}>
                    <span>{i.name}</span>
                    <span style={{ color: '#7B68EE', fontFamily: 'Oswald, sans-serif' }}>${i.price.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontFamily: 'Oswald, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>Purchase Type</div>
                <select
                  value={purchaseType}
                  onChange={(e) => setPurchaseType(e.target.value as 'self' | 'gift')}
                  style={{ width: '100%', background: '#080808', border: '1px solid #222', borderRadius: '3px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                >
                  <option value="self">🧍 Purchase for myself</option>
                  <option value="gift">🎁 Purchase as a gift for a friend</option>
                </select>
              </div>

              {purchaseType === 'gift' && (
                <div style={{ marginBottom: '14px' }}>
                  <div className="form-label" style={{ marginBottom: '6px' }}>Recipient's Steam64 ID</div>
                  <input
                    className="form-input"
                    type="text"
                    maxLength={17}
                    placeholder="76561198000000000"
                    value={giftSteam64}
                    onChange={(e) => setGiftSteam64(e.target.value)}
                    style={{ fontFamily: 'monospace' }}
                  />
                  <div style={{ fontSize: '11px', color: '#444', marginTop: '5px' }}>17-digit Steam ID of the player you're gifting to.</div>
                </div>
              )}

              <div style={{ background: '#0d0d12', borderLeft: '3px solid #7B68EE', padding: '11px 13px', fontSize: '12px', color: '#777', lineHeight: 1.7, borderRadius: '2px' }}>
                💳 For demo purposes, clicking "Complete Purchase" will mark the order as paid.
              </div>
            </>
          )}

          {step === 'confirm' && orderId && (
            <div style={{ textAlign: 'center', padding: '6px 0 18px' }}>
              <div style={{ fontSize: '42px', marginBottom: '9px' }}>✅</div>
              <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '18px', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Payment Successful!</h3>
              <p style={{ color: '#555', fontSize: '12px', lineHeight: 1.7 }}>Your rank will be delivered within 24 hours. Check your purchase log in your account.</p>
              <div style={{ marginTop: '14px', background: '#0a0a0a', border: '1px solid #161616', borderRadius: '3px', padding: '10px 12px', display: 'inline-block' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#8B0000', textTransform: 'uppercase', marginBottom: '2px' }}>Order ID</div>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '14px', color: '#7B68EE', letterSpacing: '1px', fontWeight: 700 }}>{orderId}</div>
              </div>
            </div>
          )}
        </div>

        {step === 'cart' && items.length > 0 && (
          <div className="modal-foot">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: '2px solid #8B0000', marginBottom: '9px', width: '100%' }}>
              <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#555' }}>Total</span>
              <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '21px', fontWeight: 700, color: '#fff' }}>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => user ? setStep('payment') : alert('Please log in first')}>
              Proceed to Payment →
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="modal-foot" style={{ flexDirection: 'column', gap: '7px' }}>
            <button className="btn btn-primary btn-full" onClick={handlePayment} disabled={loading}>
              {loading ? 'Processing...' : '✅ Complete Purchase'}
            </button>
            <button className="btn btn-outline btn-full" onClick={() => setStep('cart')}>← Back</button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="modal-foot">
            <button className="btn btn-primary btn-full" onClick={handleClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
