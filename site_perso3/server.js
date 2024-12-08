const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const taskRouter = require("./route/taskRouter.js");

// Initialiser l'application Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Utilisation de __dirname pour accéder au répertoire courant
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/tasks", taskRouter);

// Route pour le fichier contact.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "projet_perso.html"));
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Exporter le PORT si nécessaire
module.exports = PORT;
