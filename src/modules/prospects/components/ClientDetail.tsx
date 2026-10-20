import Link from "next/link";

import type { ClientDetail as ClientDetailData } from "@/modules/prospects/clients";
import { WhatsAppButton } from "@/modules/prospects/components/WhatsAppButton";
import { formatAmount, formatDateTime } from "@/modules/prospects/format";
import { CLIENTS_PATH, newFollowUpPath } from "@/modules/prospects/paths";
import { statusClass, statusLabel } from "@/modules/prospects/status";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl bg-slate-50 px-2 py-3">
      <p className="text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
      <p className="mt-0.5 text-center text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

export function ClientDetail({ client }: { client: ClientDetailData }) {
  const next = client.nextFollowUp;
  const nextAmount = next ? formatAmount(next.amount) : null;

  return (
    <section className="flex min-h-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href={CLIENTS_PATH}
          className="text-sm font-medium text-slate-600"
        >
          ← Clients
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {client.name}
        </h1>
        <p className="text-sm text-slate-600">
          {client.phone || "Pas de numéro"}
        </p>
      </div>

      <div className="flex gap-2">
        <Stat label="Effectuées" value={client.completedCount} />
        <Stat label="En attente" value={client.pendingCount} />
      </div>

      <div className="rounded-2xl bg-slate-50 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Prochaine relance
        </p>
        {next ? (
          <p className="mt-1 text-sm leading-relaxed text-slate-800">
            {formatDateTime(next.scheduled_at)}
            {next.product ? ` · ${next.product}` : null}
            {nextAmount ? ` · ${nextAmount}` : null}
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600">
            Aucune relance en attente.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <WhatsAppButton
          phone={client.phone}
          clientName={client.name}
          product={next?.product ?? null}
          message={next?.message ?? null}
          label="Ouvrir WhatsApp"
        />
        <Link
          href={newFollowUpPath(client.id)}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-base font-medium text-white"
        >
          + Nouvelle relance
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-slate-500">Historique</h2>

        {client.history.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
            Aucune relance pour ce client.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {client.history.map((item) => {
              const amount = formatAmount(item.amount);

              return (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.product || "Sans produit"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDateTime(item.scheduled_at)}
                      {amount ? ` · ${amount}` : null}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
