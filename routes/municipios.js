const express = require("express");
const router = express.Router();

const municipios = [
  { nombre: "Mexicali", siglas: "MXL" },
  { nombre: "Tijuana", siglas: "TIJ" },
  { nombre: "Ensenada", siglas: "ENS" },
  { nombre: "Rosarito", siglas: "ROS" },
];

router.get("/", (req, res) => {
  res.json({
    error: null,
    data: municipios,
  });
});
module.exports = router;
