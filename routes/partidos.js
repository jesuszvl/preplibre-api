const express = require("express");
const Partido = require("../model/Partido");

const router = express.Router();

// validation
const { partidoValidation } = require("../validation");

const partidos = [
  { nombre: "Partido Accion Nacional", siglas: "PAN" },
  { nombre: "Partido Revolucionario Institucional", siglas: "PRI" },
  { nombre: "Movimiento Ciudadano", siglas: "MC" },
  { nombre: "Movimiento Regeneracion Nacional", siglas: "MORENA" },
  { nombre: "Partido del Trabajo", siglas: "PT" },
];

router.get("/", async (req, res) => {
  const partidos = await Partido.find();

  res.json({
    error: null,
    data: partidos,
  });
});

router.post("/", async (req, res) => {
  //validate
  const { error } = partidoValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const partido = new Partido({
    nombre: req.body.nombre,
    siglas: req.body.siglas,
  });

  try {
    const savedPartido = await partido.save();
    res.json({ error: null, data: partido._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
