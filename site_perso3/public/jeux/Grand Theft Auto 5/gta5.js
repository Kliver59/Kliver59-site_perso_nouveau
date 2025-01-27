function playMusic() {
  var audio = document.getElementById("background-audio");
  audio.play();
}

function pauseMusic() {
  var audio = document.getElementById("background-audio");
  audio.pause();
}

window.onload = playMusic;

document.querySelector(".menu-toggle").addEventListener("click", () => {
  const navBar = document.querySelector(".Nav-Bar");
  navBar.classList.toggle("open");
});

document.getElementById("play-music").addEventListener("click", () => {
  document.getElementById("background-audio").play();
});

document.getElementById("pause-music").addEventListener("click", () => {
  document.getElementById("background-audio").pause();
});

const audio = document.getElementById("background-audio");
const progress = document.getElementById("music-progress");

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
