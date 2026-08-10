import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/site/auth-forms";

export const metadata: Metadata = { title: "Şifre Yenile", robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<div className="ct-skeleton h-[420px] rounded-[20px]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
