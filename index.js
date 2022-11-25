const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const dbConnect = process.env.DB_CONNECT;

// connect to db
mongoose.connect(
  dbConnect,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to db")
);

// import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const partidosRoutes = require("./routes/partidos");
const municipiosRoutes = require("./routes/municipios");
const verifyToken = require("./routes/validate-token");

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
  destination: "./images",
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
});

app.use(express.json()); // for body parser
app.post("/single", upload.single("image"), (req, res) => {
  if (req.file) {
    res.send("Single file uploaded successfully");
  } else {
    res.status(400).send("Please upload a valid image");
  }
});

app.use("/api/user", authRoutes);
// this route is protected with token
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/partidos", verifyToken, partidosRoutes);
app.use("/api/municipios", verifyToken, municipiosRoutes);

app.get("/", (req, res) => {
  res.send("openprep");
});

//Iniciando el servidor
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
