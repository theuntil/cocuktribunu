import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card, Container, Section } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconCheck } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Başvurunuz alındı", robots: { index: false } };

export default function Page() {
  return (
    <Section>
      <Container className="max-w-[600px]">
        <Card className="ct-scale flex flex-col items-center gap-5 p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
            <Icon icon={IconCheck} size={30} />
          </span>
          <h1 className="font-display text-[27px] font-semibold tracking-[-.02em]">Başvurunuz alındı</h1>
          <p className="text-[15px] leading-[1.65] text-ink2">
            Ödemeniz onaylandıktan sonra kartınız hazırlanacak. Süreci panelinizden adım adım takip
            edebilirsiniz; her aşamada size bildirim göndereceğiz.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <ButtonLink href="/panel/siparisler" size="lg">Siparişlerim</ButtonLink>
            <ButtonLink href="/etkinlikler" variant="outline" size="lg">Etkinliklere göz at</ButtonLink>
          </div>
          <Link href="/sss" className="text-[13.5px] font-semibold text-muted hover:text-green">
            Sıkça sorulan sorular
          </Link>
        </Card>
      </Container>
    </Section>
  );
}
