window.addEventListener("load", function () {
  document.getElementById("loader").style.display = "flex"; // Afficher le loader

  // Cacher le loader lorsque le contenu est chargé
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1500); // Vous pouvez ajuster ce délai si nécessaire
});

// Ajouter un écouteur d'événements pour chaque changement de page
window.addEventListener("beforeunload", function () {
  document.getElementById("loader").style.display = "flex"; // Afficher le loader avant de quitter la page
});
