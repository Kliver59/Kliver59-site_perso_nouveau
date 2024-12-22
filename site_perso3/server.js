import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Secret pour les tokens JWT
const JWT_SECRET = "votre_secret_ultra_secure"; // Changez cela en production

// Fichier pour stocker les utilisateurs
const USERS_FILE = path.join(__dirname, "users.json");

// Chargement des utilisateurs (ou création d'un fichier vide)
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Inscription
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Nom d'utilisateur et mot de passe requis." });
  }

  const users = loadUsers();
  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Nom d'utilisateur déjà utilisé." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  saveUsers(users);

  res.status(201).json({ message: "Utilisateur créé avec succès." });
});

// Connexion
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Nom d'utilisateur et mot de passe requis." });
  }

  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Connexion réussie.", token });
});

// Middleware pour protéger les routes
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide." });
    }
    req.user = user;
    next();
  });
};

// Exemple de route protégée
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.username}!` });
});

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "projet_perso.html"));
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
