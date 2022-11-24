const express = require("express");
const router = express.Router();

const partidos = [
  { nombre: "Partido Accion Nacional", siglas: "PAN" },
  { nombre: "Partido Revolucionario Institucional", siglas: "PRI" },
  { nombre: "Movimiento Ciudadano", siglas: "MC" },
  { nombre: "Movimiento Regeneracion Nacional", siglas: "MORENA" },
  { nombre: "Partido del Trabajo", siglas: "PT" },
];

router.get("/", (req, res) => {
  res.json({
    error: null,
    data: partidos,
  });
});
module.exports = router;
