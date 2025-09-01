'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout requireAuth={true} requireAdmin={true}>
      <div className="p-6">
        {children}
      </div>
    </DashboardLayout>
  )
}
