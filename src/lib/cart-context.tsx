import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  itemKey: string
  requiresKey: string | null
}

interface CartContextType {
  items: CartItem[]
  addToCart: (name: string, price: number, itemKey: string, requiresKey: string | null) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = useCallback((name: string, price: number, itemKey: string, requiresKey: string | null) => {
    const id = Date.now() + Math.random()
    setItems(prev => {
      if (prev.find(i => i.itemKey === itemKey)) return prev
      return [...prev, { id, name, price, itemKey, requiresKey }]
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
