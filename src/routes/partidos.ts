/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

import validator from '../utils/validation'
import Partido from '../model/Partido'

const router = express.Router()

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback): void => {
  // Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/
  // check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimetype)

  if (mimeType && extName) {
    return cb(null, true)
  } else {
    cb(new Error('Error: You can Only Upload Images!!'))
  }
}

// Setting storage engine
const storageEngine = multer.memoryStorage()

// initializing multer
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb)
  }
})

router.get('/', async (_req: Request, res: Response) => {
  const partidos = await Partido.find()
  return res.json({
    error: null,
    data: partidos
  })
})

router.post('/', upload.single('logotipo'), async (req: Request, res: Response) => {
  // validate
  const { error } = validator.partidoValidation(req.body)
  if (error != null) return res.status(400).json({ error: error.details[0].message })

  if (req.file == null) {
    return res.status(400).json({ error: 'No file was included in the request' })
  }

  // Upload file to CloudFlare R2
  const file: Express.Multer.File = req.file
  const uniqueFilename = `${Date.now()}--${file.originalname}`

  const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID !== undefined ? process.env.CF_ACCOUNT_ID : ''
  const CF_ACCESS_KEY_ID = process.env.CF_ACCESS_KEY_ID !== undefined ? process.env.CF_ACCESS_KEY_ID : ''
  const CF_SECRET_ACCESS_KEY = process.env.CF_SECRET_ACCESS_KEY !== undefined ? process.env.CF_SECRET_ACCESS_KEY : ''
  const CF_BUCKET_URL = process.env.CF_BUCKET_URL !== undefined ? process.env.CF_BUCKET_URL : 'http://localhost:3000'

  console.log(CF_ACCOUNT_ID)

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CF_ACCESS_KEY_ID,
      secretAccessKey: CF_SECRET_ACCESS_KEY
    }
  })

  const putCommand = new PutObjectCommand({
    Bucket: 'preplibre-partidos',
    Key: uniqueFilename,
    Body: file.buffer,
    ContentType: file.mimetype
  })

  try {
    await s3.send(putCommand)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload image to Cloudflare R2' })
  }

  const logotipo = `${CF_BUCKET_URL}/${uniqueFilename}`

  const partido = new Partido({
    nombre: req.body.nombre,
    siglas: req.body.siglas,
    logotipo
  })

  try {
    const savedPartido = await partido.save()
    return res.json({ error: null, data: savedPartido._id })
  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
