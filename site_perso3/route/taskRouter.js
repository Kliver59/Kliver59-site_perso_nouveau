const express = require("express");

const taskRouter = express.Router();

// Définir des routes pour `taskRouter`
taskRouter.get("/", (req, res) => {
  res.json({ message: "Liste des tâches" });
});

module.exports = taskRouter; // Exporter avec `module.exports` en CommonJS
