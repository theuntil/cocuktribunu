"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, Button, Card, Checkbox, Divider, Field, Select } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconChild, IconFootball, IconLocation, IconTicket } from "@/components/ui/icons";
import { createCardOrder } from "@/lib/actions/app";
import { IDLE } from "@/lib/actions/types";
import { calcAge, publicStorageUrl } from "@/lib/utils";
import type { Address, Child, City, Team } from "@/lib/types";

export function ApplicationForm({
  children, addresses, teams, cities, price,
}: {
  children: Child[]; addresses: Address[]; teams: Team[]; cities: City[]; price: string;
}) {
  const [state, action, pending] = useActionState(createCardOrder, IDLE);
  const [childId, setChildId] = React.useState(children[0]?.id ?? "");
  const [teamId, setTeamId] = React.useState(children[0]?.favorite_team_id ?? teams[0]?.id ?? "");
  const [addressId, setAddressId] = React.useState(addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? "");

  const child = children.find((c) => c.id === childId);
  const team = teams.find((t) => t.id === teamId);
  const address = addresses.find((a) => a.id === addressId);
  const cityName = address ? cities.find((c) => c.id === address.city_id)?.name : null;
  const logo = publicStorageUrl("team-logos", team?.logo_path);

  return (
    <form action={action} className="flex flex-col gap-6">
      {state.message && <Alert tone="danger">{state.message}</Alert>}

      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <Step n={1} icon={IconChild} title="Çocuğunuzu seçin" />
        <Field label="Çocuk" htmlFor="childId" error={state.fieldErrors?.childId}>
          <Select id="childId" name="childId" required value={childId} onChange={(e) => {
            setChildId(e.target.value);
            const c = children.find((x) => x.id === e.target.value);
            if (c?.favorite_team_id) setTeamId(c.favorite_team_id);
          }}>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name} · {calcAge(c.birth_date)} yaş
              </option>
            ))}
          </Select>
        </Field>
        <Link href="/panel/cocuklarim" className="self-start text-[13.5px] font-semibold text-green hover:underline">
          Yeni çocuk ekle →
        </Link>
      </Card>

      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <Step n={2} icon={IconFootball} title="Takımı seçin" />
        <Field label="Takım" htmlFor="teamId" hint="kartın üzerinde görünecek" error={state.fieldErrors?.teamId}>
          <Select id="teamId" name="teamId" required value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        </Field>
      </Card>

      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <Step n={3} icon={IconLocation} title="Teslimat adresi" />
        <Field label="Adres" htmlFor="addressId" error={state.fieldErrors?.addressId}>
          <Select id="addressId" name="addressId" required value={addressId} onChange={(e) => setAddressId(e.target.value)}>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>{a.title} — {a.recipient_name}</option>
            ))}
          </Select>
        </Field>
        {address && (
          <div className="rounded-[14px] bg-field p-4 text-[13.5px] leading-[1.6] text-ink2">
            <strong className="text-ink">{address.recipient_name}</strong><br />
            {address.full_address}<br />
            {[address.neighborhood, cityName].filter(Boolean).join(" · ")}
          </div>
        )}
        <Link href="/panel/adreslerim" className="self-start text-[13.5px] font-semibold text-green hover:underline">
          Yeni adres ekle →
        </Link>
      </Card>

      {/* Özet */}
      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <span className="flex items-center gap-2.5 font-display text-[19px] font-semibold tracking-[-.02em]">
          <Icon icon={IconTicket} size={20} className="text-green" /> Sipariş özeti
        </span>
        <div className="flex flex-col gap-3">
          <SummaryRow label="Çocuk" value={child ? `${child.first_name} ${child.last_name}` : "—"} />
          <SummaryRow label="Takım" value={team?.name ?? "—"} logo={logo} />
          <SummaryRow label="Teslimat" value={address ? `${address.title} · ${cityName ?? ""}` : "—"} />
          <SummaryRow label="Üyelik süresi" value="12 ay" />
        </div>
        <Divider />
        <div className="flex items-center justify-between">
          <span className="text-[14.5px] text-ink2">Toplam (kargo dahil)</span>
          <span className="font-display text-[26px] font-semibold tracking-[-.02em] text-green">{price}</span>
        </div>

        <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-field p-4">
          <Checkbox id="sale" name="sale" required
            label={<><Link href="/mesafeli-satis" className="font-semibold text-green hover:underline">Mesafeli satış sözleşmesini</Link> okudum, onaylıyorum.</>} />
          <Checkbox id="guardian" name="guardian" required
            label="Kaydettiğim çocuğun velisi veya vasisi olduğumu beyan ederim." />
        </div>

        <Button type="submit" size="lg" variant="green" loading={pending}>
          Siparişi oluştur ve ödemeye geç
        </Button>
      </Card>
    </form>
  );
}

function Step({ n, icon, title }: { n: number; icon: Parameters<typeof Icon>[0]["icon"]; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-[14px] font-bold text-on-green">{n}</span>
      <span className="flex items-center gap-2 font-display text-[19px] font-semibold tracking-[-.02em]">
        <Icon icon={icon} size={19} className="text-muted" />{title}
      </span>
    </div>
  );
}

function SummaryRow({ label, value, logo }: { label: string; value: string; logo?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[13px] font-bold tracking-[.08em] text-muted2">{label.toUpperCase()}</span>
      <span className="flex items-center gap-2 text-[14.5px] font-semibold">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="h-5 w-5 object-contain" />
        )}
        {value}
      </span>
    </div>
  );
}
