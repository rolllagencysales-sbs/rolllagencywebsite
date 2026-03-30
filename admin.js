const isAuthed = sessionStorage.getItem("rolll-admin-auth") === "true";
const logoutButton = document.getElementById("logoutButton");
const requiresAuth = document.body?.dataset?.protected === "true";

if (requiresAuth && !isAuthed) {
  window.location.href = "index.html";
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("rolll-admin-auth");
    window.location.href = "index.html";
  });
}

const revealTargets = [
  ...document.querySelectorAll(".section-heading"),
  ...document.querySelectorAll(".service-card"),
  ...document.querySelectorAll(".product-card"),
  ...document.querySelectorAll(".contact-card"),
  ...document.querySelectorAll(".about-row")
];

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: [0, 0.15, 0.28, 0.42],
      rootMargin: "0px 0px -12% 0px"
    }
  );

  revealTargets.forEach((element) => observer.observe(element));
}
