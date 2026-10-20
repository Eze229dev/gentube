import Link from "next/link";
import { redirect } from "next/navigation";

import { product } from "@/config/product";
import {
  DASHBOARD_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from "@/modules/auth/paths";
import { getCurrentUser } from "@/modules/auth/session";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect(DASHBOARD_PATH);
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {product.name}
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          {product.tagline}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={SIGNUP_PATH}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-center text-base font-medium text-white"
        >
          Créer un compte
        </Link>
        <Link
          href={LOGIN_PATH}
          className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 px-4 text-center text-base font-medium text-slate-800"
        >
          Se connecter
        </Link>
      </div>
    </section>
  );
}
