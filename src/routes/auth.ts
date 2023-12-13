/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import validator from '../utils/validation'
import User from '../model/User'
import { SECRET_KEY } from './validate-token'

const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
  // validate the user
  const { error } = validator.registerValidation(req.body)
  if (error != null) { return res.status(400).json({ error: error.details[0].message }) }

  // check for existing email
  const isEmailExist = await User.findOne({ email: req.body.email })
  if (isEmailExist != null) { return res.status(400).json({ error: 'Email already exists' }) }

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password // hashed password
  })

  try {
    const savedUser = await user.save()
    return res.json({ error: null, data: savedUser._id })
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { error } = validator.loginValidation(req.body)
  if (error != null) return res.status(400).json({ error: error.details[0].message })

  const user = await User.findOne({ email: req.body.email })
  if (user === null) return res.status(400).json({ error: 'Email is wrong' })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) { return res.status(400).json({ error: 'Password is wrong' }) }

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id
    },
    SECRET_KEY
  )

  return res.header('auth-token', token).json({
    error: null,
    data: {
      token
    }
  })
})

export default router
