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
  ChevronLeft, ChevronRight,
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

function StatusBadge({ status }: { status: string }) {
  const variant = status === "Completed" ? "success" as const
    : status === "OTP Verification" ? "warning" as const
    : status === "In Progress" ? "default" as const
    : "secondary" as const

  return <Badge variant={variant} className="text-xs">{status}</Badge>
}

function StepBadge({ step }: { step: string }) {
  return (
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
      {step}
    </span>
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
            <Phone className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="font-semibold text-[17px] text-gray-900 dark:text-gray-100">
              {app.phone_number}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={app.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StepBadge step={app.current_step} />
          {app.total_otp_attempts > 0 && (
            <Badge variant="secondary" className="text-xs">{app.total_otp_attempts} OTP</Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {app.father_name && (
            <div className="flex items-center gap-2 text-gray-500">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>Father: <span className="text-gray-700 dark:text-gray-300 font-medium">{app.father_name}</span></span>
            </div>
          )}
          {app.citizenship_number && (
            <div className="flex items-center gap-2 text-gray-500">
              <Fingerprint className="h-3.5 w-3.5 shrink-0" />
              <span>Citizenship: <span className="text-gray-700 dark:text-gray-300 font-medium">{app.citizenship_number}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-3.5 w-3.5 shrink-0" />
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

function Value({ val, fallback = "—" }: { val: string | null | undefined; fallback?: string }) {
  return val ? <span>{val}</span> : <span className="text-gray-400">{fallback}</span>
}

export function ApplicationsTable({ data, count, page, pageSize, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deleting, setDeleting] = useState<string | null>(null)

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
                <TableHead>Phone</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Step</TableHead>
                <TableHead>Father</TableHead>
                <TableHead>Grandfather</TableHead>
                <TableHead>Mother</TableHead>
                <TableHead>Citizenship</TableHead>
                <TableHead>First OTP</TableHead>
                <TableHead>Second OTP</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Created</TableHead>
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
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    <StepBadge step={app.current_step} />
                  </TableCell>
                  <TableCell><Value val={app.father_name} /></TableCell>
                  <TableCell><Value val={app.grandfather_name} /></TableCell>
                  <TableCell><Value val={app.mother_name} /></TableCell>
                  <TableCell className="font-mono text-xs"><Value val={app.citizenship_number} /></TableCell>
                  <TableCell><Value val={app.first_otp} fallback="-" /></TableCell>
                  <TableCell><Value val={app.second_otp} fallback="-" /></TableCell>
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
