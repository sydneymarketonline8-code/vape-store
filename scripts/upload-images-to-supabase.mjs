/**
 * Upload real product photos to Supabase Storage and repoint the catalog at the
 * public URLs. Products without a matching photo keep their placeholder SVG.
 *
 * Run AFTER scripts/import-products.mjs (which seeds placeholder images), then
 * commit the updated products-data.json and re-run scripts/seed-supabase.mjs.
 *
 *   node scripts/upload-images-to-supabase.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { extname, basename, join } from 'path'

const IMG_DIR = 'c:/Users/BAHDEST/OneDrive/Desktop/website 2/public/products'
const JSON_PATH = 'c:/dev/vapestore/src/data/products-data.json'
const BUCKET = 'product-images'

// ── env ──────────────────────────────────────────────────────────────────────
const env = readFileSync('.env.local', 'utf-8')
for (const line of env.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && !k.startsWith('#')) process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
}
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SB_URL || !KEY) { console.error('Missing Supabase SB_URL / service role key'); process.exit(1) }

const CT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }

// ── match products → files by slug ──────────────────────────────────────────
function norm(s) {
  return s.toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
    .replace(/-iget-australia/g, '').replace(/-e\d{6,}/g, '')
    .replace(/-scaled|-optimized/g, '').replace(/\d+x\d+/g, '')
    .replace(/-\d+$/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
const files = readdirSync(IMG_DIR).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
const byExact = new Map(), byNorm = new Map()
for (const f of files) {
  const b = basename(f, extname(f)).toLowerCase()
  if (!byExact.has(b)) byExact.set(b, f)
  const n = norm(f); if (!byNorm.has(n)) byNorm.set(n, f)
}
function fileFor(slug) {
  return byExact.get(slug.toLowerCase()) || byNorm.get(norm(slug)) || null
}

// ── create bucket (idempotent) ──────────────────────────────────────────────
async function ensureBucket() {
  const res = await fetch(`${SB_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  })
  if (res.ok) { console.log(`✓ bucket "${BUCKET}" created (public)`); return }
  const txt = await res.text()
  if (/already exists|Duplicate/i.test(txt)) { console.log(`✓ bucket "${BUCKET}" already exists`); return }
  throw new Error(`bucket create failed: ${res.status} ${txt}`)
}

async function uploadOne(slug, file) {
  const ext = extname(file).toLowerCase()
  const objectName = `${slug}${ext}`
  const bytes = readFileSync(join(IMG_DIR, file))
  const res = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${objectName}`, {
    method: 'POST',
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': CT[ext] || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: bytes,
  })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`)
  return `${SB_URL}/storage/v1/object/public/${BUCKET}/${objectName}`
}

// ── main ─────────────────────────────────────────────────────────────────────
const products = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
const work = []
for (const p of products) {
  // Resume: skip products already pointing at a Supabase-hosted photo.
  if (/\/storage\/v1\/object\/public\//.test(p.image)) continue
  const file = fileFor(p.slug)
  if (file) work.push({ p, file })
}
console.log(`matched ${work.length}/${products.length} products to photos; uploading...`)

await ensureBucket()

let done = 0, failed = 0
const CONCURRENCY = 8
let idx = 0
async function worker() {
  while (idx < work.length) {
    const { p, file } = work[idx++]
    try {
      const url = await uploadOne(p.slug, file)
      p.image = url
      p.images = [url]
      done++
    } catch (e) {
      failed++
      if (failed <= 5) console.error(`\n  ✗ ${p.slug}: ${e.message}`)
    }
    if (done % 50 === 0) process.stdout.write(`\r✓ uploaded ${done}/${work.length} (${failed} failed)...`)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))
process.stdout.write(`\r✓ uploaded ${done}/${work.length} (${failed} failed)            \n`)

writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf-8')
const real = products.filter(p => /\/storage\/v1\/object\/public\//.test(p.image)).length
console.log(`\n🎉 Done. ${real} products now use real Supabase-hosted photos; ${products.length - real} keep placeholders.`)
