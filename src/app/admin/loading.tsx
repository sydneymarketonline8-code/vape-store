export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-7 w-40 rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-neutral-200 bg-white" />
        ))}
      </div>
      <div className="mt-6 h-64 rounded-xl border border-neutral-200 bg-white" />
    </div>
  )
}
