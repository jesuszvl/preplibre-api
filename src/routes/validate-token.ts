/* eslint-disable @typescript-eslint/explicit-function-return-type */
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface RequestWithUser extends Request {
  token: string | JwtPayload
}

export const SECRET_KEY: Secret = process.env.TOKEN_SECRET !== undefined ? process.env.TOKEN_SECRET : 'tokenSecret'

// middleware to validate token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token')
  if (token === null || token === undefined || token === '') {
    res.status(401).json({ error: 'Access denied' })
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as RequestWithUser).token = decoded
    next()
  } catch (err) {
    res.status(400).json({ error: 'Token is not valid' })
  }
}

export default verifyToken
