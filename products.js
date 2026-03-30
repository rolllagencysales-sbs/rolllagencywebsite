// Shopier entegrasyonu icin temel ayarlar burada tutuluyor.
// Asagidaki merchantId ve gerekiyorsa actionUrl degerini kendi Shopier hesabiniza gore guncelleyin.
const SHOPIER_CONFIG = {
  merchantId: "YOUR_MERCHANT_ID",
  actionUrl: "https://www.shopier.com/ShowProductNew/payment.php",
  currency: "TRY"
};

// En az bir urun gostermek icin ornek urunleri dizi olarak tanimliyoruz.
// Isterseniz bu listeye yeni urunler ekleyebilirsiniz.
const PRODUCTS = [
  {
    id: "web-paket-basic",
    name: "Web Tasarım Başlangıç Paketi",
    description:
      "Kurumsal tanıtım odaklı, mobil uyumlu ve hızlı yayına alınabilen başlangıç seviye web sitesi paketi.",
    price: 7500,
    badge: "En Çok Tercih Edilen"
  },
  {
    id: "brand-identity-pro",
    name: "Marka Kimliği Pro Paketi",
    description:
      "Logo yönü, kartvizit, yazışma dokümanları ve temel marka görünümünü kapsayan profesyonel kurumsal kimlik paketi.",
    price: 5500,
    badge: "Kurumsal Çözüm"
  }
];

// Para formatini kullaniciya daha okunur gostermek icin yardimci fonksiyon kullaniyoruz.
function formatPrice(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: SHOPIER_CONFIG.currency
  }).format(price);
}

// Basari ve hata sayfalarinin mutlak URL'lerini mevcut sayfanin konumundan turetiyoruz.
function buildReturnUrl(fileName) {
  return new URL(fileName, window.location.href).href;
}

// Her urun icin Shopier'e POST edecek formu ve gorunur kart yapisini olusturuyoruz.
function createProductCard(product) {
  // Kart dis kapsayicisi kullaniciya urunu acik sekilde sunar.
  const article = document.createElement("article");
  article.className = "product-card";

  // Rozet, urunun one cikan bilgisini verir.
  const badge = document.createElement("p");
  badge.className = "product-card__badge";
  badge.textContent = product.badge;

  // Baslik urun adini gosterir.
  const title = document.createElement("h3");
  title.textContent = product.name;

  // Aciklama urunun ne sundugunu kisa ve net anlatir.
  const description = document.createElement("p");
  description.className = "product-card__description";
  description.textContent = product.description;

  // Fiyat alani odeme oncesinde net bir fiyat gostermek icin kullanilir.
  const price = document.createElement("p");
  price.className = "product-card__price";
  price.textContent = formatPrice(product.price);

  // Form, Shopier'e POST gonderecek ana yapidir.
  const form = document.createElement("form");
  form.className = "product-card__form";
  form.method = "POST";
  form.action = SHOPIER_CONFIG.actionUrl;

  // Istek gonderilecek alanlari tek tek tanimliyoruz.
  const hiddenFields = [
    { name: "merchant_id", value: SHOPIER_CONFIG.merchantId },
    { name: "product_name", value: product.name },
    { name: "price", value: product.price.toString() },
    { name: "currency", value: SHOPIER_CONFIG.currency },
    { name: "success_url", value: buildReturnUrl("success.html") },
    { name: "fail_url", value: buildReturnUrl("fail.html") }
  ];

  // Her gerekli gizli alan icin bir input olusturup forma ekliyoruz.
  hiddenFields.forEach((field) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.name;
    input.value = field.value;
    form.appendChild(input);
  });

  // Gonder butonu kullaniciyi Shopier odeme adimina yonlendirir.
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "pay-button";
  submitButton.textContent = "Şimdi Öde";

  // Merchant ID unutulursa kullanici bosa yonlenmesin diye basit kontrol ekliyoruz.
  form.addEventListener("submit", (event) => {
    if (!SHOPIER_CONFIG.merchantId || SHOPIER_CONFIG.merchantId === "YOUR_MERCHANT_ID") {
      event.preventDefault();
      window.alert("Lütfen products.js içindeki merchant_id değerini gerçek Shopier bilginizle güncelleyin.");
    }
  });

  // Butonu forma, kalan elemanlari karta ekliyoruz.
  form.appendChild(submitButton);
  article.appendChild(badge);
  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(price);
  article.appendChild(form);

  return article;
}

// Sayfa acildiginda urunleri ekrana basiyoruz.
function renderProducts() {
  const grid = document.getElementById("productGrid");

  // Beklenmedik bir durumda hedef alan bulunamazsa kod bosuna devam etmesin.
  if (!grid) {
    return;
  }

  PRODUCTS.forEach((product) => {
    grid.appendChild(createProductCard(product));
  });
}

// DOM hazir oldugunda listeleme islemini baslatiyoruz.
document.addEventListener("DOMContentLoaded", renderProducts);
