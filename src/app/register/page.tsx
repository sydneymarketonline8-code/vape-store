'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600">
              <Zap className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-zinc-500 mt-1">Join VapeStore and start shopping</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 pr-11 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="age-confirm"
                className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-800 accent-violet-600"
              />
              <label htmlFor="age-confirm" className="text-sm text-zinc-400">
                I confirm I am 21 years of age or older and agree to the{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Create Account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
