/**
 * Vercel Serverless Function
 * Bu fonksiyon /api/hello istegine JSON formatinda cevap doner.
 */
module.exports = function handler(req, res) {
  // Istenen veri JSON olacagi icin cevap basligini buna uygun ayarliyoruz.
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // Basit bir basari durumu ve mesaj donuyoruz.
  res.status(200).json({
    message: "Merhaba, Node.js fonksiyonu çalışıyor!"
  });
};
