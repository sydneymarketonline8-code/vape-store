import { Construction } from 'lucide-react'

export function AdminPlaceholder({ title, note }: { title: string; note?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
        <Construction className="mb-3 h-10 w-10 text-neutral-300" />
        <p className="font-medium text-neutral-700">Coming soon</p>
        <p className="mt-1 max-w-md text-sm text-neutral-500">
          {note ?? 'This section hasn’t been built yet.'}
        </p>
      </div>
    </div>
  )
}
