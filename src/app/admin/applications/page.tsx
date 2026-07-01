import { getApplicationsWithCount } from "@/services/application"
import { ApplicationsTable } from "@/components/applications-table"
import { ApplicationsFilters } from "@/components/applications-filters"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    search?: string
    page?: string
    sortBy?: string
    sortOrder?: string
    dateFrom?: string
    dateTo?: string
    phone?: string
  }>
}

export default async function AdminApplicationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || "1", 10)
  const sortBy = params.sortBy || "created_at"
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc"

  const result = await getApplicationsWithCount({
    search: params.search,
    page,
    pageSize: 10,
    sortBy,
    sortOrder,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    phone: params.phone,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage and review all applications
        </p>
      </div>

      <ApplicationsFilters />

      <div className="mt-6">
        <ApplicationsTable
          data={result.data}
          count={result.count}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
        />
      </div>
    </div>
  )
}
