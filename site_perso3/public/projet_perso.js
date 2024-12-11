let bulletInterval = null;
let score = 0;
let level = 1;
let gameOver = false;
let enemySpeed = 0.5;
let bulletSpeed = 5;
let enemiesPerLevel = {
  1: { rows: 2, cols: 4 }, // Niveau très facile
  2: { rows: 3, cols: 5 }, // Niveau facile
  3: { rows: 4, cols: 6 }, // Niveau normal
  4: { rows: 5, cols: 7 }, // Niveau difficile
  5: { rows: 6, cols: 8 }, // Niveau très difficile
  6: { rows: 7, cols: 9 }, // Niveau extrême
};

const canvas = document.getElementById("space-invaders");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const nextLevelButton = document.getElementById("next-level");

// Charger les images
const playerImage = new Image();
playerImage.src = "/images/mario.png"; // Remplacez par le chemin correct vers votre image du joueur

const enemyImage = new Image();
enemyImage.src = "/images/zelda.png"; // Remplacez par le chemin correct vers votre image d'ennemi

const bulletImage = new Image();
bulletImage.src = "/images/egg.png"; // Remplacez par le chemin correct vers votre image de balle

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 70,
  width: 70, // Dimensions ajustées pour l'image
  height: 70, // Dimensions ajustées pour l'image
  speed: 5,
};

let bullets = [];
let enemies = [];

function createEnemies() {
  enemies = [];
  const { rows, cols } = enemiesPerLevel[level];
  const enemyWidth = 40;
  const enemyHeight = 40;
  const enemyPadding = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: col * (enemyWidth + enemyPadding) + 30,
        y: row * (enemyHeight + enemyPadding) + 30,
        width: enemyWidth,
        height: enemyHeight,
      });
    }
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height); // Utiliser l'image pour le joueur
}

function drawBullets() {
  bullets.forEach((bullet) => {
    // Remplacez le dessin de la balle par l'image de la balle
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height); // Utiliser l'image pour la balle
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height); // Utiliser l'image pour les ennemis
  });
}

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
        score += 10;
        scoreElement.textContent = `Score : ${score}`;
      }
    });
  });
}

function levelUp() {
  if (enemies.length === 0) {
    nextLevelButton.style.display = "block"; // Affiche le bouton à la fin du niveau
  }
}

function gameLoop() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 50, canvas.height / 2);
    alert(`Game Over! Votre score : ${score}`);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  updateBullets();
  updateEnemies();
  detectCollisions();
  levelUp(); // Vérifie si le joueur a gagné le niveau
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
  if (e.key === "ArrowRight" && player.x + player.width < canvas.width)
    player.x += player.speed;

  if (e.key === " " && !gameOver) {
    if (!bulletInterval) {
      bulletInterval = setInterval(() => {
        bullets.push({
          x: player.x + player.width / 2 - 2.5,
          y: player.y,
          width: 15,
          height: 20,
          speed: bulletSpeed,
        });
      }, 100);
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === " " && !gameOver) {
    clearInterval(bulletInterval);
    bulletInterval = null;
  }
});

// Le bouton "Niveau suivant"
nextLevelButton.addEventListener("click", () => {
  nextLevelButton.style.display = "none"; // Cache le bouton après le clic
  level++; // Passe au niveau suivant
  if (level > 6) level = 6; // Limite les niveaux à 6
  enemySpeed += 0.5; // Augmente la vitesse des ennemis à chaque niveau
  bulletSpeed += 1; // Augmente la vitesse des balles à chaque niveau
  createEnemies(); // Crée les ennemis pour le nouveau niveau
  gameLoop(); // Démarre le niveau
});

// Démarre le premier niveau lorsque la page est chargée
window.addEventListener("DOMContentLoaded", () => {
  createEnemies();
  gameLoop();
});
