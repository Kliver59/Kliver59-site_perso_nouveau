let bulletInterval = null;
let score = 0;
let level = 1;
let gameOver = false;
let enemySpeed = 0.5;
let bulletSpeed = 5;
let gameStarted = false;

let bullets = [];
let enemies = [];

const enemiesPerLevel = {
  1: { rows: 2, cols: 4 },
  2: { rows: 3, cols: 5 },
  3: { rows: 4, cols: 6 },
  4: { rows: 5, cols: 7 },
  5: { rows: 6, cols: 8 },
};

// Sélection des éléments DOM
const canvas = document.getElementById("space-invaders");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const nextLevelButton = document.getElementById("next-level");
const retryButton = document.getElementById("retry-button");
const playButton = document.getElementById("play-button");
const countdownElement = document.getElementById("countdown");

if (
  !canvas ||
  !ctx ||
  !scoreElement ||
  !nextLevelButton ||
  !retryButton ||
  !playButton ||
  !countdownElement
) {
  console.error("Certains éléments HTML manquent. Vérifiez le fichier HTML.");
}

// Images
const playerImage = new Image();
playerImage.src = "/images/mario.png";

const enemyImage = new Image();
enemyImage.src = "/images/zelda.png";

const bulletImage = new Image();
bulletImage.src = "/images/egg.png";

// Joueur
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 70,
  width: 70,
  height: 70,
  speed: 5,
  movingLeft: false,
  movingRight: false,
};

// Création des ennemis
function createEnemies() {
  enemies = [];
  const { rows, cols } = enemiesPerLevel[level];
  const enemyWidth = 40;
  const enemyHeight = 40;
  const enemyPadding = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (enemyWidth + enemyPadding) + 30;
      const y = row * (enemyHeight + enemyPadding) + 30;

      // Assurez-vous que les ennemis commencent en haut
      enemies.push({ x, y, width: enemyWidth, height: enemyHeight });
    }
  }
}

// Dessin des éléments
function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Mise à jour
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) bullets.splice(index, 1);
  });
}

function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.y += enemySpeed;
    if (enemy.y + enemy.height >= canvas.height) {
      gameOver = true;
    }
  });
}

// Collisions
function detectCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 100;
        scoreElement.textContent = `Score : ${score}`;
      }
    });
  });

  if (enemies.length === 0) {
    levelUp();
  }
}

// Gestion des niveaux
function levelUp() {
  // Arrête le jeu après un niveau
  gameStarted = false;

  // Affiche le bouton pour continuer
  nextLevelButton.style.display = "block";

  // Augmente les vitesses et paramètres pour le niveau suivant
  player.speed += 1;
  enemySpeed += 0.5;
  bulletSpeed += 1;

  // Prépare les ennemis pour le niveau suivant mais ne les affiche pas encore
  createEnemies();
}

// Gestion du joueur
function updatePlayerPosition() {
  if (player.movingLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (player.movingRight && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

// Tir
function fireBullet() {
  if (!gameStarted) return; // Ne tire pas si le jeu n'est pas actif

  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: bulletSpeed,
  });
}

// Boucle du jeu
function gameLoop() {
  if (!gameStarted) return; // Arrête la boucle si le jeu n'est pas actif

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    retryButton.style.display = "block";
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();

  updateBullets();
  updateEnemies();
  detectCollisions();
  updatePlayerPosition();

  requestAnimationFrame(gameLoop);
}

// Début du jeu
function startGame() {
  let countdown = 3;
  countdownElement.style.display = "block";
  countdownElement.textContent = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown > 0 ? countdown : "GO!";
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownElement.style.display = "none";
      displayLevel(); // Affiche le niveau actuel
      setTimeout(() => {
        gameStarted = true; // Active le jeu après l'affichage
        createEnemies(); // Crée les ennemis
        gameLoop(); // Démarre le jeu
      }, 2000); // Lance le jeu après 2 secondes
    }
  }, 1000);
}

