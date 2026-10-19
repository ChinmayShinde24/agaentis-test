import type { Request, Response } from 'express'
import { Employee } from '../models/Employee.js'
import { EMPLOYEE_ROLES, type CreateEmployeeInput, type UpdateEmployeeInput } from '../types/employee.js'

function toEmployeeResponse(doc: {
  _id: { toString(): string }
  name: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function isValidRole(role: unknown): boolean {
  return typeof role === 'string' && (EMPLOYEE_ROLES as readonly string[]).includes(role)
}

export async function getEmployees(req: Request, res: Response): Promise<void> {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
    const role =
      typeof req.query.role === 'string' && isValidRole(req.query.role) ? req.query.role : ''
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5))
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = {}

    if (search.length > 0) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    if (role) {
      filter.role = role
    }

    const [employees, total] = await Promise.all([
      Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Employee.countDocuments(filter),
    ])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    res.status(200).json({
      success: true,
      data: employees.map(toEmployeeResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('getEmployees error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch employees' })
  }
}

export async function createEmployee(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, role } = req.body as CreateEmployeeInput

    if (!name?.trim() || !email?.trim() || !role) {
      res.status(400).json({ success: false, message: 'name, email, and role are required' })
      return
    }

    if (!isValidRole(role)) {
      res.status(400).json({
        success: false,
        message: `role must be one of: ${EMPLOYEE_ROLES.join(', ')}`,
      })
      return
    }

    const employee = await Employee.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    })

    res.status(201).json({
      success: true,
      data: toEmployeeResponse(employee),
      message: 'Employee created',
    })
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      res.status(409).json({ success: false, message: 'Email already exists' })
      return
    }

    console.error('createEmployee error:', error)
    res.status(500).json({ success: false, message: 'Failed to create employee' })
  }
}

export async function updateEmployee(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { name, email, role } = req.body as UpdateEmployeeInput

    if (role !== undefined && !isValidRole(role)) {
      res.status(400).json({
        success: false,
        message: `role must be one of: ${EMPLOYEE_ROLES.join(', ')}`,
      })
      return
    }

    const updates: UpdateEmployeeInput = {}
    if (name !== undefined) updates.name = name.trim()
    if (email !== undefined) updates.email = email.trim().toLowerCase()
    if (role !== undefined) updates.role = role

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, message: 'No fields to update' })
      return
    }

    const employee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' })
      return
    }

    res.status(200).json({
      success: true,
      data: toEmployeeResponse(employee),
      message: 'Employee updated',
    })
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      res.status(409).json({ success: false, message: 'Email already exists' })
      return
    }

    console.error('updateEmployee error:', error)
    res.status(500).json({ success: false, message: 'Failed to update employee' })
  }
}

export async function deleteEmployee(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const employee = await Employee.findByIdAndDelete(id)

    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' })
      return
    }

    res.status(200).json({
      success: true,
      data: toEmployeeResponse(employee),
      message: 'Employee deleted',
    })
  } catch (error) {
    console.error('deleteEmployee error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete employee' })
  }
}
