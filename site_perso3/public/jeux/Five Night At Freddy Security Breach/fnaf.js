function playMusic() {
  var audio = document.getElementById("background-audio");
  audio.play();
}

// Démarre la musique de fond lorsque la page est chargée
window.onload = playMusic;

// Sélectionner tous les liens avec la classe 'audio-link'
const audioLinks = document.querySelectorAll(".audio-link");
const hoverAudio = new Audio(); // Créer un objet audio pour gérer les sons de survol

audioLinks.forEach((link) => {
  // Ajouter un événement de survol pour chaque lien
  link.addEventListener("mouseenter", function () {
    const audioSrc = link.getAttribute("data-hover-audio"); // Récupérer la source audio
    if (audioSrc) {
      hoverAudio.src = audioSrc; // Mettre à jour la source de l'audio hover
      hoverAudio.currentTime = 0; // Réinitialiser le temps de lecture
      hoverAudio.play(); // Jouer l'audio
    }
  });

  // Ajouter un événement de sortie pour chaque lien
  link.addEventListener("mouseleave", function () {
    hoverAudio.pause(); // Arrêter l'audio
    hoverAudio.currentTime = 0; // Réinitialiser le temps de lecture
  });
});

// Gestion des vidéos sur les cartes (si présentes)
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseover", function () {
    const video = this.querySelector(".hover-video");
    if (video) {
      video.play(); // Lire la vidéo au survol
    }
  });

  card.addEventListener("mouseout", function () {
    const video = this.querySelector(".hover-video");
    if (video) {
      video.pause(); // Arrêter la vidéo à la sortie du survol
    }
  });
});
