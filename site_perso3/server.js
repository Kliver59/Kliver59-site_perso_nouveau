import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Liste des scores
let scores = [];

// Routes pour servir le jeu
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "projet_perso.html"));
});

// Route pour enregistrer un score
app.post("/api/score", (req, res) => {
  const { player, score } = req.body;
  if (player && score !== undefined) {
    scores.push({ player, score });
    res.json({ message: "Score enregistré avec succès" });
  } else {
    res.status(400).json({ message: "Nom du joueur et score requis" });
  }
});

// Route pour récupérer tous les scores
app.get("/api/scores", (req, res) => {
  res.json(scores.sort((a, b) => b.score - a.score)); // Classement par score décroissant
});

// Démarrer le serveur
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
