"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { ClientListItem } from "@/modules/prospects/clients";
import { formatDateTime } from "@/modules/prospects/format";
import { clientPath, NEW_FOLLOW_UP_PATH } from "@/modules/prospects/paths";
import { toWhatsAppPhone } from "@/modules/prospects/whatsapp";

function matchesSearch(client: ClientListItem, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (client.name.toLowerCase().includes(normalized)) {
    return true;
  }

  const phone = client.phone ?? "";

  if (phone.toLowerCase().includes(normalized)) {
    return true;
  }

  const queryDigits = normalized.replace(/\D/g, "");

  if (!queryDigits) {
    return false;
  }

  const storedDigits = phone.replace(/\D/g, "");

  if (storedDigits.includes(queryDigits)) {
    return true;
  }

  const whatsappDigits = toWhatsAppPhone(query);

  if (whatsappDigits && storedDigits.includes(whatsappDigits)) {
    return true;
  }

  return (
    queryDigits.startsWith("0") && storedDigits.includes(queryDigits.slice(1))
  );
}

export function ClientList({ clients }: { clients: ClientListItem[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () => clients.filter((client) => matchesSearch(client, query)),
    [clients, query],
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Nom ou numéro"
        inputMode="search"
        enterKeyHint="search"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none ring-slate-900 focus:ring-2"
      />

      {clients.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm leading-relaxed text-slate-600">
            Aucun client. Crée une relance pour en ajouter.
          </p>
          <Link
            href={NEW_FOLLOW_UP_PATH}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-base font-medium text-white"
          >
            + Nouvelle relance
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
          Aucun client trouvé.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((client) => (
            <li key={client.id}>
              <Link
                href={clientPath(client.id)}
                className="flex flex-col gap-1 rounded-2xl border border-slate-200 px-4 py-3"
              >
                <span className="truncate text-base font-semibold text-slate-900">
                  {client.name}
                </span>
                <span className="truncate text-sm text-slate-600">
                  {client.phone || "Pas de numéro"}
                </span>
                {client.nextScheduledAt ? (
                  <span className="text-xs text-slate-500">
                    Prochaine : {formatDateTime(client.nextScheduledAt)}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
