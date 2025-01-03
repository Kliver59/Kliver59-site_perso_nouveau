import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Secret pour les tokens JWT
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("La variable d'environnement JWT_SECRET est manquante.");
}

// Fichier pour stocker les utilisateurs
const USERS_FILE = path.join(__dirname, "users.json");

// Chargement des utilisateurs (ou création d'un fichier vide si nécessaire)
const loadUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
    return [];
  }
};

// Sauvegarde des utilisateurs dans le fichier
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des utilisateurs:", error);
  }
};

// Validation des entrées utilisateur
const validateInput = (username, password) => {
  if (!username || !password) {
    return {
      valid: false,
      message: "Nom d'utilisateur et mot de passe requis.",
    };
  }
  if (username.length < 3) {
    return { valid: false, message: "Nom d'utilisateur trop court." };
  }
  if (password.length < 6) {
    return {
      valid: false,
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    };
  }
  return { valid: true };
};

// Inscription
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { valid, message } = validateInput(username, password);

    if (!valid) {
      return res.status(400).json({ message });
    }

    const users = loadUsers();
    const userExists = users.find((user) => user.username === username);

    if (userExists) {
      return res
        .status(409)
        .json({ message: "Nom d'utilisateur déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    saveUsers(users);

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

// Connexion
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { valid, message } = validateInput(username, password);

    if (!valid) {
      return res.status(400).json({ message });
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
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
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
  res.json({ message: "Accès autorisé." });
});

// Route principale
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "projet_perso.html");
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Page principale introuvable.");
  }
  res.sendFile(filePath);
});

// Démarrer le serveur
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
