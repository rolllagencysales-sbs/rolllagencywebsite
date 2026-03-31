/**
 * Vercel Serverless Function
 * Bu endpoint kullanicidan gelen X TL bilgisini alir, Shopier API uzerinden
 * gecici bir urun olusturmayi dener ve kullaniciyi urun sayfasina yonlendirir.
 *
 * Gerekli environment variable'lar:
 * - SHOPIER_API_TOKEN
 * - SITE_BASE_URL (opsiyonel ama onerilir, ornek: https://www.rolllagency.sbs)
 */
module.exports = async function handler(req, res) {
  // Bu endpoint form verisi alacagi icin yalnizca POST kabul ediyoruz.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Sadece POST isteğine izin veriliyor."
    });
  }

  // Token sunucu tarafinda environment variable olarak tutuluyor.
  const token = process.env.SHOPIER_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "SHOPIER_API_TOKEN tanımlı değil."
    });
  }

  // Formdan gelen verileri guvenli bicimde okuyoruz.
  const amount = Number(req.body?.amount);
  const productName = String(req.body?.product_name || "Özel Ödeme Talebi").trim();
  const currency = String(req.body?.currency || "TRY").trim().toUpperCase();

  // Hatali veya bos tutar girisini erkenden durduruyoruz.
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      error: "Geçerli bir ödeme tutarı gönderilmedi."
    });
  }

  // Urun adini makul uzunlukta tutuyoruz.
  const safeProductName = productName.slice(0, 120) || "Özel Ödeme Talebi";

  // Shopier urun olusturma istegi icin temel payload hazirliyoruz.
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = process.env.SITE_BASE_URL || `${protocol}://${host}`;
  const defaultMediaUrl = `${baseUrl}/assets/service-web.png`;

  const payload = {
    title: safeProductName,
    description: `${safeProductName} için özel ödeme bağlantısı`,
    status: "active",
    customListing: true,
    type: "digital",
    deliveryType: "digital",
    shippingPayer: "sellerPays",
    stockStatus: "inStock",
    stockQuantity: 9999,
    stock: 9999,
    availableStock: 9999,
    inStock: true,
    stockData: {
      stock: 9999,
      quantity: 9999,
      available: 9999,
      availableStock: 9999,
      inStock: true,
      trackQuantity: false,
      continueSellingWhenOutOfStock: true
    },
    quantity: 9999,
    media: [
      {
        type: "image",
        placement: 1,
        title: "Özel Ödeme Görseli",
        url: defaultMediaUrl
      }
    ],
    priceData: {
      currency,
      price: amount.toFixed(2)
    }
  };

  try {
    // Shopier API uzerinden urun olusturmayi deniyoruz.
    const response = await fetch("https://api.shopier.com/v1/products", {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Shopier hata dondururse detayla birlikte istemciye iletiyoruz.
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Shopier ürün oluşturma isteği başarısız oldu.",
        details: data,
        sentPayload: payload
      });
    }

    // Debug modu aciksa ham cevabi gostererek alan isimlerini net goruyoruz.
    if (req.body?.debug === "1" || req.query?.debug === "1") {
      return res.status(200).json({
        message: "Shopier ürün oluşturuldu.",
        data
      });
    }

    // Donen veride olasi urun id veya url alanlarini tarayarak yonlendirme adresi buluyoruz.
    const productId =
      data?.id ||
      data?.data?.id ||
      data?.product?.id ||
      data?.data?.product?.id ||
      null;

    const productUrl =
      data?.url ||
      data?.data?.url ||
      data?.product?.url ||
      data?.data?.product?.url ||
      data?.productUrl ||
      data?.data?.productUrl ||
      data?.permalink ||
      data?.data?.permalink ||
      data?.checkoutUrl ||
      data?.data?.checkoutUrl ||
      null;

    // Url bulunamazsa ham API cevabini gostermek hata ayiklama icin daha faydali olur.
    if (!productUrl) {
      return res.status(200).json({
        message: "Ürün oluşturuldu ancak yönlendirme URL'si bulunamadı.",
        productId,
        data
      });
    }

    // Basarili durumda kullaniciyi olusan Shopier urun sayfasina yonlendiriyoruz.
    return res.redirect(302, productUrl);
  } catch (error) {
    // Beklenmeyen durumlar icin anlasilir bir sunucu hatasi donuyoruz.
    return res.status(500).json({
      error: "Shopier ürün oluşturulamadı.",
      details: error.message
    });
  }
};
