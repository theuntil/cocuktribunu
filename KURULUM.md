# Çocuk Tribünü — Kurulum (Baştan Sona)

## 1. Veritabanı

`cocuk_tribunu_full.sql` dosyasının **tamamını** çalıştırın. Tek dosya, 001–005 arası
tüm migration'ları içerir.

**Supabase Studio > SQL Editor** yavaş kalırsa psql kullanın:

```bash
psql "postgresql://postgres:PAROLA@supabase.childrentribune.online:5432/postgres" \
  -f cocuk_tribunu_full.sql
```

Idempotenttir — üç kez üst üste çalıştırdım, hiçbir kayıt çoğalmıyor, veri silinmiyor.

Kurulum sonrası beklenen: **48 tablo · 94 politika · 177 index · 88 fonksiyon ·
55 trigger · 9 view · 11 bucket**. Doğrulama sorguları dosyanın sonunda.

## 2. Supabase (self-hosted)

`docker-compose.yml` dosyasını kullanın (Google/Apple köprü satırları eklenmiş hâli).

### ⚠️ `.env` dosyanızda düzeltilmesi gereken

Şu an:
```env
SITE_URL=https://childrentribune.online
ADDITIONAL_REDIRECT_URLS=https://childrentribune.online/*,http://localhost:3000/*
```

Uygulamanız `cocuktribunu.org` üzerinde çalışacaksa **giriş sonrası dönüş çalışmaz**.
İki sebep: adres listede yok, ve `/*` tek seviye eşleşir — `/api/auth/callback` iki seviye.

```env
SITE_URL=https://cocuktribunu.org
ADDITIONAL_REDIRECT_URLS=https://cocuktribunu.org/**,https://childrentribune.online/**,http://localhost:3000/**
```

> Siteniz `childrentribune.online` üzerindeyse `SITE_URL`'i öyle bırakın, ama
> `NEXT_PUBLIC_SITE_URL` ile **aynı** olmalı. İkisi farklıysa giriş döngüye girer.

Sonra Dokploy'da **Deploy** (Rebuild değil — build edilecek bir şey yok).

### Doğrulama

```bash
curl -s https://supabase.childrentribune.online/auth/v1/settings | jq .external
```

Beklenen: `{"email": true, "phone": true, "google": true, "apple": true, ...}`

## 3. Web uygulaması

```bash
tar -xzf cocuk-tribunu-web.tar.gz && cd cocuk-tribunu
cp .env.local.ornek .env.local     # değerleri doldurun
npm install                        # ~511 MB, 1.5 GB boş alan gerekir
npm run build && npm start
```

`.env.local` içinde en kritik üç satır:

```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.childrentribune.online
NEXT_PUBLIC_SITE_URL=https://cocuktribunu.org      # Supabase SITE_URL ile AYNI
NEXT_PUBLIC_OAUTH_PROVIDERS=google,apple
```

## 4. public/ klasörüne koyulacaklar

| Dosya | Kullanım |
|---|---|
| `cocuktribunu.png` | Açık temada logo |
| `cocuktribunud.png` | Koyu temada logo |
| `favicon.ico` | Tarayıcı sekmesi |
| `favicon.png` | PWA ikonu (512×512) |

FIFA 2026 arka plan görseli koda gömülü değil — `site-media` bucket'ına yükleyip:

```sql
update public.site_content set image_path = 'fifa2026-hero.jpg'
 where key in ('home.fifa2026', 'fifa2026.intro');
```

## 5. Apple secret'ı yenileme

Apple client secret'ı **08.02.2027**'de sona eriyor. O tarihten önce:

```bash
node scripts/apple-client-secret.mjs \
  --team-id QM67F4QTUK --key-id J9LXYZNH59 \
  --client-id org.cocuktribunu.web --key ./AuthKey_J9LXYZNH59.p8
```

Çıktıyı `.env` içindeki `APPLE_SECRET` değerine yazıp auth servisini yeniden başlatın.

## 6. İlk yönetici hesabını oluşturma

Siteden normal şekilde kayıt olun, sonra SQL Editor'de:

```sql
select app.grant_role_by_email('sizin@epostaniz.com', 'super_admin');
```

Artık `/yonetim` paneline erişebilirsiniz.

---

## ⚠️ Güvenlik: sızan anahtarları değiştirin

`.env` dosyanızın tamamı sohbet geçmişinde. **Hepsini değiştirin.** En acil ikisi:

- **`JWT_SECRET`** — bunu bilen herkes `service_role` token'ı üretip RLS'in tamamını
  atlayabilir; kurduğumuz tüm güvenlik katmanı anlamsız hale gelir.
  Değişince `ANON_KEY` ve `SERVICE_ROLE_KEY` de yeniden üretilmeli, `.env.local`
  güncellenmeli.
- **`SMTP_PASS`** — `DASHBOARD_PASSWORD` ile aynı parola. İkisi de değişmeli, farklı olmalı.

Ayrıca: `POSTGRES_PASSWORD`, `SECRET_KEY_BASE`, `VAULT_ENC_KEY`, `PG_META_CRYPTO_KEY`,
`GOOGLE_SECRET`, `APPLE_SECRET`.
