/**
 * Grant the admin role to a user (so they can access /admin).
 *
 * Usage:
 *   node scripts/make-admin.mjs                 # uses DEFAULT_EMAIL below
 *   node scripts/make-admin.mjs you@email.com   # any email
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * (service role bypasses RLS). The user must already have signed up, and the
 * 001_init.sql migration must have been run (so profiles.role exists).
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Load .env.local manually (matches the other scripts).
try {
  const env = readFileSync('.env.local', 'utf-8')
  for (const line of env.split('\n')) {
    const [key, ...vals] = line.split('=')
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
} catch {
  console.warn('No .env.local found — relying on process env')
}

const DEFAULT_EMAIL = 'sydneymarketonline8@gmail.com'
const email = (process.argv[2] || DEFAULT_EMAIL).trim().toLowerCase()

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(URL, KEY)

const { data, error } = await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .ilike('email', email)
  .select('id, email, role')

if (error) {
  if (error.code === '42703') {
    console.error('✗ profiles.role column is missing — run supabase/migrations/001_init.sql first.')
  } else if (error.code === '42P01') {
    console.error('✗ profiles table is missing — run supabase/migrations/001_init.sql first.')
  } else {
    console.error('✗ Error:', error.message)
  }
  process.exit(1)
}

if (!data || data.length === 0) {
  console.error(`✗ No profile found for ${email}. Sign up at /register first, then re-run.`)
  process.exit(1)
}

console.log(`✓ ${email} is now an admin:`, data[0])
