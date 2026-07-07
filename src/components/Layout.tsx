import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth-context'
import { useCart } from '../lib/cart-context'
import AuthModal from './AuthModal'
import AccountModal from './AccountModal'
import CartModal from './CartModal'
import AdminPanel from './AdminPanel'

export default function Layout() {
  const { user, profile, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [copied, setCopied] = useState<'ip' | 'port' | null>(null)

  const handleCopy = (text: string, field: 'ip' | 'port') => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location])

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${typeof window !== 'undefined' ? window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) : 0})` }}></div>

      <div className="dev-banner">
        ⚠ BloodMoney RP is currently in development — stay tuned ⚠
      </div>

      <nav>
        <NavLink to="/" className="nav-logo">BMRP</NavLink>
        <button className="nav-ham" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? '✕' : '☰'}
        </button>
        <div className={`nav-links ${mobileNavOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive && location.pathname === '/' ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/staff" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Staff</NavLink>
          <NavLink to="/rules" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Laws & Rules</NavLink>
          <NavLink to="/getting-started" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Getting Started</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link nav-shop ${isActive ? 'active' : ''}`}>🛒 Shop</NavLink>
          <button className="nav-link nav-cart" onClick={() => setCartModalOpen(true)}>
            🛍 Cart <span className="cart-badge">{itemCount}</span>
          </button>
          <button
            className="nav-link nav-login"
            onClick={() => user ? setAccountModalOpen(true) : setAuthModalOpen(true)}
          >
            {user ? profile?.username || 'Account' : 'Login'}
          </button>
          {isAdmin() && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link nav-admin ${isActive ? 'active' : ''}`}>
              🛡 Admin
            </NavLink>
          )}
        </div>
      </nav>

      <div className="ip-bar">
        <span className="ip-lbl">🎮 Server</span>
        <div className="ip-chip" onClick={() => handleCopy('0.0.0.0', 'ip')}>
          <span className="ip-chip-lbl">IP</span>
          <span className="ip-chip-val">0.0.0.0</span>
          <span className={`ip-chip-hint ${copied === 'ip' ? 'ip-copied' : ''}`}>
            {copied === 'ip' ? '✓' : 'Copy'}
          </span>
        </div>
        <div className="ip-sep"></div>
        <div className="ip-chip" onClick={() => handleCopy('00000', 'port')}>
          <span className="ip-chip-lbl">PORT</span>
          <span className="ip-chip-val">00000</span>
          <span className={`ip-chip-hint ${copied === 'port' ? 'ip-copied' : ''}`}>
            {copied === 'port' ? '✓' : 'Copy'}
          </span>
        </div>
        <span className="ip-status">⚠ Under Development</span>
      </div>

      <Outlet />

      <footer>
        <div className="footer-logo">BloodMoney RP</div>
        <p style={{ marginBottom: '7px' }}>Unturned Roleplay · Est. 2026</p>
        <p>
          <a href="https://discord.gg/A6a7XcfP9P" target="_blank" rel="noopener" style={{ color: '#CC0000' }}>Join our Discord</a>
           · <span style={{ color: '#1a1a1a' }}>⚠ In Development</span>
        </p>
        <p style={{ marginTop: '10px', fontSize: '10px', color: '#111' }}>© 2026 BloodMoney RP.</p>
      </footer>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AccountModal open={accountModalOpen} onClose={() => setAccountModalOpen(false)} />
      <CartModal open={cartModalOpen} onClose={() => setCartModalOpen(false)} />
      {isAdmin() && <AdminPanel />}
    </>
  )
}
