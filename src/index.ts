import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'

const app = express()
const port = process.env.PORT !== undefined ? process.env.PORT : 3000
const dbConnect = process.env.DB_CONNECT !== undefined ? process.env.DB_CONNECT : 'mongodb://localhost:27017/test'

// Connect to DB
mongoose.set('strictQuery', false)
mongoose.connect(dbConnect).then(() => {
  console.log('connected to db')
}).catch((err) => {
  console.log(err)
})

// Setup express app
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!')
})

app.use('/user', authRoutes)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
