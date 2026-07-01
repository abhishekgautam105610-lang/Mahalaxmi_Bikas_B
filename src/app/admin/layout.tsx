import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 pt-14 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
