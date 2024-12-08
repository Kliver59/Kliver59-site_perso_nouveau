document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les données du formulaire
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Vérification de la validité de l'email
    if (!validateEmail(email)) {
      displayMessage("Veuillez entrer un email valide.", "error");
      return;
    }

    // Créer un objet avec les données
    const formData = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    // Envoyer les données via fetch (simuler une API ou enregistrer localement)
    fetch("/projet_perso3/contact_form_handler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Si tout va bien
        } else {
          throw new Error("Un problème est survenu lors de l'envoi.");
        }
      })
      .then((data) => {
        displayMessage("Votre message a bien été envoyé !", "success");
        document.getElementById("contact-form").reset(); // Réinitialise le formulaire
      })
      .catch((error) => {
        displayMessage(error.message, "error");
      });
  });

// Fonction pour valider l'email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Fonction pour afficher les messages (succès ou erreur)
function displayMessage(message, type) {
  const messageContainer = document.getElementById("form-message");
  messageContainer.innerHTML = message;
  messageContainer.className = "form-message " + type;

  // Supprime le message après 5 secondes
  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 5000);
}
