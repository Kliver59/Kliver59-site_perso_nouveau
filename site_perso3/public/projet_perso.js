function initializeAuth() {
  const user = localStorage.getItem("user");

  if (user) {
    // Utilisateur déjà connecté
    document.getElementById("auth-container").style.display = "none"; // Masquer le formulaire de connexion
    document.getElementById("game-container").style.display = "block"; // Afficher le jeu
    document.getElementById("auth-header").innerText = `Bienvenue ${user}`;
    document.getElementById("logout-button").style.display = "inline-block"; // Afficher le bouton de déconnexion

    // Afficher l'avatar et le nom
    document.getElementById("user-avatar-section").style.display = "block";
    document.getElementById("user-name").innerText = user;

    // Récupérer l'avatar spécifique de l'utilisateur
    const avatar = localStorage.getItem(user + "-avatar");
    if (avatar) {
      document.getElementById("user-avatar").src = avatar;
    } else {
      document.getElementById("user-avatar").src = "/images/assassins2.png"; // Avatar par défaut
    }

    // Afficher le tableau des scores (initialement caché)
    document.getElementById("score-container").style.display = "block";
  } else {
    // Utilisateur non connecté
    document.getElementById("auth-container").style.display = "block"; // Afficher le formulaire de connexion
    document.getElementById("game-container").style.display = "none"; // Masquer le jeu
    document.getElementById("auth-header").innerText = "Connectez-vous";
    document.getElementById("logout-button").style.display = "none"; // Masquer le bouton de déconnexion
    document.getElementById("user-avatar-section").style.display = "none"; // Masquer la section de l'avatar
    document.getElementById("user-name").innerText = ""; // Masquer le nom de l'utilisateur
    document.getElementById("user-avatar").src = ""; // Réinitialiser l'avatar

    // Masquer le tableau des scores
    document.getElementById("score-container").style.display = "none";
  }
}

// Connexion de l'utilisateur
document
  .getElementById("auth-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    // Vérifier si les champs sont remplis
    if (username && password) {
      localStorage.setItem("user", username); // Enregistrer l'utilisateur dans le localStorage
      document.getElementById("auth-container").style.display = "none"; // Masquer le formulaire de connexion
      document.getElementById("game-container").style.display = "block"; // Afficher le jeu
      document.getElementById("auth-header").innerText =
        `Bienvenue ${username}`;
      document.getElementById("logout-button").style.display = "inline-block"; // Afficher le bouton de déconnexion

      // Afficher l'avatar et le nom
      document.getElementById("user-avatar-section").style.display = "block";
      document.getElementById("user-name").innerText = username;

      // Récupérer l'avatar spécifique de l'utilisateur
      const avatar = localStorage.getItem(username + "-avatar");
      if (avatar) {
        document.getElementById("user-avatar").src = avatar;
      } else {
        document.getElementById("user-avatar").src = "/images/assassins2.png"; // Avatar par défaut
      }

      // Afficher le tableau des scores
      document.getElementById("score-container").style.display = "block";
    } else {
      document.getElementById("auth-message").innerText =
        "Nom d'utilisateur ou mot de passe incorrect.";
    }
  });

// Déconnexion de l'utilisateur
document.getElementById("logout-button").addEventListener("click", function () {
  localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
  localStorage.removeItem("avatar"); // Supprimer l'avatar global du localStorage
  localStorage.removeItem(
    document.getElementById("user-name").innerText + "-avatar"
  ); // Supprimer l'avatar spécifique de l'utilisateur

  document.getElementById("auth-container").style.display = "block"; // Afficher le formulaire de connexion
  document.getElementById("game-container").style.display = "none"; // Masquer le jeu
  document.getElementById("auth-header").innerText = "Connectez-vous";
  document.getElementById("logout-button").style.display = "none"; // Masquer le bouton de déconnexion
  document.getElementById("user-avatar-section").style.display = "none"; // Masquer la section de l'avatar
  document.getElementById("user-name").innerText = ""; // Masquer le nom de l'utilisateur
  document.getElementById("user-avatar").src = ""; // Réinitialiser l'avatar

  // Masquer le tableau des scores
  document.getElementById("score-container").style.display = "none";
});

