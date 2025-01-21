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
