const ADMIN_PASSWORD = "220245489";

const openLoginButton = document.getElementById("openLoginButton");
const closeLoginButton = document.getElementById("closeLoginButton");
const logoutButton = document.getElementById("logoutButton");
const loginModal = document.getElementById("loginModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");
const comingSoonPanel = document.getElementById("comingSoonPanel");

function showModal() {
  loginModal.classList.remove("hidden");
  loginModal.setAttribute("aria-hidden", "false");
  errorMessage.classList.add("hidden");
  passwordInput.value = "";
  passwordInput.focus();
}

function hideModal() {
  loginModal.classList.add("hidden");
  loginModal.setAttribute("aria-hidden", "true");
}

function unlockAdmin() {
  sessionStorage.setItem("rolll-admin-auth", "true");
  window.location.href = "home.html";
}

openLoginButton.addEventListener("click", showModal);
closeLoginButton.addEventListener("click", hideModal);
modalBackdrop.addEventListener("click", hideModal);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === ADMIN_PASSWORD) {
    unlockAdmin();
    return;
  }

  errorMessage.classList.remove("hidden");
  passwordInput.select();
});

if (sessionStorage.getItem("rolll-admin-auth") === "true") {
  window.location.href = "home.html";
}
