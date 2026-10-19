export const EMPLOYEE_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX',
] as const

export type EmployeeRole = (typeof EMPLOYEE_ROLES)[number]

export interface Employee {
  id: string
  name: string
  email: string
  role: EmployeeRole
  createdAt?: string
  updatedAt?: string
}

export type EmployeeFormData = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface GetEmployeesParams {
  search?: string
  role?: EmployeeRole | ''
  page?: number
  limit?: number
}

export interface PaginatedEmployeesResponse {
  success: true
  data: Employee[]
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
