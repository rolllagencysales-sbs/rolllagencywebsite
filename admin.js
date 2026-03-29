const isAuthed = sessionStorage.getItem("rolll-admin-auth") === "true";
const logoutButton = document.getElementById("logoutButton");

if (!isAuthed) {
  window.location.href = "index.html";
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("rolll-admin-auth");
    window.location.href = "index.html";
  });
}
