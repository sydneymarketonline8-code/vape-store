'use client'

export function NewsletterForm({ inputClass = '', buttonClass = '' }: { inputClass?: string; buttonClass?: string }) {
  return (
    <form
      onSubmit={e => e.preventDefault()}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        placeholder="Enter your email address"
        className={`flex-1 rounded-xl border border-[#1e1e2e] bg-[#0d0d15] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors ${inputClass}`}
      />
      <button
        type="submit"
        className={`rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] ${buttonClass}`}
      >
        Subscribe
      </button>
    </form>
  )
}
