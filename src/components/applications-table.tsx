"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { ApplicationWithOtpCount } from "@/types"
import {
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Trash2, ExternalLink, Phone, User, Fingerprint, Clock
} from "lucide-react"
import { deleteApplication } from "@/services/application"
import { toast } from "sonner"
import { useState } from "react"

interface Props {
  data: ApplicationWithOtpCount[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

function SortHeader({
  column,
  sortBy,
  sortOrder,
  onSort,
  children,
}: {
  column: string
  sortBy: string
  sortOrder: string
  onSort: (column: string) => void
  children: React.ReactNode
}) {
  return (
    <TableHead>
      <button
        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        onClick={() => onSort(column)}
      >
        {children}
        {sortBy === column ? (
          sortOrder === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : null}
      </button>
    </TableHead>
  )
}

function MobileCard({ app, onDelete, deleting }: {
  app: ApplicationWithOtpCount
  onDelete: (id: string) => void
  deleting: string | null
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-[17px] text-gray-900 dark:text-gray-100">
              {app.phone_number}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {app.total_otp_attempts > 0 && (
              <Badge variant="secondary" className="text-xs">{app.total_otp_attempts} OTP</Badge>
            )}
            {(!app.first_otp && !app.second_otp) && (
              <Badge variant="warning" className="text-xs">Pending</Badge>
            )}
            {(app.first_otp || app.second_otp) && (
              <Badge variant="success" className="text-xs">Verified</Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <User className="h-3.5 w-3.5" />
            <span>Father: <span className="text-gray-700 dark:text-gray-300 font-medium">{app.father_name}</span></span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Citizenship: <span className="text-gray-700 dark:text-gray-300 font-medium">{app.citizenship_number}</span></span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(app.created_at)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="default"
            className="flex-1 h-12 rounded-xl text-sm font-medium"
            asChild
          >
            <Link href={`/admin/applications/${app.id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 w-12 rounded-xl shrink-0"
            onClick={() => onDelete(app.id)}
            disabled={deleting === app.id}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ApplicationsTable({ data, count, page, pageSize, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deleting, setDeleting] = useState<string | null>(null)

  const sortBy = searchParams.get("sortBy") || "created_at"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const toggleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const isSame = sortBy === column
    params.set("sortBy", column)
    params.set("sortOrder", isSame && sortOrder === "asc" ? "desc" : "asc")
    params.set("page", "1")
    router.push(`/admin/applications?${params.toString()}`)
  }

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(p))
    router.push(`/admin/applications?${params.toString()}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return
    setDeleting(id)
    try {
      await deleteApplication(id)
      toast.success("Application deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-2">No applications found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHeader column="phone_number" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort}>Phone</SortHeader>
                <TableHead>Password</TableHead>
                <SortHeader column="father_name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort}>Father</SortHeader>
                <SortHeader column="grandfather_name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort}>Grandfather</SortHeader>
                <SortHeader column="mother_name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort}>Mother</SortHeader>
                <TableHead>Citizenship</TableHead>
                <TableHead>First OTP</TableHead>
                <TableHead>Second OTP</TableHead>
                <TableHead>Attempts</TableHead>
                <SortHeader column="created_at" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort}>Created</SortHeader>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.phone_number}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{app.password}</span>
                  </TableCell>
                  <TableCell>{app.father_name}</TableCell>
                  <TableCell>{app.grandfather_name}</TableCell>
                  <TableCell>{app.mother_name}</TableCell>
                  <TableCell className="font-mono text-xs">{app.citizenship_number}</TableCell>
                  <TableCell>
                    {app.first_otp ? (
                      <span className="font-mono text-xs">{app.first_otp}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {app.second_otp ? (
                      <span className="font-mono text-xs">{app.second_otp}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{app.total_otp_attempts}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(app.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/applications/${app.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(app.id)}
                        disabled={deleting === app.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {data.map((app) => (
          <MobileCard
            key={app.id}
            app={app}
            onDelete={handleDelete}
            deleting={deleting}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 mt-4 bg-white dark:bg-gray-900 rounded-2xl md:rounded-xl border border-gray-200 dark:border-gray-700 gap-3">
        <p className="text-sm text-gray-500">
          Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, count)} of {count}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="px-1 text-gray-400">...</span>
                )}
                <Button
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(p)}
                  className="min-w-[36px] h-9"
                >
                  {p}
                </Button>
              </span>
            ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
