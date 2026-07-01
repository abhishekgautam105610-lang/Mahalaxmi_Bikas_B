"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { signOutAdmin } from "@/services/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const handleSignOut = async () => {
    try {
      await signOutAdmin()
      toast.success("Signed out successfully")
      router.push("/admin/login")
    } catch {
      toast.error("Failed to sign out")
    }
  }

  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:hidden">
        <button
          className="h-11 w-11 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {currentPage?.label || "Admin"}
        </span>
        <div className="h-11 w-11" />
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-14 md:h-auto flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative h-10 w-32 md:h-12 md:w-36">
              <Image
                src="/logo.png"
                alt="Mahalaxmi Bank"
                fill
                className="object-contain"
              />
            </div>
            <button
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <ThemeToggle />
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
