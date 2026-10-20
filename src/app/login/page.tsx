import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/modules/auth/components/LoginForm";
import { DASHBOARD_PATH } from "@/modules/auth/paths";
import { getCurrentUser } from "@/modules/auth/session";

export const metadata: Metadata = {
  title: "Connexion",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(DASHBOARD_PATH);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Connexion
        </h1>
        <p className="text-sm text-slate-600">
          Accédez à vos relances WhatsApp.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