// Gérer le téléchargement de l'avatar
document
  .getElementById("avatar-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const avatarUrl = e.target.result;
        const user = localStorage.getItem("user");

        if (user) {
          localStorage.setItem(user + "-avatar", avatarUrl); // Enregistrer l'avatar avec le nom d'utilisateur comme clé
          document.getElementById("user-avatar").src = avatarUrl; // Afficher l'avatar téléchargé
        }
      };
      reader.readAsDataURL(file);
    }
  });

// Code exécuté lors du chargement de la page
window.onload = function () {
  initializeAuth();
};

// Partie Jeu : Initialisation et logiques de jeu

let canvas = document.getElementById("space-invaders");
let ctx = canvas.getContext("2d");

let gameActive = false;
let player = {
  x: 300,
  y: 350,
  width: 50,
  height: 50,
  color: "#00FF00",
  speed: 5,
  dx: 0,
};
let invaders = [];
let bullets = [];
let score = 0;
let level = 1;
let countdownTimer;

const playButton = document.getElementById("play-button");
const nextLevelButton = document.getElementById("next-level");
const retryButton = document.getElementById("retry-button");
const countdownElement = document.getElementById("countdown");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score");
const gameContainer = document.getElementById("game-container");

function startGame() {
  score = 0;
  level = 1;
  gameActive = true;
  player.x = canvas.width / 2 - player.width / 2;
  bullets = [];
  invaders = [];
  createInvaders();
  playButton.classList.add("hidden");
  retryButton.classList.add("hidden");
  countdownElement.classList.remove("hidden");
  countdownElement.textContent = 3;
  let countdownValue = 3;
  countdownTimer = setInterval(() => {
    countdownValue--;
    countdownElement.textContent = countdownValue;
    if (countdownValue <= 0) {
      clearInterval(countdownTimer);
      countdownElement.classList.add("hidden");
      gameLoop();
    }
  }, 1000);
}

function createInvaders() {
  let rows = 5;
  let cols = 10;
  let invaderWidth = 40;
  let invaderHeight = 40;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      invaders.push({
        x: col * (invaderWidth + 10) + 50,
        y: row * (invaderHeight + 10) + 50,
        width: invaderWidth,
        height: invaderHeight,
        color: "#FF6347",
      });
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawInvaders() {
  for (let invader of invaders) {
    ctx.fillStyle = invader.color;
    ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
  }
}

function drawBullets() {
  for (let bullet of bullets) {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function movePlayer() {
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

function shootBullet() {
  let bullet = {
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 5,
  };
  bullets.push(bullet);
}

function moveBullets() {
  for (let bullet of bullets) {
    bullet.y -= bullet.speed;
  }
  bullets = bullets.filter((bullet) => bullet.y > 0);
}

function checkCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    for (let j = 0; j < invaders.length; j++) {
      let invader = invaders[j];
      if (
        bullet.x < invader.x + invader.width &&
        bullet.x + bullet.width > invader.x &&
        bullet.y < invader.y + invader.height &&
        bullet.y + bullet.height > invader.y
      ) {
        invaders.splice(j, 1);
        bullets.splice(i, 1);
        score += 10;
        scoreDisplay.textContent = `Score : ${score}`;
        break;
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawInvaders();
  drawBullets();
  movePlayer();
  moveBullets();
  checkCollisions();
  if (invaders.length === 0) {
    levelUp();
  }
  if (gameActive) {
    requestAnimationFrame(gameLoop);
  }
}

function levelUp() {
  level++;
  levelDisplay.classList.remove("hidden");
  levelDisplay.textContent = `Niveau ${level}`;
  invaders = [];
  createInvaders();
  nextLevelButton.classList.remove("hidden");
}

playButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
nextLevelButton.addEventListener("click", levelUp);

// Contrôles du joueur
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === " ") shootBullet();
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});
