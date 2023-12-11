import Joi, { Schema, ValidationResult } from 'joi'

export interface UserData {
  name?: string
  email: string
  password: string
}

export interface PartidoData {
  nombre?: string
  siglas?: string
  logotipo?: string
}

const registerValidation = (data: UserData): ValidationResult => {
  const schema: Schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  })
  return schema.validate(data)
}

const loginValidation = (data: UserData): ValidationResult => {
  const schema: Schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  })
  return schema.validate(data)
}

const partidoValidation = (data: PartidoData): ValidationResult => {
  const schema: Schema = Joi.object({
    nombre: Joi.string().max(255).required(),
    siglas: Joi.string().min(1).max(255).required(),
    logotipo: Joi.string()
  })
  return schema.validate(data)
}

const validator = {
  registerValidation,
  loginValidation,
  partidoValidation
}

export default validator
