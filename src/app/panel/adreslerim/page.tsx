import type { Metadata } from "next";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { AddressManager } from "@/components/panel/address-manager";
import { createClient } from "@/lib/supabase/server";
import { getCities } from "@/lib/data";
import type { Address } from "@/lib/types";

export const metadata: Metadata = { title: "Adreslerim", robots: { index: false } };

export default async function Page() {
  const supabase = await createClient();
  const [{ data }, cities] = await Promise.all([
    supabase.from("addresses").select("*").order("is_default", { ascending: false }).order("created_at"),
    getCities(),
  ]);
  const addresses = (data ?? []) as unknown as Address[];

  return (
    <PanelBody>
      <PanelHeader title="Adreslerim" subtitle={`${addresses.length} kayıtlı adres`} />
      <AddressManager addresses={addresses} cities={cities} />
    </PanelBody>
  );
}
