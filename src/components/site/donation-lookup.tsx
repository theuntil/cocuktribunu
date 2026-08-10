"use client";

import { useActionState } from "react";
import { Alert, Button, Card, Field, Input, Badge } from "@/components/ui";
import { checkDonationStatus } from "@/lib/actions/app";
import { IDLE } from "@/lib/actions/types";
import { formatMoney, formatDate, DONATION_STATUS_TR, statusTone } from "@/lib/utils";

export function DonationLookup() {
  const [state, action, pending] = useActionState(checkDonationStatus, IDLE);
  const d = state.ok ? (state.data as { donation_number: string; amount: number; currency: string; status: string; created_at: string; paid_at: string | null; rejection_reason: string | null }) : null;

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-6 sm:p-7">
        <form action={action} className="flex flex-col gap-4">
          {state.message && !state.ok && <Alert tone="danger">{state.message}</Alert>}

          <Field label="Bağış numarası" htmlFor="number" hint="BG-2026-000001" error={state.fieldErrors?.number}>
            <Input id="number" name="number" required placeholder="BG-2026-000001" className="font-mono" />
          </Field>
          <Field label="Erişim kodu" htmlFor="token" hint="bağış sonrası verilen kod" error={state.fieldErrors?.token}>
            <Input id="token" name="token" required placeholder="00000000-0000-0000-0000-000000000000" className="font-mono text-[13px]" />
          </Field>
          <Button type="submit" size="lg" loading={pending}>Sorgula</Button>
        </form>
      </Card>

      {d && (
        <Card className="ct-scale flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[15px] font-bold">{d.donation_number}</span>
            <Badge tone={statusTone(d.status)}>{DONATION_STATUS_TR[d.status] ?? d.status}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Tutar" value={formatMoney(d.amount, d.currency)} />
            <Row label="Oluşturulma" value={formatDate(d.created_at, true)} />
            {d.paid_at && <Row label="Onay tarihi" value={formatDate(d.paid_at, true)} />}
          </div>
          {d.rejection_reason && <Alert tone="danger" title="Red gerekçesi">{d.rejection_reason}</Alert>}
          {d.status === "pending" && (
            <Alert tone="orange">
              Ödemeniz henüz görünmüyor. Havale/EFT açıklamasına bağış numaranızı yazdığınızdan emin olun.
              Banka transferleri hafta sonu ve tatillerde gecikebilir.
            </Alert>
          )}
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-bold tracking-[.08em] text-muted2">{label.toUpperCase()}</span>
      <span className="text-[15px] font-semibold">{value}</span>
    </div>
  );
}
