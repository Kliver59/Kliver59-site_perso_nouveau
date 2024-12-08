function playMusic() {
  var audio = document.getElementById("background-audio");
  audio.play();
}

// Démarre la musique lorsque la page est chargée
window.onload = function () {
  document.getElementById("background-audio").play();
};

// Sélectionner tous les liens avec la classe 'audio-link'
const audioLinks = document.querySelectorAll(".audio-link");
const hoverAudio = document.getElementById("hover-audio");

audioLinks.forEach((link) => {
  // Ajouter un événement de survol pour chaque lien
  link.addEventListener("mouseenter", function () {
    const audioSrc = link.getAttribute("data-hover-audio"); // Récupérer la source audio
    hoverAudio.src = audioSrc; // Mettre à jour la source de l'audio hover
    hoverAudio.currentTime = 0; // Réinitialiser le temps de lecture
    hoverAudio.play(); // Jouer l'audio
  });

  // Ajouter un événement de sortie pour chaque lien
  link.addEventListener("mouseleave", function () {
    hoverAudio.pause(); // Arrêter l'audio
    hoverAudio.currentTime = 0; // Réinitialiser le temps de lecture
  });
});

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseover", function () {
    const video = this.querySelector(".hover-video");
    if (video) {
      video.play();
    }
  });

  card.addEventListener("mouseout", function () {
    const video = this.querySelector(".hover-video");
    if (video) {
      video.pause();
    }
  });
});
