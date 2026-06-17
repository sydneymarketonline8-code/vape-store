const STYLES: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-200 text-amber-700',
  confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
  processing: 'bg-blue-50 border-blue-200 text-blue-700',
  shipped: 'bg-sky-50 border-sky-200 text-sky-700',
  delivered: 'bg-green-50 border-green-200 text-green-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
  refunded: 'bg-red-50 border-red-200 text-red-700',
}

export function OrderStatusBadge({ status }: { status: string }) {
  const cls = STYLES[status?.toLowerCase()] ?? STYLES.pending
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {status}
    </span>
  )
}
