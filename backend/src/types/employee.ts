export const EMPLOYEE_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX',
] as const

export type EmployeeRole = (typeof EMPLOYEE_ROLES)[number]

export interface IEmployee {
  name: string
  email: string
  role: EmployeeRole
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateEmployeeInput {
  name: string
  email: string
  role: EmployeeRole
}

export interface UpdateEmployeeInput {
  name?: string
  email?: string
  role?: EmployeeRole
}

export interface EmployeeResponse {
  id: string
  name: string
  email: string
  role: EmployeeRole
  createdAt: Date
  updatedAt: Date
}

export interface EmployeeQueryParams {
  search?: string
  role?: EmployeeRole | ''
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedEmployeesResponse {
  success: true
  data: EmployeeResponse[]
  pagination: PaginationMeta
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  message: string
}
