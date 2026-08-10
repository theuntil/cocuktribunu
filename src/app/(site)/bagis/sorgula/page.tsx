import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { DonationLookup } from "@/components/site/donation-lookup";

export const metadata: Metadata = {
  title: "Bağış Sorgula",
  description: "Bağış numaranız ve erişim kodunuzla bağışınızın durumunu sorgulayın.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="BAĞIŞ SORGULA"
        title="Bağışınızın durumu"
        description="Bağış yaptıktan sonra size verdiğimiz numara ve erişim kodu ile üyelik gerekmeden durumunuzu görüntüleyebilirsiniz."
      />
      <Section>
        <Container className="max-w-[560px]">
          <DonationLookup />
        </Container>
      </Section>
    </>
  );
}
