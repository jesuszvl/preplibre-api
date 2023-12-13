import { Schema, model } from 'mongoose'
import { IPartido } from '../types'

const partidoSchema = new Schema<IPartido>({
  nombre: {
    type: String,
    required: true,
    max: 255
  },
  siglas: {
    type: String,
    required: true,
    min: 1,
    max: 255
  },
  logotipo: {
    type: String,
    required: [true, 'Image field is required.']
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default model<IPartido>('Partido', partidoSchema)
