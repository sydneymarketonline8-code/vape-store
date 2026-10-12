'use client'

export function NewsletterForm({ className = '' }: { className?: string }) {
  return (
    <form
      onSubmit={e => e.preventDefault()}
      className={`flex flex-col gap-3 sm:flex-row ${className}`}
    >
      <input
        type="email"
        placeholder="Enter your email address"
        aria-label="Email address"
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#7C3AED] focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-[#7C3AED] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#6D28D9]"
      >
        Subscribe
      </button>
    </form>
  )
}
