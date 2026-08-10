"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, Button, Card, Divider, Select, Field } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconCheck, IconAlert, IconQr, IconUsers } from "@/components/ui/icons";
import { registerForEvent } from "@/lib/actions/app";
import { IDLE } from "@/lib/actions/types";
import type { ChildEligibility } from "@/lib/types";

export function EventRegistration({
  eventId, eventTitle, children, guardianRequired, waitlistEnabled, remaining,
}: {
  eventId: string;
  eventTitle: string;
  children: ChildEligibility[];
  guardianRequired: boolean;
  waitlistEnabled: boolean;
  remaining: number | null;
}) {
  const [state, action, pending] = useActionState(registerForEvent, IDLE);
  const eligible = children.filter((c) => c.eligible);
  const blocked = children.filter((c) => !c.eligible);
  const [selected, setSelected] = React.useState(eligible[0]?.child_id ?? "");

  if (state.ok && state.data) {
    const d = state.data as { status: string; check_in_code: string; waitlist_position: number | null };
    return (
      <Card className="ct-scale flex flex-col items-center gap-5 p-7 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green">
          <Icon icon={IconCheck} size={26} />
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-display text-[21px] font-semibold tracking-[-.02em]">
            {d.status === "waitlisted" ? "Bekleme listesindesiniz" : "Kaydınız alındı"}
          </span>
          <p className="text-[14px] leading-[1.6] text-ink2">
            {d.status === "waitlisted"
              ? `Sıradaki ${d.waitlist_position}. kişisiniz. Yer açılırsa size bildirim göndereceğiz.`
              : `${eventTitle} etkinliğinde görüşmek üzere!`}
          </p>
        </div>

        {d.status === "confirmed" && d.check_in_code && (
          <div className="flex w-full flex-col items-center gap-2 rounded-[16px] border border-line bg-field p-5">
            <span className="flex items-center gap-2 text-[12px] font-bold tracking-[.1em] text-muted2">
              <Icon icon={IconQr} size={15} /> GİRİŞ KODU
            </span>
            <span className="font-mono text-[26px] font-bold tracking-[.15em] text-ink">{d.check_in_code}</span>
            <span className="text-[12.5px] text-muted">Etkinlik girişinde bu kodu gösterin.</span>
          </div>
        )}

        <Link href="/panel/etkinliklerim" className="text-[14px] font-semibold text-green hover:underline">
          Kayıtlarımı görüntüle →
        </Link>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-5 p-7">
      <div className="flex flex-col gap-1">
        <span className="font-display text-[20px] font-semibold tracking-[-.02em]">Etkinliğe katıl</span>
        <span className="text-[13.5px] text-muted">
          {remaining === null ? "Kontenjan sınırsız" : remaining > 0 ? `${remaining} yer kaldı` : waitlistEnabled ? "Kontenjan doldu — bekleme listesi açık" : "Kontenjan doldu"}
        </span>
      </div>

      {state.message && !state.ok && <Alert tone="danger">{state.message}</Alert>}

      {children.length === 0 ? (
        <>
          <Alert tone="orange">
            Kayıt yapmak için önce panelinizden bir çocuk kaydı eklemelisiniz.
          </Alert>
          <Link href="/panel/cocuklarim"><Button size="lg" className="w-full">Çocuk ekle</Button></Link>
        </>
      ) : eligible.length === 0 ? (
        <>
          <Alert tone="danger">
            <span className="flex items-start gap-2">
              <Icon icon={IconAlert} size={16} className="mt-[2px] shrink-0" />
              Şu an bu etkinliğe kaydedebileceğiniz bir çocuk bulunmuyor.
            </span>
          </Alert>
          <BlockedList items={blocked} />
          <Link href="/basvuru"><Button variant="green" size="lg" className="w-full">Kombine kart al</Button></Link>
        </>
      ) : (
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="eventId" value={eventId} />

          <Field label="Hangi çocuğunuz katılacak?" htmlFor="childId" error={state.fieldErrors?.childId}>
            <Select id="childId" name="childId" required value={selected} onChange={(e) => setSelected(e.target.value)}>
              {eligible.map((c) => (
                <option key={c.child_id} value={c.child_id}>
                  {c.first_name} {c.last_name} · {c.age} yaş{c.will_waitlist ? " (bekleme listesi)" : ""}
                </option>
              ))}
            </Select>
          </Field>

          {guardianRequired && (
            <Field label="Refakatçi sayısı" htmlFor="guardianCount" hint="veli/vasi">
              <Select id="guardianCount" name="guardianCount" defaultValue="1">
                <option value="1">1 refakatçi</option>
                <option value="2">2 refakatçi</option>
              </Select>
            </Field>
          )}

          <Button type="submit" variant="green" size="lg" loading={pending}>
            <Icon icon={IconUsers} size={17} />
            {eligible.find((c) => c.child_id === selected)?.will_waitlist ? "Bekleme listesine katıl" : "Katıl"}
          </Button>

          {blocked.length > 0 && (
            <>
              <Divider />
              <BlockedList items={blocked} />
            </>
          )}
        </form>
      )}
    </Card>
  );
}

function BlockedList({ items }: { items: ChildEligibility[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-bold tracking-[.1em] text-muted2">KATILAMAYAN ÇOCUKLAR</span>
      {items.map((c) => (
        <div key={c.child_id} className="flex flex-col gap-0.5 rounded-[12px] bg-chip px-3.5 py-2.5">
          <span className="text-[13.5px] font-semibold">{c.first_name} {c.last_name}</span>
          <span className="text-[12.5px] leading-[1.5] text-muted">{c.message}</span>
        </div>
      ))}
    </div>
  );
}
