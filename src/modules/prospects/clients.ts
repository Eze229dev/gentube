import { createClient } from "@/lib/supabase/server";

import type { FollowUpStatus } from "./status";

export type ClientListItem = {
  id: string;
  name: string;
  phone: string | null;
  pendingCount: number;
  completedCount: number;
  nextScheduledAt: string | null;
};

export type ClientFollowUp = {
  id: string;
  product: string | null;
  amount: number | string | null;
  message: string | null;
  scheduled_at: string;
  status: FollowUpStatus;
};

export type ClientDetail = {
  id: string;
  name: string;
  phone: string | null;
  completedCount: number;
  pendingCount: number;
  nextFollowUp: ClientFollowUp | null;
  history: ClientFollowUp[];
};

function mapFollowUp(row: {
  id: string;
  product: string | null;
  amount: number | string | null;
  message: string | null;
  scheduled_at: string;
  status: string;
}): ClientFollowUp {
  return {
    id: row.id,
    product: row.product,
    amount: row.amount,
    message: row.message,
    scheduled_at: row.scheduled_at,
    status: row.status as FollowUpStatus,
  };
}

export async function getClientList(userId: string): Promise<ClientListItem[]> {
  const supabase = await createClient();

  const [{ data: clients, error: clientsError }, { data: followUps, error: followUpsError }] =
    await Promise.all([
      supabase
        .from("clients")
        .select("id, name, phone")
        .eq("user_id", userId)
        .order("name", { ascending: true }),
      supabase
        .from("follow_ups")
        .select("client_id, status, scheduled_at")
        .eq("user_id", userId),
    ]);

  if (clientsError) {
    throw new Error(clientsError.message);
  }

  if (followUpsError) {
    throw new Error(followUpsError.message);
  }

  const stats = new Map<
    string,
    { pendingCount: number; completedCount: number; nextScheduledAt: string | null }
  >();

  for (const followUp of followUps ?? []) {
    const current = stats.get(followUp.client_id) ?? {
      pendingCount: 0,
      completedCount: 0,
      nextScheduledAt: null,
    };

    if (followUp.status === "completed") {
      current.completedCount += 1;
    }

    if (followUp.status === "pending") {
      current.pendingCount += 1;
      if (
        !current.nextScheduledAt ||
        followUp.scheduled_at < current.nextScheduledAt
      ) {
        current.nextScheduledAt = followUp.scheduled_at;
      }
    }

    stats.set(followUp.client_id, current);
  }

  return (clients ?? []).map((client) => {
    const current = stats.get(client.id);

    return {
      id: client.id,
      name: client.name,
      phone: client.phone,
      pendingCount: current?.pendingCount ?? 0,
      completedCount: current?.completedCount ?? 0,
      nextScheduledAt: current?.nextScheduledAt ?? null,
    };
  });
}

export async function getOwnedClient(
  userId: string,
  clientId: string,
): Promise<{ id: string; name: string; phone: string | null } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, phone")
    .eq("id", clientId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getClientDetail(
  userId: string,
  clientId: string,
): Promise<ClientDetail | null> {
  const supabase = await createClient();

  const [{ data: client, error: clientError }, { data: rows, error: followUpsError }] =
    await Promise.all([
      supabase
        .from("clients")
        .select("id, name, phone")
        .eq("id", clientId)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("follow_ups")
        .select("id, product, amount, message, scheduled_at, status")
        .eq("client_id", clientId)
        .eq("user_id", userId)
        .order("scheduled_at", { ascending: false }),
    ]);

  if (clientError) {
    throw new Error(clientError.message);
  }

  if (!client) {
    return null;
  }

  if (followUpsError) {
    throw new Error(followUpsError.message);
  }

  const history = (rows ?? []).map(mapFollowUp);
  const pending = history.filter((item) => item.status === "pending");
  const nextFollowUp =
    pending.length > 0
      ? pending.reduce((soonest, item) =>
          item.scheduled_at < soonest.scheduled_at ? item : soonest,
        )
      : null;

  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    completedCount: history.filter((item) => item.status === "completed").length,
    pendingCount: pending.length,
    nextFollowUp,
    history,
  };
}
