import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ButtonLink, Card, Container, Divider, EmptyState, Section } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { Icon } from "@/components/ui/icon";
import { IconChild, IconLocation, IconArrowRight } from "@/components/ui/icons";
import { ApplicationForm } from "@/components/site/application-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getTeams, getActivePlan, getCities } from "@/lib/data";
import { formatMoney } from "@/lib/utils";
import type { Address, Child } from "@/lib/types";

export const metadata: Metadata = { title: "Kart Başvurusu", robots: { index: false } };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?devam=/basvuru");

  const supabase = await createClient();
  const [{ data: children }, { data: addresses }, teams, plan, cities] = await Promise.all([
    supabase.from("children").select("*").eq("status", "active").order("birth_date"),
    supabase.from("addresses").select("*").order("is_default", { ascending: false }),
    getTeams(),
    getActivePlan(),
    getCities(),
  ]);

  const kids = (children ?? []) as unknown as Child[];
  const addrs = (addresses ?? []) as unknown as Address[];
  const price = plan ? formatMoney(plan.price, plan.currency) : "190 ₺";

  return (
    <>
      <PageHeader
        eyebrow="KART BAŞVURUSU"
        title="Üç adımda tamamlayın"
        description={`Yıllık üyelik bedeli ${price}. Çocuğunuzu ve teslimat adresini seçin, ödemeyi havale/EFT ile yapın.`}
      />

      <Section className="!pt-10">
        <Container className="max-w-[860px]">
          {kids.length === 0 || addrs.length === 0 ? (
            <div className="flex flex-col gap-5">
              {kids.length === 0 && (
                <EmptyState
                  icon={<Icon icon={IconChild} size={26} />}
                  title="Önce bir çocuk kaydı ekleyin"
                  description="Kart çocuğun adına düzenlendiği için ad, soyad ve doğum tarihi bilgisine ihtiyacımız var."
                  action={<ButtonLink href="/panel/cocuklarim" size="lg">Çocuk ekle <Icon icon={IconArrowRight} size={16} /></ButtonLink>}
                />
              )}
              {addrs.length === 0 && (
                <EmptyState
                  icon={<Icon icon={IconLocation} size={26} />}
                  title="Teslimat adresi ekleyin"
                  description="Kartı gönderebilmemiz için bir adres kaydına ihtiyacımız var."
                  action={<ButtonLink href="/panel/adreslerim" size="lg">Adres ekle <Icon icon={IconArrowRight} size={16} /></ButtonLink>}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <ApplicationForm children={kids} addresses={addrs} teams={teams} cities={cities} price={price} />
              <Card className="flex flex-col gap-3 p-6">
                <span className="text-[13px] font-bold tracking-[.1em] text-muted2">ÖDEME BİLGİSİ</span>
                <p className="text-[14px] leading-[1.65] text-ink2">
                  Başvuruyu tamamladığınızda size bir sipariş numarası ve havale bilgileri göstereceğiz.
                  Ödemeniz onaylandıktan sonra kart hazırlanır ve kargoya verilir.
                </p>
                <Divider />
                <p className="text-[13.5px] text-muted">
                  Cayma hakkı ve iade koşulları için{" "}
                  <Link href="/mesafeli-satis" className="font-semibold text-green hover:underline">mesafeli satış sözleşmesi</Link>{" "}
                  ve{" "}
                  <Link href="/iptal-iade" className="font-semibold text-green hover:underline">iptal-iade koşulları</Link>.
                </p>
              </Card>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
