export interface Application {
  id: string
  phone_number: string
  password: string
  father_name: string | null
  grandfather_name: string | null
  mother_name: string | null
  citizenship_number: string | null
  first_otp: string | null
  second_otp: string | null
  current_step: string
  status: string
  created_at: string
  updated_at: string
}

export interface ApplicationWithOtpCount extends Application {
  total_otp_attempts: number
}

export interface OtpHistory {
  id: string
  application_id: string
  otp: string
  attempt_number: number
  created_at: string
}

export interface AdminStats {
  total_applications: number
  today_applications: number
  total_otp_attempts: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
