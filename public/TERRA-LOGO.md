# Yapımcı logosu

Alt bilginin en altındaki imza için iki dosya gerekiyor:

```
public/terra.png        → açık temada (koyu renkli logo)
public/terra_dark.png   → koyu temada (açık renkli logo)
```

Adlar birebir bu olmalı.

## Neden iki dosya

Tema `data-theme` niteliğiyle yönetiliyor. Tek logo koysaydık koyu
temada siyah logo siyah zeminde kaybolurdu.

Tailwind'in `dark:` varyantı burada **çalışmaz** — o varyant
`prefers-color-scheme` ya da bir `.dark` sınıfı arıyor. Bu yüzden
`globals.css` içinde `ct-logo-light` / `ct-logo-dark` sınıfları
tanımlandı.

## Dosya yoksa

Bozuk görsel simgesi çıkar. Yüksekliği 16px olarak sabitlendi;
genişlik orana göre ayarlanıyor — 3x çözünürlükte (48px yükseklik)
PNG önerilir.
