import { useEffect } from 'react'
import type { Employee, EmployeeFormData } from '../types'
import Form from './Form'

interface FormModalProps {
  employee: Employee
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => void
  onDelete: (id: string) => void
}

export default function FormModal({ employee, onClose, onSubmit, onDelete }: FormModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleDelete() {
    onDelete(employee.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 id="form-modal-title" className="text-lg font-semibold text-slate-900">
              Edit employee
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{employee.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <Form
            editingEmployee={employee}
            onSubmit={onSubmit}
            onCancelEdit={onClose}
            embedded
          />

          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 sm:w-auto"
            >
              Delete employee
            </button>
            <p className="mt-2 text-xs text-slate-500">
              This permanently removes {employee.name} from the list.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
