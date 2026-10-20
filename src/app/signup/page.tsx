import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignupForm } from "@/modules/auth/components/SignupForm";
import { DASHBOARD_PATH } from "@/modules/auth/paths";
import { getCurrentUser } from "@/modules/auth/session";

export const metadata: Metadata = {
  title: "Inscription",
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(DASHBOARD_PATH);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Créer un compte
        </h1>
        <p className="text-sm text-slate-600">
          Relancez vos prospects sans les oublier.
        </p>
      </div>
      <SignupForm />
    </section>
  );
}
