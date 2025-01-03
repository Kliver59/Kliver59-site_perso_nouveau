document.addEventListener("DOMContentLoaded", () => {
  const registerSection = document.getElementById("register-section");
  const loginSection = document.getElementById("login-section");
  const switchToLogin = document.getElementById("switch-to-login");
  const switchToRegister = document.getElementById("switch-to-register");

  // Changer entre inscription et connexion
  switchToLogin.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });

  switchToRegister.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
  });

  // Inscription
  document
    .getElementById("register-button")
    .addEventListener("click", async () => {
      const username = document.getElementById("register-username").value;
      const password = document.getElementById("register-password").value;

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          switchToLogin.click();
        }
      } catch (error) {
        alert("Erreur lors de l'inscription : " + error.message);
      }
    });

  // Connexion
  document
    .getElementById("login-button")
    .addEventListener("click", async () => {
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "/"; // Redirige vers la page principale
        }
      } catch (error) {
        alert("Erreur lors de la connexion : " + error.message);
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Veuillez vous connecter pour accéder à cette page.");
    window.location.href = "/auth"; // Redirige vers une page d'authentification
  }
});