// Réinitialisation
function resetGame() {
  score = 0;
  level = 1;
  player.speed = 5;
  enemySpeed = 0.5;
  bulletSpeed = 5;
  gameOver = false;
  scoreElement.textContent = `Score : ${score}`;
  retryButton.style.display = "none";
  nextLevelButton.style.display = "none";
  startGame();
}

// Événements
playButton?.addEventListener("click", () => {
  playButton.style.display = "none";
  startGame();
});

nextLevelButton.addEventListener("click", () => {
  nextLevelButton.style.display = "none"; // Cache le bouton
  displayLevel(); // Affiche le numéro du niveau
  setTimeout(() => {
    gameStarted = true; // Active le jeu après l'affichage
    createEnemies(); // Crée les ennemis pour le nouveau niveau
    gameLoop(); // Relance la boucle du jeu
  }, 2000); // Démarre le jeu après 2 secondes
});

retryButton?.addEventListener("click", () => {
  resetGame();
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    player.movingLeft = true;
  } else if (event.code === "ArrowRight") {
    player.movingRight = true;
  } else if (event.code === "Space" && gameStarted) {
    fireBullet();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    player.movingLeft = false;
  } else if (event.code === "ArrowRight") {
    player.movingRight = false;
  }
});

function displayLevel() {
  const levelDisplay = document.getElementById("level-display");
  levelDisplay.textContent = `Level ${level}`;
  levelDisplay.style.display = "block";

  // Cache le texte après 2 secondes
  setTimeout(() => {
    levelDisplay.style.display = "none";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  // Références aux éléments
  const authContainer = document.getElementById("auth-container");
  const registerContainer = document.getElementById("register-container");
  const loginButton = document.getElementById("login-button");
  const registerButton = document.getElementById("register-button");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const newUsernameInput = document.getElementById("new-username");
  const newPasswordInput = document.getElementById("new-password");
  const registerLink = document.getElementById("register-link");
  const loginLink = document.getElementById("login-link");

  // Utilisateur fictif (en attendant d'avoir une base de données)
  const userCredentials = {
    username: "user123",
    password: "password123",
  };

  // Fonction de connexion
  loginButton.addEventListener("click", function () {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (
      username === userCredentials.username &&
      password === userCredentials.password
    ) {
      // Connexion réussie
      alert("Connexion réussie !");
      authContainer.classList.add("hidden");
      // Démarrer le jeu ou afficher le contenu principal
      // Afficher le jeu ici, par exemple, en affichant la section de jeu
    } else {
      alert("Nom d'utilisateur ou mot de passe incorrect.");
    }
  });

  // Fonction d'inscription (exemple basique)
  registerButton.addEventListener("click", function () {
    const newUsername = newUsernameInput.value;
    const newPassword = newPasswordInput.value;

    // Stockage temporaire d'un utilisateur fictif (normalement vous enverriez ceci à un serveur)
    userCredentials.username = newUsername;
    userCredentials.password = newPassword;

    alert("Inscription réussie !");
    // Passer à l'écran de connexion
    registerContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
  });

  // Événements de navigation entre inscription et connexion
  registerLink.addEventListener("click", function () {
    authContainer.classList.add("hidden");
    registerContainer.classList.remove("hidden");
  });

  loginLink.addEventListener("click", function () {
    registerContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
  });
});

fetch("http://localhost:3000/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: usernameInput.value,
    password: passwordInput.value,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.token) {
      // Stocker le token JWT dans le localStorage
      localStorage.setItem("token", data.token);
      console.log("Token reçu:", data.token);
      authContainer.classList.add("hidden"); // Cache le formulaire de connexion
      // Vous pouvez ajouter des actions pour afficher le jeu ou d'autres sections
    } else {
      alert("Identifiants incorrects.");
    }
  })
  .catch((error) => {
    console.error("Erreur d'authentification:", error);
    alert("Une erreur est survenue, veuillez réessayer.");
  });
