/**
 * Vercel Serverless Function
 * Bu endpoint Shopier balance bilgisini sunucu tarafindan ceker.
 *
 * Onemli:
 * - Token kod icine yazilmaz.
 * - Token Vercel Environment Variable olarak SHOPIER_API_TOKEN adiyla eklenmelidir.
 */
module.exports = async function handler(req, res) {
  // Sadece GET isteklerini kabul ederek endpoint'i daha kontrollu hale getiriyoruz.
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Sadece GET isteğine izin veriliyor."
    });
  }

  // Token ortama eklenmemisse anlasilir bir hata donuyoruz.
  const token = process.env.SHOPIER_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "SHOPIER_API_TOKEN tanımlı değil."
    });
  }

  try {
    // Shopier API'sine sunucu tarafindan istek atiyoruz.
    const response = await fetch("https://api.shopier.com/v1/balance", {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`
      }
    });

    // Donen veriyi JSON olarak okumaya calisiyoruz.
    const data = await response.json();

    // Shopier tarafindan hata donerse ayni bilgiyi istemciye iletiyoruz.
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Shopier API isteği başarısız oldu.",
        details: data
      });
    }

    // Basarili durumda balance bilgisini JSON olarak geri veriyoruz.
    return res.status(200).json(data);
  } catch (error) {
    // Beklenmeyen hata durumunda genel bir sunucu hatasi mesaji donuyoruz.
    return res.status(500).json({
      error: "Shopier balance bilgisi alınamadı.",
      details: error.message
    });
  }
};
