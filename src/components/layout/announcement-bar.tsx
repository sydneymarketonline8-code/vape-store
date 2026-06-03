export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-cyan-600 py-2 text-center text-sm font-medium text-white">
      <span className="mr-3">⚡</span>
      FREE SHIPPING on orders over $99
      <span className="mx-3 opacity-50">|</span>
      Use code{' '}
      <span className="rounded bg-white/20 px-1.5 py-0.5 font-bold tracking-wide">
        VAPE10
      </span>{' '}
      for 10% off
      <span className="ml-3">⚡</span>
    </div>
  )
}
