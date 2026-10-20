import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/modules/auth/session";
import { getClientDetail } from "@/modules/prospects/clients";
import { ClientDetail } from "@/modules/prospects/components/ClientDetail";

export const metadata: Metadata = {
  title: "Client",
};

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const client = await getClientDetail(user.id, id);

  if (!client) {
    notFound();
  }

  return <ClientDetail client={client} />;
}
