import { useEffect, useState, type FormEvent } from 'react'
import { EMPLOYEE_ROLES, type Employee, type EmployeeFormData, type EmployeeRole } from '../types'

const EMPTY_FORM: EmployeeFormData = {
  name: '',
  email: '',
  role: 'Frontend Developer',
}

interface FormProps {
  editingEmployee: Employee | null
  onSubmit: (data: EmployeeFormData) => void
  onCancelEdit: () => void
  /** When true, hide outer card chrome (used inside FormModal). */
  embedded?: boolean
}

export default function Form({ editingEmployee, onSubmit, onCancelEdit, embedded = false }: FormProps) {
  const [form, setForm] = useState<EmployeeFormData>(EMPTY_FORM)

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        name: editingEmployee.name,
        email: editingEmployee.email,
        role: editingEmployee.role,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editingEmployee])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    onSubmit(form)
    if (!editingEmployee) setForm(EMPTY_FORM)
  }

  const isEditing = editingEmployee !== null

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? 'w-full'
          : 'w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'
      }
    >
      {!embedded && (
        <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
          {isEditing ? 'Edit employee' : 'Add employee'}
        </h2>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="jane@company.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <label htmlFor="role" className="text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value as EmployeeRole }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          >
            {EMPLOYEE_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 sm:w-auto"
        >
          {isEditing ? 'Update employee' : 'Add employee'}
        </button>
      </div>
    </form>
  )
}
