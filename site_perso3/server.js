import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Détermine le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Utilisation de __dirname pour accéder aux fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Données de quiz
const questions = [
  {
    question:
      "Quel personnage est le protagoniste principal de 'The Legend of Zelda' ?",
    options: ["Link", "Mario", "Samus"],
    correctAnswer: "A",
  },
  {
    question:
      "Dans quel jeu vidéo trouve-t-on la célèbre phrase 'It's-a me, Mario!' ?",
    options: ["Mario Bros", "Sonic", "Zelda"],
    correctAnswer: "A",
  },
  {
    question: "Quel est le nom du monde dans 'Minecraft' ?",
    options: ["The End", "Nether", "Overworld"],
    correctAnswer: "C",
  },
  {
    question:
      "Dans quel jeu vidéo doit-on affronter des zombies et des créatures horribles dans un manoir ?",
    options: ["Resident Evil", "Dead Space", "Halo"],
    correctAnswer: "A",
  },
];

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "projet_perso.html"));
});

// Route pour obtenir les questions du quiz
app.get("/api/questions", (req, res) => {
  res.json(questions);
});

// Route pour soumettre le score
app.post("/api/score", (req, res) => {
  const { score } = req.body;
  console.log(`Le score soumis est : ${score}`);
  res.json({ message: "Score enregistré avec succès" });
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

startServer(); // Lancer le serveur
