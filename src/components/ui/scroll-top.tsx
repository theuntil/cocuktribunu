"use client";

import * as React from "react";

/**
 * SAYFAYI EN ÜSTE ALIR
 *
 * ┌─ NEDEN GEREKLİ ⚠️ ────────────────────────────────────────────┐
 * │ Kayıt formu uzun; kullanıcı gönderirken sayfanın ALTINDA        │
 * │ oluyor. Sunucu eyleminden dönen `redirect()` istemci tarafı bir │
 * │ geçiş yapıyor ve tarayıcı kaydırma konumunu KORUYOR.            │
 * │                                                                  │
 * │ Sonuç: "Ödeme bekleniyor" sayfası ortasından açılıyor,          │
 * │ kullanıcı başlığı görmüyor ve ne olduğunu anlamıyor.            │
 * │                                                                  │
 * │ ★ KÖK DÜZENE KONULMADI. Oraya konsaydı geri/ileri tuşlarında    │
 * │   da çalışır ve Next.js'in konum geri yükleme davranışını       │
 * │   bozardı — kullanıcı listeye geri döndüğünde kaldığı yeri      │
 * │   değil en üstü görürdü.                                         │
 * │                                                                  │
 * │   Bu yüzden yalnızca YÖNLENDİRME HEDEFİ olan sayfalara          │
 * │   konuluyor.                                                      │
 * └──────────────────────────────────────────────────────────────────┘
 */
export function ScrollTop() {
  React.useEffect(() => {
    /* `instant`: yumuşak kaydırma burada yanlış — kullanıcı zaten
       yeni bir sayfada, uzun bir animasyonla yukarı sürüklenmesi
       kafa karıştırıcı olur. */
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return null;
}
