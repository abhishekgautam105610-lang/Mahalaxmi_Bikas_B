export interface Application {
  id: string
  phone_number: string
  password: string
  father_name: string
  grandfather_name: string
  mother_name: string
  citizenship_number: string
  first_otp: string | null
  second_otp: string | null
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

export interface Step1Data {
  number: string
  password: string
}

export interface Step2Data {
  father_name: string
  grandfather_name: string
  mother_name: string
  citizenship_number: string
}

export interface FormData extends Step1Data, Step2Data {}

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
