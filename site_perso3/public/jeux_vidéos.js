function playMusic() {
  var audio = document.getElementById("background-audio");
  audio.play();
}

// Démarre la musique lorsque la page est chargée
window.onload = playMusic;

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
