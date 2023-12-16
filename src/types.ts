import { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  date: Date
}

export type UserRegisterData = Omit<IUser, 'date' | '_id'>
export type UserLoginData = Pick<IUser, 'email' | 'password'>

export interface IPartido {
  _id: Types.ObjectId
  nombre: string
  siglas: string
  logotipo: string
  date: Date
}

export type PartidoData = Omit<IPartido, 'date'>
