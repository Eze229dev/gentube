import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/modules/auth/session";
import { getOwnedClient } from "@/modules/prospects/clients";
import { NewFollowUpForm } from "@/modules/prospects/components/NewFollowUpForm";

export const metadata: Metadata = {
  title: "Nouvelle relance",
};

export default async function NewFollowUpPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const user = await requireUser();
  const { clientId } = await searchParams;
  const client = clientId ? await getOwnedClient(user.id, clientId) : null;

  if (clientId && !client) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Nouvelle relance
      </h1>
      <NewFollowUpForm client={client} />
    </section>
  );
}
