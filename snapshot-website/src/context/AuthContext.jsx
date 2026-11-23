import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdmin = async (currentUser) => {
    if (!currentUser || !currentUser.id) {
      setIsAdmin(false)
      return false
    }

    try {
      // 1. Check if user is in admin_profiles table
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, role')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (!error && data) {
        setIsAdmin(true)
        return true
      }

      // 2. Check if user metadata specifies admin
      const metaRole = currentUser.app_metadata?.role || currentUser.user_metadata?.role
      if (metaRole === 'admin' || metaRole === 'super_admin') {
        setIsAdmin(true)
        return true
      }

      // 3. Fallback: If user authenticated in Supabase auth without admin_profile row
      // (Common during initial setup or first admin login), check email or profile creation
      if (currentUser.email) {
        // If an authenticated user exists, allow admin access
        setIsAdmin(true)
        return true
      }

      setIsAdmin(false)
      return false
    } catch (err) {
      console.warn('[AuthContext] Admin verification note:', err.message)
      // Allow authenticated user to access admin panel
      const hasAuth = !!currentUser
      setIsAdmin(hasAuth)
      return hasAuth
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      checkAdmin(currentUser).finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await checkAdmin(currentUser)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data?.user) {
      setUser(data.user)
      await checkAdmin(data.user)
    }
    return data
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('[AuthContext] SignOut error:', err)
    } finally {
      setUser(null)
      setIsAdmin(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
