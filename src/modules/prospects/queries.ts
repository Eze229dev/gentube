import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

import { groupFollowUps } from "./buckets";
import type { FollowUpStatus } from "./status";

export type DashboardFollowUp = {
  id: string;
  product: string | null;
  amount: number | string | null;
  message: string | null;
  scheduled_at: string;
  status: FollowUpStatus;
  client_name: string;
  client_phone: string | null;
};

export type DashboardData = {
  displayName: string;
  todayCount: number;
  overdueCount: number;
  upcomingCount: number;
  todayFollowUps: DashboardFollowUp[];
  overdueFollowUps: DashboardFollowUp[];
  upcomingFollowUps: DashboardFollowUp[];
};

type FollowUpRow = {
  id: string;
  product: string | null;
  amount: number | string | null;
  message: string | null;
  scheduled_at: string;
  status: FollowUpStatus;
  clients:
    | { name: string; phone: string | null }
    | { name: string; phone: string | null }[]
    | null;
};

function clientFromRow(row: FollowUpRow): {
  name: string;
  phone: string | null;
} {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;

  return {
    name: client?.name?.trim() || "Client",
    phone: client?.phone ?? null,
  };
}

function displayNameFrom(
  profileName: string | null | undefined,
  metadataName: unknown,
  email: string | undefined,
): string {
  if (profileName?.trim()) {
    return profileName.trim();
  }

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return email || "vous";
}

export async function getDashboardData(user: User): Promise<DashboardData> {
  const supabase = await createClient();

  const [{ data: profile, error: profileError }, { data: rows, error: followUpsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("follow_ups")
        .select(
          "id, product, amount, message, scheduled_at, status, clients(name, phone)",
        )
        .eq("user_id", user.id)
        .order("scheduled_at", { ascending: true }),
    ]);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (followUpsError) {
    throw new Error(followUpsError.message);
  }

  const followUps: DashboardFollowUp[] = (rows ?? []).map((row) => {
    const followUp = row as FollowUpRow;
    const client = clientFromRow(followUp);

    return {
      id: followUp.id,
      product: followUp.product,
      amount: followUp.amount,
      message: followUp.message,
      scheduled_at: followUp.scheduled_at,
      status: followUp.status,
      client_name: client.name,
      client_phone: client.phone,
    };
  });

  const grouped = groupFollowUps(followUps);

  return {
    displayName: displayNameFrom(
      profile?.full_name,
      user.user_metadata.full_name,
      user.email,
    ),
    todayCount: grouped.today.length,
    overdueCount: grouped.overdue.length,
    upcomingCount: grouped.upcoming.length,
    todayFollowUps: grouped.today,
    overdueFollowUps: grouped.overdue,
    upcomingFollowUps: grouped.upcoming,
  };
}
