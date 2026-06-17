import { redirect } from 'next/navigation'
import { createClient, isAdmin } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin · Aussie Vape' },
  robots: { index: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already guards /admin; re-check here as defence in depth.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin')
  if (!(await isAdmin(user.id))) redirect('/')

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
