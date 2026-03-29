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
const adminPanel = document.getElementById("adminPanel");

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
  hideModal();
  comingSoonPanel.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  sessionStorage.setItem("rolll-admin-auth", "true");
}

function logoutAdmin() {
  sessionStorage.removeItem("rolll-admin-auth");
  adminPanel.classList.add("hidden");
  comingSoonPanel.classList.remove("hidden");
}

openLoginButton.addEventListener("click", showModal);
closeLoginButton.addEventListener("click", hideModal);
modalBackdrop.addEventListener("click", hideModal);
logoutButton.addEventListener("click", logoutAdmin);

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
  comingSoonPanel.classList.add("hidden");
  adminPanel.classList.remove("hidden");
}
