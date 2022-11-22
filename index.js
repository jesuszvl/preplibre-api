const express = require("express");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3000;

//Configuraciones
app.set("port", port);
app.set("json spaces", 2);

//Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const partidos = [
  { nombre: "Partido Accion Nacional", siglas: "PAN" },
  { nombre: "Partido Revolucionario Institucional", siglas: "PRI" },
  { nombre: "Movimiento Ciudadano", siglas: "MC" },
  { nombre: "Movimiento Regeneracion Nacional", siglas: "MORENA" },
  { nombre: "Partido del Trabajo", siglas: "PT" },
];

const municipios = [
  { nombre: "Mexicali", siglas: "MXL" },
  { nombre: "Tijuana", siglas: "TIJ" },
  { nombre: "Ensenada", siglas: "ENS" },
  { nombre: "Rosarito", siglas: "ROS" },
];

//Requests
app.get("/", (req, res) => {
  res.json({
    Title: "Hola mundo",
  });
});

app.get("/partidos", (req, res) => {
  res.json(partidos);
});

app.get("/municipios", (req, res) => {
  res.json(municipios);
});

//Iniciando el servidor
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
