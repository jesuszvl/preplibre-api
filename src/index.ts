import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import partidosRoutes from './routes/partidos'
import dotenv from 'dotenv'
import verifyToken from './routes/validate-token'

dotenv.config()
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
  res.send('Bienvenido a la API de PREP Libre')
})

app.use('/user', authRoutes)
app.use('/partidos', verifyToken, partidosRoutes)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
