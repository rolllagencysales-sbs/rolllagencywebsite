/**
 * Vercel Serverless Function
 * Bu endpoint kullanicidan gelen tutar bilgisini alir ve Shopier odeme formunu
 * sunucu tarafinda olusturarak kullaniciyi odeme ekranina yonlendirir.
 *
 * Gerekli environment variable'lar:
 * - SHOPIER_MERCHANT_ID
 * - SITE_BASE_URL (opsiyonel ama onerilir, ornek: https://www.rolllagency.sbs)
 */
module.exports = async function handler(req, res) {
  // Sadece POST istegine izin veriyoruz cunku kullanici form gonderecek.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Sadece POST isteğine izin veriliyor."
    });
  }

  // Merchant ID odeme formunun temel parcasidir; sunucu tarafinda tutulur.
  const merchantId = process.env.SHOPIER_MERCHANT_ID;

  if (!merchantId) {
    return res.status(500).json({
      error: "SHOPIER_MERCHANT_ID tanımlı değil."
    });
  }

  // Gelen verileri okuyup guvenli hale getiriyoruz.
  const amount = Number(req.body?.amount);
  const productName = String(req.body?.product_name || "Özel Ödeme Talebi").trim();
  const currency = String(req.body?.currency || "TRY").trim().toUpperCase();

  // Tutarin gecerli bir sayi oldugunu kontrol ediyoruz.
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      error: "Geçerli bir ödeme tutarı gönderilmedi."
    });
  }

  // Baslik alanini asiri uzatmamak icin makul bir uzunlukta sinirliyoruz.
  const safeProductName = productName.slice(0, 120) || "Özel Ödeme Talebi";

  // Donus adreslerini env'den ya da mevcut domain bilgisinden olusturuyoruz.
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = process.env.SITE_BASE_URL || `${protocol}://${host}`;
  const successUrl = `${baseUrl}/success.html`;
  const failUrl = `${baseUrl}/fail.html`;

  // Shopier'e gidecek alanlari bir map olarak hazirliyoruz.
  const fields = {
    merchant_id: merchantId,
    product_name: safeProductName,
    price: amount.toFixed(2),
    currency,
    success_url: successUrl,
    fail_url: failUrl
  };

  // HTML injection riskini azaltmak icin basit kacis islemi uyguluyoruz.
  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // Shopier formunu otomatik gonderecek gecis sayfasini olusturuyoruz.
  const formInputs = Object.entries(fields)
    .map(
      ([name, value]) =>
        `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rolll Agency | Ödeme Yönlendiriliyor</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        font-family: Manrope, Arial, sans-serif;
        color: #e5e5e5;
        background: linear-gradient(180deg, #142437 0%, #0d1b2a 58%, #09131d 100%);
      }
      .card {
        width: min(100%, 560px);
        padding: 32px 24px;
        border-radius: 24px;
        background: rgba(13, 27, 42, 0.96);
        border: 1px solid rgba(229, 229, 229, 0.08);
        box-shadow: 0 24px 70px rgba(4, 10, 18, 0.42);
        text-align: center;
      }
      h1 {
        margin: 0 0 12px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(2rem, 5vw, 3.2rem);
      }
      p {
        margin: 0;
        line-height: 1.8;
        color: rgba(229, 229, 229, 0.76);
      }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Ödeme sayfasına yönlendiriliyorsunuz</h1>
      <p>Lütfen bekleyin. Eğer yönlendirme otomatik olmazsa sayfayı yenileyin.</p>
      <form id="shopierPaymentForm" method="POST" action="https://www.shopier.com/ShowProductNew/payment.php">
        ${formInputs}
      </form>
    </main>
    <script>
      document.getElementById("shopierPaymentForm").submit();
    </script>
  </body>
</html>`;

  // HTML yaniti donerek tarayicinin formu gondermesini sagliyoruz.
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
};
