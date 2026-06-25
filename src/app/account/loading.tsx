export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <div className="hidden h-72 rounded-2xl bg-gray-100 lg:block" />
        <div className="mt-6 lg:mt-0">
          <div className="mb-6 h-7 w-40 rounded bg-gray-200" />
          <div className="h-64 rounded-2xl border border-gray-200 bg-white" />
        </div>
      </div>
    </div>
  )
}
