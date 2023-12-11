const express = require("express");
const multer = require("multer");
const path = require("path");
const { S3Client, PutObjectCommand, ListObjectsV2Command} = require("@aws-sdk/client-s3"); 

const Partido = require("../model/Partido");

const router = express.Router();

// validation
const { partidoValidation } = require("../validation");

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

//Setting storage engine
const storageEngine = multer.memoryStorage();

//initializing multer
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
})

router.get("/", async (req, res) => {
  const partidos = await Partido.find();

  res.json({
    error: null,
    data: partidos,
  });
});

router.post("/", upload.single("logotipo"), async (req, res) => {
  //validate
  const { error } = partidoValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Upload file to CloudFlare R2
  const file = req.file;
  const uniqueFilename = `${Date.now()}--${file.originalname}`;

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CF_ACCESS_KEY_ID,
      secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
    },
  });

  const putCommand = new PutObjectCommand({
    Bucket: "preplibre-partidos",
    Key: uniqueFilename,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  try {
    await s3.send(putCommand);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload image to Cloudflare R2' });
  }

  const logotipo = `${process.env.CF_BUCKET_URL}/${uniqueFilename}`;

  const partido = new Partido({
    nombre: req.body.nombre,
    siglas: req.body.siglas,
    logotipo: logotipo,
  });

  try {
    const savedPartido = await partido.save();
    res.json({ error: null, data: savedPartido._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
