import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Simuler une base de données d'utilisateurs en mémoire
let users = [];

// Route pour enregistrer un nouvel utilisateur
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Vérifier si les champs sont bien présents
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Nom d'utilisateur et mot de passe sont requis." });
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "L'utilisateur existe déjà." });
  }

  // Ajouter l'utilisateur à la "base de données" (tableau en mémoire)
  const newUser = { username, password }; // Ici, on stocke le mot de passe en clair pour simplifier, mais ce n'est pas sécurisé
  users.push(newUser);

  res.status(201).json({ message: "Utilisateur créé avec succès." });
});

// Route pour authentifier un utilisateur (pour simplification, une authentification basique)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Trouver l'utilisateur par nom d'utilisateur
  const user = users.find((user) => user.username === username);
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
  }

  res.json({ message: "Connexion réussie." });
});

// Routes protégées - Exemples
app.get("/api/protected", (req, res) => {
  // Exemple de route protégée simple (sans JWT)
  res.json({ message: "Accès autorisé à la route protégée." });
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "projet_perso.html");
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Page principale introuvable.");
  }
  res.sendFile(filePath);
});

// Démarrage du serveur
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur:", error);
  }
};

startServer();
