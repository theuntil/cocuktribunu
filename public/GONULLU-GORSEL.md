# Gönüllülük görseli

Hakkımızda sayfasının sonundaki gönüllülük bölümü arka planında
kullanılıyor.

```
public/gonullu.png
```

Ad birebir bu olmalı.

## Öneriler

- **Yatay** ve geniş: bölüm tam genişlikte, `background-size: cover`
- **En az 1600×900 px** — geniş ekranlarda bulanıklaşmasın
- Ortada boş alan bırakın: yazı ortalanmış olarak üstüne geliyor

## Dosya yoksa ne olur

**Bölüm bozulmaz.** `bg-deep` (siyah zemin) yedek olarak duruyor;
görsel yüklenmezse bölüm eskisi gibi düz koyu zeminle çalışır.

## Okunabilirlik

Görselin üstüne koyu bir perde uygulanıyor (%72 → %84). Açık renkli
bir fotoğraf koysanız bile beyaz yazı okunur kalır — perde olmasaydı
bazı ekranlarda metin kaybolurdu.

Perdeyi koyulaştırmak/açmak isterseniz `hakkimizda/page.tsx` içindeki
`linear-gradient` değerlerini değiştirin.
