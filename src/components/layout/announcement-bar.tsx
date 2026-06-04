export function AnnouncementBar() {
  return (
    <div className="bg-[#1a3a2a] py-2 text-center text-sm text-white">
      $250 minimum order &middot;{' '}
      <strong>Free shipping over $300</strong> — Australia-wide
      <span className="mx-3 hidden opacity-40 sm:inline">|</span>
      <a
        href="tel:+61480831679"
        className="hidden text-green-300 transition-colors hover:text-white sm:inline"
      >
        +61 480 831 679
      </a>
    </div>
  )
}
