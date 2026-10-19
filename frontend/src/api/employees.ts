import api from './client'
import type {
  ApiSuccessResponse,
  Employee,
  EmployeeFormData,
  GetEmployeesParams,
  PaginatedEmployeesResponse,
} from '../types'

export async function getEmployees(
  params: GetEmployeesParams = {},
): Promise<PaginatedEmployeesResponse> {
  const { data } = await api.get<PaginatedEmployeesResponse>('/employees', {
    params: {
      search: params.search || undefined,
      role: params.role || undefined,
      page: params.page ?? 1,
      limit: params.limit ?? 5,
    },
  })
  return data
}

export async function createEmployee(payload: EmployeeFormData): Promise<Employee> {
  const { data } = await api.post<ApiSuccessResponse<Employee>>('/employees', payload)
  return data.data
}

export async function updateEmployee(id: string, payload: EmployeeFormData): Promise<Employee> {
  const { data } = await api.put<ApiSuccessResponse<Employee>>(`/employees/${id}`, payload)
  return data.data
}

export async function deleteEmployee(id: string): Promise<Employee> {
  const { data } = await api.delete<ApiSuccessResponse<Employee>>(`/employees/${id}`)
  return data.data
}
