"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DASHBOARD_PATH } from "@/modules/auth/paths";
import { requireUser } from "@/modules/auth/session";
import { getOwnedClient } from "@/modules/prospects/clients";
import { parisDateAndTimeToIso } from "@/modules/prospects/format";
import { clientPath } from "@/modules/prospects/paths";
import {
  isValidWhatsAppPhone,
  toWhatsAppPhone,
} from "@/modules/prospects/whatsapp";

export type FollowUpActionState = {
  error: string | null;
};

function readField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseAmount(raw: string): number | null | undefined {
  if (!raw) {
    return null;
  }

  const normalized = raw.replace(/\s/g, "").replace(",", ".");
  const value = Number(normalized);

  if (!Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return value;
}

export async function createFollowUp(
  _prevState: FollowUpActionState,
  formData: FormData,
): Promise<FollowUpActionState> {
  const user = await requireUser();
  const requestedClientId = readField(formData, "clientId");
  const name = readField(formData, "name");
  const phone = readField(formData, "phone");
  const product = readField(formData, "product");
  const amountRaw = readField(formData, "amount");
  const date = readField(formData, "date");
  const time = readField(formData, "time");
  const message = readField(formData, "message");

  if (!name) {
    return { error: "Le nom du client est obligatoire." };
  }

  if (!phone) {
    return { error: "Le numéro WhatsApp est obligatoire." };
  }

  if (!product) {
    return { error: "Le produit / service est obligatoire." };
  }

  if (!date) {
    return { error: "La date est obligatoire." };
  }

  if (!time) {
    return { error: "L’heure est obligatoire." };
  }

  if (!message) {
    return { error: "Le message est obligatoire." };
  }

  const normalizedPhone = toWhatsAppPhone(phone);

  if (!normalizedPhone || !isValidWhatsAppPhone(normalizedPhone)) {
    return { error: "Numéro WhatsApp invalide." };
  }

  const amount = parseAmount(amountRaw);

  if (amount === undefined) {
    return { error: "Montant invalide." };
  }

  const scheduledAt = parisDateAndTimeToIso(date, time);

  if (!scheduledAt) {
    return { error: "Date ou heure invalide." };
  }

  const supabase = await createClient();
  let clientId: string | undefined;

  if (requestedClientId) {
    const owned = await getOwnedClient(user.id, requestedClientId);

    if (!owned) {
      return { error: "Client introuvable." };
    }

    clientId = owned.id;
  } else {
    const { data: existingClients, error: listError } = await supabase
      .from("clients")
      .select("id, name, phone")
      .eq("user_id", user.id);

    if (listError) {
      return { error: "Impossible de vérifier le client." };
    }

    const existing = (existingClients ?? []).find(
      (client) => toWhatsAppPhone(client.phone) === normalizedPhone,
    );

    clientId = existing?.id;

    if (clientId) {
      if (
        existing &&
        (existing.name !== name || existing.phone !== normalizedPhone)
      ) {
        const { error: updateError } = await supabase
          .from("clients")
          .update({ name, phone: normalizedPhone })
          .eq("id", clientId)
          .eq("user_id", user.id);

        if (updateError) {
          return { error: "Impossible de mettre à jour le client." };
        }
      }
    } else {
      const { data: created, error: insertError } = await supabase
        .from("clients")
        .insert({
          user_id: user.id,
          name,
          phone: normalizedPhone,
        })
        .select("id")
        .single();

      if (insertError || !created) {
        return { error: "Impossible d’enregistrer le client." };
      }

      clientId = created.id;
    }
  }

  if (!clientId) {
    return { error: "Impossible d’enregistrer le client." };
  }

  const { error: followUpError } = await supabase.from("follow_ups").insert({
    user_id: user.id,
    client_id: clientId,
    product,
    amount,
    message,
    scheduled_at: scheduledAt,
    status: "pending",
  });

  if (followUpError) {
    return { error: "Impossible d’enregistrer la relance." };
  }

  if (requestedClientId) {
    redirect(clientPath(requestedClientId));
  }

  redirect(`${DASHBOARD_PATH}?created=1`);
}

export async function markFollowUpCompleted(
  followUpId: string,
): Promise<{ error: string | null }> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("follow_ups")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", followUpId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Impossible de marquer la relance." };
  }

  return { error: null };
}
