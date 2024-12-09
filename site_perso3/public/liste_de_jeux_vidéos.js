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
  const noResultsMessageContainer = document.createElement("div");
  noResultsMessageContainer.style.display = "none"; // Par défaut, cacher le message et le personnage
  noResultsMessageContainer.style.textAlign = "center";
  noResultsMessageContainer.style.marginTop = "20px"; // Ajouter un peu d'espace au-dessus
  noResultsMessageContainer.style.fontSize = "1.2em";
  noResultsMessageContainer.style.color = "#555";

  const noResultsMessage = document.createElement("p");
  noResultsMessage.textContent =
    "Cette carte est indisponible mais Félix part à sa recherche.";
  noResultsMessageContainer.appendChild(noResultsMessage);

  // Ajouter un personnage animé à côté du message
  const walkingCharacter = document.createElement("div");
  walkingCharacter.classList.add("walking-character");
  walkingCharacter.style.width = "500px"; // Largeur du personnage
  walkingCharacter.style.height = "500px"; // Hauteur du personnage
  walkingCharacter.style.backgroundImage = "url('/images/cat3.gif')"; // Remplacer par l'image du personnage
  walkingCharacter.style.backgroundSize = "contain";
  walkingCharacter.style.backgroundRepeat = "no-repeat";
  walkingCharacter.style.position = "relative"; // Pour qu'il soit à côté du texte
  noResultsMessageContainer.appendChild(walkingCharacter);

  // Ajouter le conteneur du message et du personnage à la liste
  listContainer.appendChild(noResultsMessageContainer);

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

    // Afficher ou masquer le message et le personnage
    if (hasResults) {
      noResultsMessageContainer.style.display = "none"; // Masquer le message et le personnage
    } else {
      noResultsMessageContainer.style.display = "block"; // Afficher le message et le personnage
    }
  };

  // Écouter les saisies dans la barre de recherche
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    filterCards(searchTerm);
    showWalkingCharacter(); // Lancer l'animation du personnage
  });
});
