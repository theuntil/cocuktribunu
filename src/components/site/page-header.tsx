import { Container, Eyebrow, H1, Lead } from "@/components/ui";

export function PageHeader({
  eyebrow, title, description, children,
}: {
  eyebrow?: string; title: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line2 bg-page">
      <Container className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="ct-rise flex max-w-[760px] flex-col gap-4">
          {eyebrow && <Eyebrow className="text-muted2">{eyebrow}</Eyebrow>}
          {/* Boyut ezmesi kaldırıldı: ölçek `ct-h1`den geliyor. */}
          <H1>{title}</H1>
          {description && <Lead className="max-w-[620px]">{description}</Lead>}
          {children}
        </div>
      </Container>
    </div>
  );
}
