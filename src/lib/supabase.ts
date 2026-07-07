import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  ingame_name: string
  steam64: string
  role: number
  owned_items: string[]
  created_at: string
}

export type Order = {
  id: string
  user_id: string
  order_id: string
  steam64: string
  gift_steam64: string
  is_gift: boolean
  items: OrderItem[]
  total: number
  payment_method: string
  payment_status: string
  order_status: string
  delivery_status: string
  notes: string
  created_at: string
  updated_at: string
  completed_at: string | null
}

export type OrderItem = {
  name: string
  price: number
  itemKey: string
}

export type Suggestion = {
  id: string
  user_id: string | null
  username: string
  type: string
  text: string
  status: string
  created_at: string
}

export type Supporter = {
  id: string
  username: string
  amount: number
  created_at: string
}

export type GiftCode = {
  id: string
  code: string
  item_key: string
  item_name: string
  created_by: string
  created_at: string
  used: boolean
  used_by: string
  used_at: string | null
}

export const ROLES = {
  PLAYER: 0,
  ADMIN: 1,
  HEAD_ADMIN: 2,
  OWNER: 3,
  CO_OWNER: 9
} as const

export const ROLE_LABELS: Record<number, string> = {
  0: 'Player',
  1: 'Admin',
  2: 'Head Admin',
  3: 'Owner',
  9: 'Co-Owner'
}

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded'
} as const

export const DELIVERY_STATUS = {
  QUEUED: 'Queued',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  MANUAL: 'Manual Required'
} as const
