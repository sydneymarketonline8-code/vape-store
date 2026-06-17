'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, Check, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ProfileForm({
  userId,
  initialName,
  initialPhone,
  initialAvatar,
}: {
  userId: string
  initialName: string
  initialPhone: string
  initialAvatar: string | null
}) {
  const router = useRouter()
  const [fullName, setFullName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${userId}/avatar.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      // cache-bust so the new image shows immediately
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`)
    } catch {
      setError('Avatar upload failed. Make sure the "avatars" storage bucket exists.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, avatarUrl, currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Could not save changes.')
        return
      }
      setSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      router.refresh()
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none'
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Avatar */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-gray-900">Profile Photo</h2>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="h-16 w-16 rounded-full object-cover" unoptimized />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <User className="h-7 w-7" />
            </span>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={uploading} />
          </label>
        </div>
      </section>

      {/* Details */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-gray-900">Personal Details</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="04XX XXX XXX" />
          </div>
        </div>
      </section>

      {/* Password */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-base font-bold text-gray-900">Change Password</h2>
        <p className="mb-4 text-xs text-gray-400">Leave blank to keep your current password.</p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input className={inputCls} type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>New Password</label>
              <input className={inputCls} type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Confirm Password</label>
              <input className={inputCls} type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
