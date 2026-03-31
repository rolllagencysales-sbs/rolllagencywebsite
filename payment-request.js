// Bu script serbest tutar formunu Node.js serverless endpoint'ine gonderir.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dynamicPaymentForm");

  // Form bulunamazsa bosuna devam etmiyoruz.
  if (!form) {
    return;
  }

  // Form hedefini mevcut domain altindaki API endpoint'ine ayarliyoruz.
  form.method = "POST";
  form.action = "/api/create-payment";

  // URL'de debug=1 varsa endpoint Shopier'in ham cevabini gosterecek.
  const debugInput = form.elements.namedItem("debug");
  const searchParams = new URLSearchParams(window.location.search);
  if (debugInput && searchParams.get("debug") === "1") {
    debugInput.value = "1";
  }

  // Basit istemci tarafi dogrulama ile sifirin altindaki veya bos tutarlari engelliyoruz.
  form.addEventListener("submit", (event) => {
    const amountInput = form.elements.namedItem("amount");
    const amountValue = Number(amountInput.value);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      event.preventDefault();
      window.alert("Lütfen geçerli bir tutar gir.");
    }
  });
});
