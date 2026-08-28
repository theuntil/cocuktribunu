import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SetupForm } from "@/components/panel/setup-form";
import { ScrollTop } from "@/components/ui/scroll-top";
import { createClient } from "@/lib/supabase/server";
import { getCities, getTeams, ensureProfile } from "@/lib/data";

export const metadata: Metadata = { title: "Kurulum", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * KURULUM — ZORUNLU VE TEK ADIM
 *
 * ┌─ ÇOK ADIMLI SİHİRBAZ KALDIRILDI ⚠️ ───────────────────────────┐
 * │ Kurulum dört sayfaydı: profil → e-posta → telefon → çocuk.     │
 * │ Her adım ayrı bir gönderim, ayrı bir yarım kalma noktası.      │
 * │ Kullanıcı ikinci adımda kayboluyor, ne panele girebiliyor ne   │
 * │ de kart alabiliyordu.                                           │
 * │                                                                  │
 * │ Bilgilerin hepsi kısa: veli adı, çocuk adı, doğum tarihi,      │
 * │ takım, şehir. Tek ekranda sorulup TEK İŞLEMDE yazılıyor —      │
 * │ ya hepsi kaydedilir ya hiçbiri.                                 │
 * └──────────────────────────────────────────────────────────────────┘
 */
export default async function Page() {
  /* Profil satırı yoksa oluştur — yoksa RLS her şeyi reddeder. */
  await ensureProfile();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/giris?devam=/kurulum");

  const { data: durum } = await supabase.rpc("my_setup_state");
  const d = durum as { complete?: boolean; has_order?: boolean; has_paid?: boolean } | null;

  /* Kurulum bitmiş ama sipariş yoksa kullanıcı ödeme adımında yarım
     kalmış demektir: panele değil başvuruya gönderilir. */
  /* ┌─ BU SAYFA SONLANDIRICI ⚠️ ────────────────────────────────┐
     │ Önce sipariş yoksa `/panel/kombine-kart/basvuru`'ya            │
     │ gönderiliyordu. Ama panel kabuğu ödeme onaylanmadan içeri      │
     │ almıyor ve kullanıcıyı `/odeme-bekleniyor`'a atıyordu; orası   │
     │ da sipariş bulamayınca başvuruya geri gönderiyordu.            │
     │                                                                  │
     │ SONSUZ DÖNGÜ. Yönetici bir siparişi silince tam olarak bu       │
     │ oluyordu: kurulum tamam, sipariş yok, hiçbir sayfa duramıyor.  │
     │                                                                  │
     │ Çözüm: sipariş yoksa BU SAYFA DURUR ve formu bilgiler dolu     │
     │ olarak gösterir. Kullanıcı gözden geçirip gönderiyor, yeni     │
     │ sipariş açılıyor. Yönlendirme zinciri burada bitiyor.          │
     └──────────────────────────────────────────────────────────────────┘ */
  if (d?.complete && d.has_paid) redirect("/panel");
  if (d?.complete && d.has_order) redirect("/odeme-bekleniyor");

  const [cities, teams, profileRes, childRes, contactRes] = await Promise.all([
    getCities(),
    getTeams(),
    supabase.from("profiles").select("first_name,last_name").eq("id", auth.user.id).maybeSingle(),
    /* ┌─ TÜM ÇOCUKLAR ÇEKİLİYOR ⚠️ ───────────────────────────────┐
       │ Önce yalnızca ilk çocuk alınıyordu. İki çocuğu olan bir veli │
       │ ikinci çocuğu için başvurmak istediğinde form BİRİNCİ        │
       │ çocuğun bilgileriyle doluyordu ve düzeltmek zorunda kalıyordu.│
       │                                                                │
       │ Artık hepsi geliyor; kartı olmayanlar arasından seçim         │
       │ yapılabiliyor.                                                  │
       └────────────────────────────────────────────────────────────────┘ */
    supabase.from("children")
      .select("id,first_name,last_name,birth_date,gender,favorite_team_id,city_id")
      .eq("status", "active")
      .order("created_at", { ascending: true }),
    supabase.from("parent_contacts").select("phone").eq("user_id", auth.user.id).maybeSingle(),
  ]);

  const p = profileRes.data as { first_name: string | null; last_name: string | null } | null;

  type Cocuk = {
    id: string; first_name: string; last_name: string; birth_date: string;
    gender: string | null; favorite_team_id: string | null; city_id: number | null;
  };

  const cocuklar = (childRes.data ?? []) as unknown as Cocuk[];

  /* Geçerli kartı olan çocuklar listeden çıkarılıyor: onlar için
     yeniden başvurmaya gerek yok. */
  const { data: kartliRes } = await supabase
    .from("cards")
    .select("child_id")
    .in("status", ["active", "pending"]);

  const kartli = new Set(
    ((kartliRes ?? []) as { child_id: string | null }[])
      .map((k) => k.child_id).filter(Boolean) as string[],
  );

  const kartsiz = cocuklar.filter((x) => !kartli.has(x.id));

  /* Seçilebilecek çocuk yoksa (hepsinin kartı var) ilk çocuk
     gösteriliyor — kullanıcı yine de bilgileri düzenleyip yeni bir
     başvuru yapabilsin. */
  const c = kartsiz[0] ?? cocuklar[0] ?? null;

  const tel = (contactRes.data as { phone: string | null } | null)?.phone ?? "";

  /* Kurulum tamam ama sipariş yoksa kullanıcı buraya "yeniden"
     geliyor. Başlık ve açıklama ona göre değişiyor. */
  const yeniden = Boolean(d?.complete);

  return (
    <div className="ct-rise flex flex-col gap-8">
      <ScrollTop />
      <div className="flex flex-col gap-3">
        <span className="text-[12px] font-bold uppercase tracking-[.14em] text-muted2">
          {yeniden ? "BAŞVURUNUZU TAMAMLAYIN" : "SON BİR ADIM"}
        </span>
        <h1 className="ct-h2">
          {yeniden ? "Bilgilerinizi onaylayın." : "Hoş geldiniz."}
        </h1>
        <p className="ct-lead">
          {yeniden
            ? "Kayıtlı bilgileriniz aşağıda hazır. Gözden geçirip onayladığınızda kombine kart başvurunuz yeniden oluşturulacak."
            : "Çocuğunuzun kombine kartını oluşturabilmemiz için birkaç bilgiye ihtiyacımız var. Tek seferde alıyoruz — bir dakikadan kısa sürer."}
        </p>
      </div>

      <SetupForm
        teams={teams}
        cities={cities}
        email={auth.user.email ?? ""}
        /* Kartı olmayan çocuklar; birden fazlaysa form seçim sunuyor. */
        children={kartsiz.map((x) => ({
          id: x.id,
          name: `${x.first_name} ${x.last_name}`.trim(),
          birthDate: x.birth_date,
          gender: x.gender === "male" || x.gender === "female" ? x.gender : "",
          teamId: x.favorite_team_id ?? "",
          cityId: x.city_id ? String(x.city_id) : "",
          firstName: x.first_name,
          lastName: x.last_name,
        }))}
        defaults={{
          firstName: p?.first_name,
          lastName: p?.last_name,
          phone: tel,
          childFirstName: c?.first_name,
          childLastName: c?.last_name,
          childBirthDate: c?.birth_date,
          gender: c?.gender === "male" || c?.gender === "female" ? c.gender : "",
          teamId: c?.favorite_team_id ?? "",
          cityId: c?.city_id ? String(c.city_id) : "",
        }}
      />
    </div>
  );
}
