import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase, ROLES } from './supabase'
import type { Profile } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string, ingameName: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (!error && data) {
      setProfile(data as Profile)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        (async () => {
          await fetchProfile(session.user.id)
          setLoading(false)
        })()
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).then(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const mapError = (msg: string | null | undefined): string => {
    if (!msg || msg === '0') return 'Something went wrong. Please check your connection and try again.'
    if (msg.toLowerCase().includes('invalid login')) return 'Incorrect email or password.'
    if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('user already')) return 'An account with that email already exists.'
    if (msg.toLowerCase().includes('row-level security') || msg.toLowerCase().includes('rls')) return 'Account creation failed. Please try again.'
    if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate')) return 'That username is already taken. Please choose another.'
    return msg
  }

  const signUp = async (email: string, password: string, username: string, ingameName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            ingame_name: ingameName
          }
        }
      })

      if (error) {
        return { error: mapError(error.message) }
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: username.toLowerCase(),
            ingame_name: ingameName,
            role: ROLES.PLAYER
          }, { onConflict: 'id', ignoreDuplicates: true })

        if (profileError) {
          return { error: mapError(profileError.message) }
        }
      }

      return { error: null }
    } catch {
      return { error: 'Connection error. Please try again.' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { error: mapError(error.message) }
      }
      return { error: null }
    } catch {
      return { error: 'Connection error. Please try again.' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const isAdmin = () => profile?.role !== undefined && profile.role >= ROLES.HEAD_ADMIN
  const isSuperAdmin = () => profile?.role !== undefined && profile.role >= ROLES.CO_OWNER

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
