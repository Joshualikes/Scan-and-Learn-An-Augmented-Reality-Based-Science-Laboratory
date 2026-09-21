import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, mapAuthError, normalizeRole, supabase, toAuthEmail } from '../lib/supabase'
import { inventoryFromRow, inventoryToRow } from '../lib/equipmentDb'
import { SEED_EQUIPMENT, SEED_LOGS } from '../data'

const AppContext = createContext(null)
const STORAGE_VERSION = 'equip-scan-inventory-3'
const INVENTORY_DB_RESET = 'clear-equipment-inventory-2026-09-21'

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function resetStoredDataIfNeeded() {
  if (localStorage.getItem('sl_version') === STORAGE_VERSION) return
  ;['sl_users', 'sl_user', 'sl_equipment', 'sl_logs', 'sl_scans'].forEach((key) => {
    localStorage.removeItem(key)
  })
  localStorage.setItem('sl_version', STORAGE_VERSION)
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file.')
  }
}

function profilePayloadFromUser(user) {
  return {
    id: user.id,
    username: user.user_metadata?.username || user.email?.split('@')[0] || '',
    fullname: user.user_metadata?.fullname || '',
    role: normalizeRole(user.user_metadata?.role),
  }
}

async function ensureProfileRow(user) {
  const payload = profilePayloadFromUser(user)
  const { error: rpcError } = await supabase.rpc('ensure_own_profile')
  const missingRpc =
    rpcError &&
    (/could not find the function/i.test(rpcError.message) || /schema cache/i.test(rpcError.message))
  if (rpcError && !missingRpc) {
    console.warn(rpcError.message)
  }

  const { error } = await supabase.from('profiles').upsert(
    {
      id: payload.id,
      username: payload.username,
      fullname: payload.fullname,
      role: payload.role,
    },
    { onConflict: 'id' },
  )
  if (error && !/duplicate|row-level security/i.test(error.message)) {
    console.warn(error.message)
  }
  return payload
}

async function profileFromUser(user) {
  const fallback = profilePayloadFromUser(user)
  await ensureProfileRow(user)

  const { data } = await supabase.from('profiles').select('username, fullname, role').eq('id', user.id).maybeSingle()
  if (!data) return fallback

  return {
    id: user.id,
    username: data.username || fallback.username,
    fullname: data.fullname || fallback.fullname,
    role: normalizeRole(data.role || fallback.role),
  }
}

