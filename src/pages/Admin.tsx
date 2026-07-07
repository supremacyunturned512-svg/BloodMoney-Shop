import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth-context'
import { supabase, ROLE_LABELS, ROLES } from '../lib/supabase'
import type { Order, Suggestion, Profile } from '../lib/supabase'

export default function Admin() {
  const { profile, isSuperAdmin } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({ orders: 0, revenue: 0, pending: 0 })
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersData) {
      setOrders(ordersData as Order[])
      const completed = ordersData.filter(o => o.order_status === 'Completed')
      const pending = ordersData.filter(o => o.order_status === 'Pending')
      const revenue = completed.reduce((sum, o) => sum + o.total, 0)
      setStats({ orders: ordersData.length, revenue, pending: pending.length })
    }

    const { data: sugData } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false })

    if (sugData) setSuggestions(sugData as Suggestion[])

    if (isSuperAdmin()) {
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersData) setUsers(usersData as Profile[])
    }

    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, updates: Partial<Order>) => {
    await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('order_id', orderId)
    loadData()
  }

  const completeOrder = async (order: Order) => {
    await supabase
      .from('orders')
      .update({
        order_status: 'Completed',
        payment_status: 'Paid',
        delivery_status: 'Delivered',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('order_id', order.order_id)

    // Add to supporters
    await supabase.from('supporters').insert({
      username: profile?.username || 'Unknown',
      amount: order.total
    })

    loadData()
    setSelectedOrder(null)
  }

  const updateSuggestionStatus = async (id: string, status: string) => {
    await supabase
      .from('suggestions')
      .update({ status })
      .eq('id', id)
    loadData()
  }

  const updateUserRole = async (userId: string, role: number) => {
    await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    loadData()
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pillClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'pill-pending'
      case 'Processing': return 'pill-processing'
      case 'Completed': return 'pill-complete'
      case 'Failed': return 'pill-failed'
      case 'Refunded': return 'pill-refunded'
      default: return 'pill-pending'
    }
  }

  if (loading) {
    return (
      <div className="section" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <p style={{ color: '#555' }}>Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="sec-title">🛡 Admin Panel</div>
      <p className="sec-sub">Manage orders, users, and server settings</p>

      {/* Stats */}
      <div className="adm-stat-row" style={{ marginBottom: '28px' }}>
        <div className="adm-stat">
          <div className="adm-stat-val">{stats.orders}</div>
          <div className="adm-stat-lbl">Total Orders</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-val">${stats.revenue.toFixed(2)}</div>
          <div className="adm-stat-lbl">Revenue</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-val">{stats.pending}</div>
          <div className="adm-stat-lbl">Pending</div>
        </div>
      </div>

      {/* Orders Section */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '14px', color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Orders</h3>

        <div className="adm-toolbar" style={{ marginBottom: '14px' }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '3px', padding: '7px 10px', color: '#fff', fontSize: '12px', outline: 'none', flex: 1, minWidth: '150px' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '3px', padding: '7px 10px', color: '#fff', fontSize: '12px', outline: 'none' }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <button className="adm-btn" onClick={loadData}>↻ Refresh</button>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#333', padding: '16px' }}>No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)}>
                    <td style={{ color: '#7B68EE', fontSize: '10px', letterSpacing: '1px' }}>{order.order_id}</td>
                    <td style={{ fontSize: '10px', color: '#555' }}>{order.user_id.substring(0, 8)}...</td>
                    <td style={{ fontFamily: 'Oswald, sans-serif' }}>${order.total.toFixed(2)}</td>
                    <td><span className={`pill ${pillClass(order.order_status)}`}>{order.order_status}</span></td>
                    <td><span className={`pill ${order.payment_status === 'Paid' ? 'pill-complete' : 'pill-pending'}`}>{order.payment_status}</span></td>
                    <td style={{ color: '#555', fontSize: '10px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="overlay open" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="modal modal-wide">
            <div className="modal-head">
              <div>
                <div className="modal-sub-lbl">Order Details</div>
                <h2>{selectedOrder.order_id}</h2>
              </div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '14px' }}>
                <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '3px', padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#8B0000', textTransform: 'uppercase', marginBottom: '2px' }}>Order ID</div>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '12px', color: '#7B68EE' }}>{selectedOrder.order_id}</div>
                </div>
                <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '3px', padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#8B0000', textTransform: 'uppercase', marginBottom: '2px' }}>Total</div>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '12px', color: '#fff' }}>${selectedOrder.total.toFixed(2)}</div>
                </div>
                <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '3px', padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#8B0000', textTransform: 'uppercase', marginBottom: '2px' }}>Created</div>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '12px', color: '#fff' }}>{new Date(selectedOrder.created_at).toLocaleString()}</div>
                </div>
                <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '3px', padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#8B0000', textTransform: 'uppercase', marginBottom: '2px' }}>Type</div>
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '12px', color: selectedOrder.is_gift ? '#C8A040' : '#fff' }}>{selectedOrder.is_gift ? '🎁 Gift' : 'Personal'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '14px', borderTop: '1px solid #1a1a1a', paddingTop: '11px' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '7px' }}>Items</div>
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #0f0f0f', fontSize: '12px' }}>
                    <span>{item.name}</span>
                    <span style={{ color: '#7B68EE' }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.order_id, { payment_status: 'Paid', order_status: 'Processing' })}
                  style={{ background: '#001426', border: '1px solid #3498db', color: '#3498db', fontFamily: 'Oswald, sans-serif', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 11px', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  ✅ Confirm Payment
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.order_id, { order_status: 'Processing' })}
                  style={{ background: '#001426', border: '1px solid #3498db', color: '#3498db', fontFamily: 'Oswald, sans-serif', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 11px', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  🔄 Processing
                </button>
                <button
                  onClick={() => completeOrder(selectedOrder)}
                  style={{ background: '#001a00', border: '1px solid #2ecc71', color: '#2ecc71', fontFamily: 'Oswald, sans-serif', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 11px', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  🏆 Complete & Deliver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      {isSuperAdmin() && (
        <>
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '14px', color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Suggestions & Feedback</h3>
            {suggestions.length === 0 ? (
              <p style={{ color: '#333', fontSize: '12px', padding: '8px 0' }}>No suggestions yet.</p>
            ) : (
              suggestions.map(s => (
                <div key={s.id} style={{ padding: '10px', borderBottom: '1px solid #111' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#8B0000', fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(139, 0, 0, 0.15)', padding: '2px 7px', borderRadius: '2px' }}>{s.type}</span>
                    <span style={{ color: '#555', fontSize: '10px' }}>{s.username} — {new Date(s.created_at).toLocaleDateString()}</span>
                    <span className={`pill ${s.status === 'Pending' ? 'pill-pending' : s.status === 'Done' ? 'pill-complete' : 'pill-failed'}`}>{s.status}</span>
                  </div>
                  <p style={{ color: '#D4D4D4', lineHeight: 1.5, marginBottom: '7px', fontSize: '12px' }}>{s.text}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => updateSuggestionStatus(s.id, 'Done')} style={{ background: 'none', border: '1px solid #2ecc71', color: '#2ecc71', fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', cursor: 'pointer' }}>✓ Done</button>
                    <button onClick={() => updateSuggestionStatus(s.id, 'Dismissed')} style={{ background: 'none', border: '1px solid #555', color: '#555', fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', cursor: 'pointer' }}>Dismiss</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Users Table */}
          <div>
            <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '14px', color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Registered Users</h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>In-Game</th>
                    <th>Steam64</th>
                    <th>Role</th>
                    <th>Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'Oswald, sans-serif', color: '#fff' }}>{u.username}</td>
                      <td style={{ fontSize: '11px', color: '#777' }}>{u.ingame_name || '—'}</td>
                      <td style={{ fontSize: '10px', color: '#333' }}>{u.steam64 || '—'}</td>
                      <td>
                        <span style={{ background: 'rgba(139, 0, 0, 0.2)', border: '1px solid #8B0000', color: '#CC0000', fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '2px' }}>
                          {ROLE_LABELS[u.role] || 'Player'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, parseInt(e.target.value))}
                          style={{ background: '#111', border: '1px solid #222', borderRadius: '3px', color: '#fff', fontSize: '11px', padding: '3px 7px' }}
                        >
                          {Object.entries(ROLES).map(([k, v]) => (
                            <option key={k} value={v}>{ROLE_LABELS[v]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
