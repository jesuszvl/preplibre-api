const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

app.use(express.json()); // for body parser
app.use("/api/user", authRoutes);

// this route is protected with token
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/partidos", verifyToken, partidosRoutes);
app.use("/api/municipios", verifyToken, municipiosRoutes);

//Iniciando el servidor
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
