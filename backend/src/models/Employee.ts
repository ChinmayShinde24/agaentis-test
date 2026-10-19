import { Schema, model, type InferSchemaType } from 'mongoose'
import { EMPLOYEE_ROLES } from '../types/employee.js'

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: EMPLOYEE_ROLES,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export type EmployeeDocument = InferSchemaType<typeof employeeSchema> & {
  _id: Schema.Types.ObjectId
}

export const Employee = model('Employee', employeeSchema)
