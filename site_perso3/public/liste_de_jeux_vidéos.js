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

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-bar input");
  const cards = document.querySelectorAll(".card");
  const listContainer = document.querySelector(".list");

  if (!searchInput || cards.length === 0) {
    console.error("Barre de recherche ou cartes introuvables !");
    return;
  }

  // Ajouter un message pour aucune correspondance
  const noResultsMessage = document.createElement("p");
  noResultsMessage.textContent = "Aucun résultat trouvé.";
  noResultsMessage.style.textAlign = "center";
  noResultsMessage.style.display = "none";
  noResultsMessage.style.fontSize = "1.2em";
  noResultsMessage.style.color = "#555";
  listContainer.appendChild(noResultsMessage);

  // Fonction pour filtrer les cartes
  const filterCards = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let hasResults = false;

    cards.forEach((card) => {
      const titleElement = card.querySelector("h3");
      if (!titleElement) {
        console.warn("Carte sans titre détectée !");
        card.style.display = "none";
        return;
      }

      const title = titleElement.textContent.toLowerCase();
      if (title.includes(lowerCaseSearchTerm)) {
        card.style.display = "block";
        hasResults = true;
      } else {
        card.style.display = "none";
      }
    });

    // Afficher ou masquer le message "Aucun résultat"
    if (hasResults) {
      noResultsMessage.style.display = "none";
    } else {
      noResultsMessage.style.display = "block";
    }
  };

  // Écouter les saisies dans la barre de recherche
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    filterCards(searchTerm);
  });
});
