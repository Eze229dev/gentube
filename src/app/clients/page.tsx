import type { Metadata } from "next";

import { LogoutButton } from "@/modules/auth/components/LogoutButton";
import { requireUser } from "@/modules/auth/session";
import { getClientList } from "@/modules/prospects/clients";
import { ClientList } from "@/modules/prospects/components/ClientList";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await getClientList(user.id);

  return (
    <section className="flex min-h-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Clients
        </h1>
        <p className="text-sm text-slate-500">
          {clients.length} client{clients.length > 1 ? "s" : ""}
        </p>
      </div>

      <ClientList clients={clients} />

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </section>
  );
}
