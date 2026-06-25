/**
 * Bootstrap an admin account: create (or update) an auth user with the email
 * pre-confirmed, then set their profile role to 'admin'. Lets you log in
 * immediately without the email-confirmation step. Change the password after.
 *
 * Usage:
 *   node scripts/bootstrap-admin.mjs you@email.com               # generates a password
 *   node scripts/bootstrap-admin.mjs you@email.com 'YourPass123!' # uses your password
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */

import { readFileSync } from 'fs'
import { randomBytes } from 'crypto'
import { createClient } from '@supabase/supabase-js'

try {
  for (const line of readFileSync('.env.local', 'utf-8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#')) process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
  }
} catch {
  console.warn('No .env.local found — relying on process env')
}

const email = (process.argv[2] || '').trim().toLowerCase()
const password = process.argv[3] || `Av!${randomBytes(9).toString('base64url')}`
if (!email) {
  console.error('Usage: node scripts/bootstrap-admin.mjs <email> [password]')
  process.exit(1)
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(URL, KEY, { auth: { autoRefreshToken: false, persistSession: false } })

let userId
const { data: created, error: cErr } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { first_name: 'Admin' },
})

if (cErr) {
  if (/already|registered|exists/i.test(cErr.message)) {
    // User exists — find them and reset the password + confirm.
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const u = list.users.find(x => x.email?.toLowerCase() === email)
    if (!u) {
      console.error('✗ User exists but could not be located (more than 1000 users?).')
      process.exit(1)
    }
    userId = u.id
    await supabase.auth.admin.updateUserById(userId, { password, email_confirm: true })
    console.log('• Existing account found — password reset + email confirmed.')
  } else {
    console.error('✗ createUser error:', cErr.message)
    process.exit(1)
  }
} else {
  userId = created.user.id
  console.log('• Account created.')
}

const { error: pErr } = await supabase.from('profiles').upsert({ id: userId, email, role: 'admin' })
if (pErr) {
  console.error('✗ Could not set role=admin:', pErr.message)
  process.exit(1)
}

console.log('\n✓ Admin ready. Log in at /login with:')
console.log('   email:    ', email)
console.log('   password: ', password)
console.log('\n→ Change this password after your first login (Account → Account Info).')
