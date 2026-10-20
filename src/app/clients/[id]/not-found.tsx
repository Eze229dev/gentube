import Link from "next/link";

import { CLIENTS_PATH } from "@/modules/prospects/paths";

export default function ClientNotFound() {
  return (
    <section className="flex min-h-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Client introuvable
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          Ce client n’existe pas ou ne vous appartient pas.
        </p>
      </div>
      <Link
        href={CLIENTS_PATH}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-base font-medium text-white"
      >
        Retour aux clients
      </Link>
    </section>
  );
}
