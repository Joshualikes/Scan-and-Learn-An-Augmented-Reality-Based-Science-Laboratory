import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

export const ROLES = ['Admin', 'Student']

export function normalizeRole(role) {
  return role === 'Admin' ? 'Admin' : 'Student'
}

export function homePathFor(user) {
  return normalizeRole(user?.role) === 'Student' ? '/student' : '/'
}

export function toAuthEmail(username) {
  const local = String(username)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
  if (!local) throw new Error('Enter a valid username.')
  // Supabase Auth requires an email; keep the UI username-only and use a valid dummy domain.
  return `${local}@cabcabenlab.com`
}

export function mapAuthError(error) {
  const message = error?.message || 'Something went wrong.'
  if (/invalid login credentials/i.test(message)) return 'Invalid username or password.'
  if (/already registered/i.test(message) || /duplicate key/i.test(message)) {
    return 'Username is already taken.'
  }
  if (/email address/i.test(message) && /invalid/i.test(message)) {
    return 'Use letters, numbers, dots, underscores, or hyphens for the username.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'This account still needs email confirmation in Supabase Auth settings.'
  }
  if (/only administrators can view student accounts/i.test(message)) {
    return 'This login is not stored as Admin in Supabase. Run supabase/schema.sql in the SQL Editor, then log out and sign back in as Admin.'
  }
  if (/delete_student_account/i.test(message) && (/could not find the function/i.test(message) || /schema cache/i.test(message))) {
    return 'Run the latest supabase/schema.sql in the SQL Editor so Delete user can work.'
  }
  if (/password/i.test(message) && /at least/i.test(message)) {
    return 'Password must be at least 6 characters.'
  }
  if (/rate limit/i.test(message)) {
    return 'Too many signup attempts. Run supabase/schema.sql in the Supabase SQL Editor, then register again.'
  }
  return message
}
