'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SITE_TAGLINE } from '@/lib/site'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex flex-col items-center">
            <span className="text-2xl font-black tracking-tight text-[#1B7A3E]">VAPESAU</span>
            <span className="text-xs text-gray-400">{SITE_TAGLINE}</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-1 text-sm text-gray-500">We&apos;ll email you a link to set a new one.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <Mail className="h-8 w-8 text-[#1B7A3E]" />
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Check your email</h2>
              <p className="mt-2 text-sm text-gray-500">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Open it to choose a new password.
              </p>
              <Link href="/login" className="mt-6 inline-block rounded-lg bg-[#1B7A3E] px-6 py-3 font-semibold text-white hover:bg-[#156331]">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#1B7A3E] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] py-3 font-semibold text-white transition-colors hover:bg-[#156331] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
              </button>
              <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-[#1B7A3E]">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
