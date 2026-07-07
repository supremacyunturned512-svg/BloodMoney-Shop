import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth-context'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Staff from './pages/Staff'
import Rules from './pages/Rules'
import GettingStarted from './pages/GettingStarted'
import Admin from './pages/Admin'
import { CartProvider } from './lib/cart-context'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="about" element={<About />} />
              <Route path="staff" element={<Staff />} />
              <Route path="rules" element={<Rules />} />
              <Route path="getting-started" element={<GettingStarted />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
