import { ButtonLink, Container } from "@/components/ui";

export function PanelHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: { href: string; label: string } }) {
  return (
    <div className="ct-rise flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[26px] font-semibold tracking-[-.03em] sm:text-[32px]">{title}</h1>
        {subtitle && <span className="text-[14px] text-muted">{subtitle}</span>}
      </div>
      {action && <ButtonLink href={action.href} variant="green" size="lg">{action.label}</ButtonLink>}
    </div>
  );
}

export function PanelBody({ children }: { children: React.ReactNode }) {
  return (
    <Container className="!max-w-[1080px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-7">{children}</div>
    </Container>
  );
}
