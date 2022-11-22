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

//Requests
app.get("/", (req, res) => {
  res.json({
    Title: "Hola mundo",
  });
});

//Iniciando el servidor
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
