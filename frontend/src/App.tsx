import axios from 'axios'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from './api/employees'
import EmployeeTable from './components/EmployeeTable'
import Form from './components/Form'
import FormModal from './components/FormModal'
import Pagination from './components/Pagination'
import {
  EMPLOYEE_ROLES,
  type Employee,
  type EmployeeFormData,
  type EmployeeRole,
  type PaginationMeta,
} from './types'

const PAGE_SIZE = 5

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | ''>('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoading(true)
        setError(null)
        const response = await getEmployees({
          search,
          role: roleFilter,
          page,
          limit: PAGE_SIZE,
        })
        setEmployees(response.data)
        setPagination(response.pagination)

        if (response.pagination.page > response.pagination.totalPages) {
          setPage(response.pagination.totalPages)
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load employees'))
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [search, roleFilter, page])

  async function handleAdd(formData: EmployeeFormData) {
    try {
      setSaving(true)
      setError(null)
      await createEmployee(formData)
      setSearchInput('')
      setSearch('')
      setRoleFilter('')
      setPage(1)
      const response = await getEmployees({
        search: '',
        role: '',
        page: 1,
        limit: PAGE_SIZE,
      })
      setEmployees(response.data)
      setPagination(response.pagination)
      toast.success('Employee created successfully')
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to add employee')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(formData: EmployeeFormData) {
    if (!editingEmployee) return
    try {
      setSaving(true)
      setError(null)
      await updateEmployee(editingEmployee.id, formData)
      setEditingEmployee(null)
      const response = await getEmployees({
        search,
        role: roleFilter,
        page,
        limit: PAGE_SIZE,
      })
      setEmployees(response.data)
      setPagination(response.pagination)
      toast.success('Employee updated successfully')
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to update employee')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      setSaving(true)
      setError(null)
      await deleteEmployee(id)
      if (editingEmployee?.id === id) setEditingEmployee(null)

      let nextPage = page
      const response = await getEmployees({
        search,
        role: roleFilter,
        page: nextPage,
        limit: PAGE_SIZE,
      })
      if (response.data.length === 0 && nextPage > 1) {
        nextPage -= 1
        setPage(nextPage)
        const previousPage = await getEmployees({
          search,
          role: roleFilter,
          page: nextPage,
          limit: PAGE_SIZE,
        })
        setEmployees(previousPage.data)
        setPagination(previousPage.pagination)
      } else {
        setEmployees(response.data)
        setPagination(response.pagination)
      }

      toast.success('Employee deleted successfully')
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to delete employee')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Employee Directory
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Add, edit, and remove employees from your team.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Form
          editingEmployee={null}
          onSubmit={handleAdd}
          onCancelEdit={() => undefined}
        />

        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Employees</h2>
              <p className="text-sm text-slate-500">
                {loading
                  ? 'Loading…'
                  : `${pagination.total} ${pagination.total === 1 ? 'employee' : 'employees'}`}
                {saving ? ' · Saving…' : ''}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
              <label className="flex w-full flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Search</span>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Name or email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                />
              </label>

              <label className="flex w-full flex-col gap-1.5 sm:max-w-[14rem]">
                <span className="text-sm font-medium text-slate-700">Role</span>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value as EmployeeRole | '')
                    setPage(1)
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                >
                  <option value="">All roles</option>
                  {EMPLOYEE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
              Loading employees…
            </div>
          ) : (
            <>
              <EmployeeTable
                employees={employees}
                onEdit={setEditingEmployee}
                onDelete={handleDelete}
                emptyMessage={
                  search || roleFilter
                    ? 'No employees match your filters.'
                    : 'No employees yet. Add one using the form above.'
                }
              />
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
                disabled={loading || saving}
              />
            </>
          )}
        </section>
      </main>

      {editingEmployee && (
        <FormModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App
