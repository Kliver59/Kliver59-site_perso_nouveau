function playMusic() {
  var audio = document.getElementById("background-audio");
  audio.play();
}

// Démarre la musique lorsque la page est chargée
window.onload = playMusic;

document.querySelector(".menu-toggle").addEventListener("click", () => {
  const navBar = document.querySelector(".Nav-Bar");
  navBar.classList.toggle("open");
});

const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".carousel-item");
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");
const iframes = document.querySelectorAll(".carousel-video");

let currentIndex = 0;

// Fonction pour afficher la vidéo active
function updateCarousel(index) {
  items.forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });

  // Mettre toutes les vidéos en pause
  iframes.forEach((iframe) => {
    const iframeSrc = iframe.src;
    iframe.src = ""; // Réinitialise la vidéo pour la mettre sur pause
    iframe.src = iframeSrc; // Recharge la vidéo
  });
}

// Événements pour les boutons
prevButton.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel(currentIndex);
});

nextButton.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel(currentIndex);
});

// Initialisation
updateCarousel(currentIndex);
