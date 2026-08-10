"use client";

import * as React from "react";
import { useActionState } from "react";
import { Alert, Badge, Button, Card, Field, Input, Select, EmptyState } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconChild, IconPlus, IconEdit, IconTrash, IconClose } from "@/components/ui/icons";
import { addChild, updateChild, deleteChild, setChildPhoto } from "@/lib/actions/app";
import { IDLE } from "@/lib/actions/types";
import { calcAge, formatDate, initials, publicStorageUrl } from "@/lib/utils";
import { PhotoPicker } from "@/components/ui/image-cropper";
import { ConfirmDialog } from "@/components/ui/modal";
import { uploadChildPhoto } from "@/lib/upload";
import type { Child, City, Team } from "@/lib/types";

export function ChildManager({ children, teams, cities }: { children: Child[]; teams: Team[]; cities: City[] }) {
  const [editing, setEditing] = React.useState<Child | null>(null);
  const [creating, setCreating] = React.useState(children.length === 0);
  const [removing, setRemoving] = React.useState<Child | null>(null);
  const [deleting, startDelete] = React.useTransition();

  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const cityMap = new Map(cities.map((c) => [c.id, c.name]));

  return (
    <div className="flex flex-col gap-6">
      {!creating && !editing && (
        <div className="flex justify-end">
          <Button variant="green" size="lg" onClick={() => setCreating(true)}>
            <Icon icon={IconPlus} size={17} /> Çocuk ekle
          </Button>
        </div>
      )}

      {(creating || editing) && (
        <ChildForm
          child={editing}
          teams={teams}
          cities={cities}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}

      {children.length === 0 && !creating ? (
        <EmptyState
          icon={<Icon icon={IconChild} size={26} />}
          title="Henüz çocuk kaydınız yok"
          description="Kombine kart çocuğun adına düzenlendiği için önce bir çocuk kaydı eklemeniz gerekiyor."
          action={<Button variant="green" onClick={() => setCreating(true)}>Çocuk ekle</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((c) => (
            <Card key={c.id} className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3.5">
                <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-chip font-display text-[16px] font-bold text-muted"
                  style={{ width: 52, height: 52 }}>
                  {publicStorageUrl("avatars", c.photo_path) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={publicStorageUrl("avatars", c.photo_path)!} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials(c.first_name, c.last_name)
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[17px] font-bold">{c.first_name} {c.last_name}</span>
                  <span className="text-[13.5px] text-muted">
                    {formatDate(c.birth_date)} · {calcAge(c.birth_date)} yaş
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[13.5px]">
                <Meta label="TAKIM" value={c.favorite_team_id ? (teamMap.get(c.favorite_team_id) ?? "—") : "—"} />
                <Meta label="ŞEHİR" value={c.city_id ? (cityMap.get(c.city_id) ?? "—") : "—"} />
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-line2 pt-4">
                <Badge tone="green">Aktif</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(c); setCreating(false); }}>
                    <Icon icon={IconEdit} size={14} /> Düzenle
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setRemoving(c)}
                    className="!text-danger hover:!bg-danger-soft" aria-label={`${c.first_name} kaydını sil`}>
                    <Icon icon={IconTrash} size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={deleting}
        title="Çocuk kaydını sil"
        description={removing
          ? `${removing.first_name} ${removing.last_name} kaydı ve varsa fotoğrafı kalıcı olarak silinecek. Bu işlem geri alınamaz.`
          : undefined}
        confirmLabel="Evet, sil"
        onConfirm={() => {
          const target = removing;
          if (!target) return;
          startDelete(async () => {
            const fd = new FormData();
            fd.set("id", target.id);
            await deleteChild(fd);
            setRemoving(null);
          });
        }}
      />

      <Alert tone="muted" title="Neden bu bilgiler?">
        Kartın basılabilmesi için ad, soyad ve doğum tarihi gerekir. T.C. kimlik numarası, okul veya sağlık
        bilgisi istemiyoruz. Bu veriler yalnızca sizin hesabınızdan görülebilir.
      </Alert>
    </div>
  );
}

function ChildForm({
  child, teams, cities, onClose,
}: { child: Child | null; teams: Team[]; cities: City[]; onClose: () => void }) {
  const [state, action, pending] = useActionState(child ? updateChild : addChild, IDLE);

  React.useEffect(() => { if (state.ok) onClose(); }, [state.ok, onClose]);

  const today = new Date().toISOString().slice(0, 10);
  const minDate = new Date(Date.now() - 18 * 365.25 * 864e5).toISOString().slice(0, 10);

  return (
    <Card className="ct-scale flex flex-col gap-5 p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-display text-[19px] font-semibold tracking-[-.02em]">
          {child ? "Çocuk bilgilerini düzenle" : "Yeni çocuk ekle"}
        </span>
        <button type="button" onClick={onClose} aria-label="Kapat"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-chip">
          <Icon icon={IconClose} size={17} />
        </button>
      </div>

      {state.message && !state.ok && <Alert tone="danger">{state.message}</Alert>}

      {child && <ChildPhotoField child={child} />}

      <form action={action} className="flex flex-col gap-4">
        {child && <input type="hidden" name="id" value={child.id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad" htmlFor="cFirstName" error={state.fieldErrors?.firstName}>
            <Input id="cFirstName" name="firstName" required maxLength={80} defaultValue={child?.first_name} />
          </Field>
          <Field label="Soyad" htmlFor="cLastName" error={state.fieldErrors?.lastName}>
            <Input id="cLastName" name="lastName" required maxLength={80} defaultValue={child?.last_name} />
          </Field>
        </div>

        <Field label="Doğum tarihi" htmlFor="birthDate" hint="0–18 yaş" error={state.fieldErrors?.birthDate}>
          <Input id="birthDate" name="birthDate" type="date" required min={minDate} max={today}
            defaultValue={child?.birth_date?.slice(0, 10)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Takımı" htmlFor="cTeamId" hint="isteğe bağlı">
            <Select id="cTeamId" name="teamId" defaultValue={child?.favorite_team_id ?? ""}>
              <option value="">Seçiniz</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label="Şehir" htmlFor="cCityId" hint="isteğe bağlı">
            <Select id="cCityId" name="cityId" defaultValue={child?.city_id ?? ""}>
              <option value="">Seçiniz</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="submit" variant="green" size="lg" loading={pending}>
            {child ? "Değişiklikleri kaydet" : "Çocuğu ekle"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Vazgeç</Button>
        </div>
      </form>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11.5px] font-bold tracking-[.08em] text-muted2">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}


/** Çocuk fotoğrafı: seç → kırp → yükle → kaydet */
function ChildPhotoField({ child }: { child: Child }) {
  const [path, setPath] = React.useState<string | null>(child.photo_path);
  const [, startSave] = React.useTransition();

  const save = (next: string | null) =>
    new Promise<void>((resolve) => {
      startSave(async () => {
        const fd = new FormData();
        fd.set("childId", child.id);
        if (next) fd.set("path", next);
        const res = await setChildPhoto(IDLE, fd);
        if (res.ok) setPath(next);
        resolve();
      });
    });

  return (
    <div className="border-b border-line2 pb-5">
      <PhotoPicker
        label="Profil fotoğrafı"
        currentUrl={publicStorageUrl("avatars", path)}
        fallback={initials(child.first_name, child.last_name)}
        onUpload={async (blob) => {
          const uploaded = await uploadChildPhoto(child.id, blob);
          await save(uploaded);
        }}
        onRemove={async () => { await save(null); }}
      />
    </div>
  );
}
