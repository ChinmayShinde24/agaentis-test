import cors from 'cors'
import express from 'express'
import employeeRoutes from './routes/employeeRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/employees', employeeRoutes)

export default app
