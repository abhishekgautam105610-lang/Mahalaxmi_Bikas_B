"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, X, Filter } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export function ApplicationsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [phone, setPhone] = useState(searchParams.get("phone") || "")
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "")
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "")
  const [showFilters, setShowFilters] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (phone) params.set("phone", phone)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    router.push(`/admin/applications?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setPhone("")
    setDateFrom("")
    setDateTo("")
    setShowFilters(false)
    router.push("/admin/applications")
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (phone) params.set("phone", phone)
      if (dateFrom) params.set("dateFrom", dateFrom)
      if (dateTo) params.set("dateTo", dateTo)
      const res = await fetch(`/api/applications/export?${params.toString()}`)
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("Export completed")
    } catch {
      toast.error("Export failed")
    }
  }

  const hasFilters = search || phone || dateFrom || dateTo

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 md:space-y-4">
      <div className="md:hidden space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <Button
          variant="outline"
          className="w-full h-12 justify-start"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 justify-start"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <span className="ml-auto bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {(search ? 1 : 0) + (phone ? 1 : 0) + (dateFrom || dateTo ? 1 : 0)}
            </span>
          )}
        </Button>
        {showFilters && (
          <div className="space-y-3 pt-1">
            <Input
              placeholder="Filter by phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              title="From date"
              className="h-12"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              title="To date"
              className="h-12"
            />
            <div className="flex gap-3">
              <Button onClick={applyFilters} className="flex-1 h-12">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {hasFilters && (
                <Button variant="outline" className="h-12" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block space-y-4">
        <div className="grid gap-4 grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <Input
            placeholder="Filter by phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={applyFilters} size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport} className="ml-auto">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
