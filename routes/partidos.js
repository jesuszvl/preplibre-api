const express = require("express");
const multer = require("multer");
const path = require("path");

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
const storageEngine = multer.diskStorage({
  destination: "./tmp/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
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

  const logotipo = req.file ? req.file.path : "";

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
