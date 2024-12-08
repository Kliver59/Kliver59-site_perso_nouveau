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

// Utilisation de __dirname pour accéder au répertoire courant et servir des fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Route API pour les tâches
app.use("/api/v1/tasks", taskRouter);

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "projet_perso.html"));
});

// Démarrer le serveur sur le port dynamique attendu par Vercel
const PORT = process.env.PORT || 3000; // Vercel attend généralement le port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Exporter le PORT si nécessaire (utile dans certains cas)
module.exports = PORT;
