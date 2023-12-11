import { Schema, model } from 'mongoose'

interface IUser {
  name: string
  email: string
  password: string
  date: Date
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default model<IUser>('User', userSchema)
