import { Suspense } from "react";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/site/auth-forms";

export const metadata: Metadata = { title: "Şifremi Unuttum", robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<div className="ct-skeleton h-[420px] rounded-[20px]" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
