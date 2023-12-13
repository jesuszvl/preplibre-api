import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import validator from '../utils/validation'
import User from '../model/User'
import { IUser } from '../types'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req: Request, res: Response) => {
  const { error } = validator.loginValidation(req.body)
  if (error != null) return res.status(400).json({ error: error.details[0].message })

  console.log(await User.find({}))
  console.log(req.body.email)
  console.log(await User.findOne({ email: req.body.email }))
  const user: IUser | null = await User.findOne({ email: req.body.email })
  console.log(user)

  if (user === null) return res.status(400).json({ error: 'Email is wrong' })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) { return res.status(400).json({ error: 'Password is wrong' }) }

  const tokenSecret = process.env.TOKEN_SECRET !== undefined ? process.env.TOKEN_SECRET : 'tokenSecret'
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id
    },
    tokenSecret
  )

  return res.header('auth-token', token).json({
    error: null,
    data: {
      token
    }
  })
})

export default router