export function AppProvider({ children }) {
  resetStoredDataIfNeeded()
  const [currentUser, setCurrentUser] = useState(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)
  const [equipment, setEquipment] = useState(() => load('sl_equipment', SEED_EQUIPMENT))
  const [logs, setLogs] = useState(() => load('sl_logs', SEED_LOGS))
  const [scanCount, setScanCount] = useState(() => load('sl_scans', 0))

  useEffect(() => localStorage.setItem('sl_equipment', JSON.stringify(equipment)), [equipment])
  useEffect(() => localStorage.setItem('sl_logs', JSON.stringify(logs)), [logs])
  useEffect(() => localStorage.setItem('sl_scans', JSON.stringify(scanCount)), [scanCount])

  useEffect(() => {
    if (!supabase) {
      setEquipment([])
      return undefined
    }
    if (isSupabaseConfigured && !currentUser) return undefined

    let active = true
    const syncInventory = async () => {
      if (localStorage.getItem('sl_inventory_reset') !== INVENTORY_DB_RESET) {
        const { error: wipeError } = await supabase.from('equipment_inventory').delete().neq('id', '')
        if (!wipeError) localStorage.setItem('sl_inventory_reset', INVENTORY_DB_RESET)
        else console.warn(wipeError.message)
        if (active) setEquipment([])
      }

      const { data, error } = await supabase.from('equipment_inventory').select('*').eq('scanned', true)
      if (!active) return
      if (error) {
        console.warn(error.message)
        setEquipment([])
        return
      }
      setEquipment((data || []).map(inventoryFromRow).filter(Boolean))
    }

    syncInventory()
    return () => {
      active = false
    }
  }, [currentUser])

  useEffect(() => {
    if (!supabase) return undefined

    let active = true

    const syncUser = async (user) => {
      if (!user) {
        if (active) setCurrentUser(null)
        return
      }
      const profile = await profileFromUser(user)
      if (active) setCurrentUser(profile)
    }

    supabase.auth.getSession().then(({ data }) => {
      syncUser(data.session?.user ?? null).finally(() => {
        if (active) setAuthReady(true)
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const rememberLoginPassword = async (password) => {
    const { error } = await supabase.rpc('store_own_login_password', { p_password: password })
    if (error && !/could not find the function/i.test(error.message) && !/schema cache/i.test(error.message)) {
      console.warn(error.message)
    }
  }

  const register = async (payload) => {
    requireSupabase()
    const username = payload.username.trim()
    const fullname = payload.fullname.trim()
    const role = normalizeRole(payload.role)
    const email = toAuthEmail(username)

    const { error: rpcError } = await supabase.rpc('register_lab_user', {
      p_fullname: fullname,
      p_username: username,
      p_password: payload.password,
      p_role: role,
    })

    const missingRpc =
      rpcError &&
      (/could not find the function/i.test(rpcError.message) || /schema cache/i.test(rpcError.message))
    const taken =
      rpcError && (rpcError.code === '23505' || /already taken|duplicate|already registered/i.test(rpcError.message))

    if (rpcError && !missingRpc && !taken) {
      throw new Error(mapAuthError(rpcError))
    }

    if (missingRpc) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          data: { username, fullname, role },
        },
      })
      if (error) throw new Error(mapAuthError(error))
      if (data.session) {
        const profile = await profileFromUser(data.user)
        await rememberLoginPassword(payload.password)
        setCurrentUser(profile)
        return profile
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: payload.password,
    })
    if (error) {
      if (taken) throw new Error('Username is already taken.')
      throw new Error(mapAuthError(error))
    }
    const profile = await profileFromUser(data.user)
    await rememberLoginPassword(payload.password)
    setCurrentUser(profile)
    return profile
  }

  const login = async (username, password) => {
    requireSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: toAuthEmail(username),
      password,
    })
    if (error) throw new Error(mapAuthError(error))
    const profile = await profileFromUser(data.user)
    await rememberLoginPassword(password)
    setCurrentUser(profile)
    return profile
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setCurrentUser(null)
  }

  const updateAccount = async ({ fullname, username }) => {
    requireSupabase()
    if (!currentUser) throw new Error('Please log in first.')
    const nextName = String(fullname || '').trim()
    const nextUsername = String(username || '').trim()
    if (!nextName || !nextUsername) throw new Error('Full name and username are required.')

    const { error: authError } = await supabase.auth.updateUser({
      email: toAuthEmail(nextUsername),
      data: {
        username: nextUsername,
        fullname: nextName,
        role: currentUser.role,
      },
    })
    if (authError) throw new Error(mapAuthError(authError))

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username: nextUsername, fullname: nextName })
      .eq('id', currentUser.id)
    if (profileError) throw new Error(mapAuthError(profileError))

    setCurrentUser({ ...currentUser, username: nextUsername, fullname: nextName })
  }

  const updatePassword = async (password) => {
    requireSupabase()
    if (!currentUser) throw new Error('Please log in first.')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(mapAuthError(error))
    await rememberLoginPassword(password)
  }

  const listStudentLogins = async () => {
    requireSupabase()
    await supabase.rpc('ensure_own_profile')

    const { data, error } = await supabase.rpc('list_student_logins')
    if (!error) {
      return (data || []).map((row) => ({
        id: row.id,
        username: row.username,
        fullname: row.fullname,
        password: row.password || '',
        created_at: row.created_at,
      }))
    }

    const missingRpc =
      /could not find the function/i.test(error.message) || /schema cache/i.test(error.message)
    if (!missingRpc) throw new Error(mapAuthError(error))

    const { data: rows, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, fullname, role, created_at')
      .order('created_at', { ascending: false })
    if (profileError) throw new Error(mapAuthError(profileError))

    const students = (rows || [])
      .filter((row) => normalizeRole(row.role) === 'Student')
      .map((row) => ({ ...row, password: '' }))

    if (!students.length) {
      throw new Error(
        'Student accounts are stored in Supabase but this page cannot read them yet. Run supabase/schema.sql in the Supabase SQL Editor, then refresh.',
      )
    }
    return students
  }

  const resetStudentPassword = async (userId, password) => {
    requireSupabase()
    const { error } = await supabase.rpc('reset_student_password', {
      p_user_id: userId,
      p_password: password,
    })
    if (error) throw new Error(mapAuthError(error))
  }

  const deleteStudentAccount = async (userId) => {
    requireSupabase()
    const { error } = await supabase.rpc('delete_student_account', {
      p_user_id: userId,
    })
    if (error) throw new Error(mapAuthError(error))
  }

  const upsertEquipment = (item) => {
    setEquipment((prev) => {
      const exists = prev.some((e) => e.id === item.id)
      if (exists) return prev.map((e) => (e.id === item.id ? { ...e, ...item } : e))
      return [...prev, item]
    })
    if (supabase) {
      supabase
        .from('equipment_inventory')
        .upsert(inventoryToRow(item), { onConflict: 'id' })
        .then(({ error }) => {
          if (error) console.warn(error.message)
        })
    }
  }

  const deleteEquipment = async (equipmentId) => {
    const previous = equipment
    setEquipment((prev) => prev.filter((e) => e.id !== equipmentId))
    if (!supabase) return
    const { error } = await supabase.from('equipment_inventory').delete().eq('id', equipmentId)
    if (error) {
      setEquipment(previous)
      throw new Error(error.message)
    }
  }

  const recordLog = ({ equipmentId, action }) => {
    if (!currentUser) throw new Error('Please log in first.')
    const item = equipment.find((e) => e.id === equipmentId)
    if (!item) throw new Error('Equipment not found.')

    const today = new Date().toISOString().slice(0, 10)
    let nextStatus = item.status
    let logStatus = action
    let returnDate = ''

    if (action === 'Borrow') {
      nextStatus = 'Borrowed'
      logStatus = 'Borrowed'
      const due = new Date()
      due.setDate(due.getDate() + 7)
      returnDate = due.toISOString().slice(0, 10)
    } else {
      nextStatus = 'Available'
      logStatus = 'Returned'
      returnDate = today
    }

    setEquipment((prev) => prev.map((e) => (e.id === item.id ? { ...e, status: nextStatus } : e)))
    setLogs((prev) => [
      {
        id: Date.now(),
        date: today,
        user: currentUser.fullname,
        equipmentId,
        action,
        status: logStatus,
        returnDate,
      },
      ...prev,
    ])
  }

  const bumpScan = () => setScanCount((n) => n + 1)

  const stats = useMemo(() => {
    const total = equipment.reduce((sum, e) => sum + Number(e.quantity || 0), 0)
    const borrowedItems = equipment.filter((e) => e.status === 'Borrowed')
    const borrowed = borrowedItems.reduce((sum, e) => sum + Number(e.quantity || 0), 0)
    const available = Math.max(total - borrowed, 0)
    return {
      total,
      available,
      borrowed,
      scans: scanCount,
      logTotal: logs.length,
      logBorrowed: logs.filter((l) => l.status === 'Borrowed').length,
      logReturned: logs.filter((l) => l.status === 'Returned').length,
      logOverdue: logs.filter((l) => l.status === 'Overdue').length,
    }
  }, [equipment, logs, scanCount])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authReady,
        supabaseConfigured: isSupabaseConfigured,
        equipment,
        logs,
        stats,
        register,
        login,
        logout,
        updateAccount,
        updatePassword,
        listStudentLogins,
        resetStudentPassword,
        deleteStudentAccount,
        upsertEquipment,
        deleteEquipment,
        recordLog,
        bumpScan,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
