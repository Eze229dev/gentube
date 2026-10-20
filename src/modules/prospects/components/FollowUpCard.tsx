"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  bucketClass,
  bucketLabel,
  getFollowUpBucket,
} from "@/modules/prospects/buckets";
import { formatAmount, formatDateTime, formatTime } from "@/modules/prospects/format";
import { markFollowUpCompleted } from "@/modules/prospects/actions";
import { WhatsAppButton } from "@/modules/prospects/components/WhatsAppButton";
import type { FollowUpStatus } from "@/modules/prospects/status";
import type { DashboardFollowUp } from "@/modules/prospects/queries";

export function FollowUpCard({ followUp }: { followUp: DashboardFollowUp }) {
  const router = useRouter();
  const [status, setStatus] = useState<FollowUpStatus>(followUp.status);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const bucket = getFollowUpBucket({
    status,
    scheduled_at: followUp.scheduled_at,
  });
  const amount = formatAmount(followUp.amount);
  const when =
    bucket === "today"
      ? formatTime(followUp.scheduled_at)
      : formatDateTime(followUp.scheduled_at);

  function handleComplete() {
    const previous = status;
    setStatus("completed");
    setCompleteError(null);

    startTransition(async () => {
      const result = await markFollowUpCompleted(followUp.id);

      if (result.error) {
        setStatus(previous);
        setCompleteError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-900">
            {followUp.client_name}
          </p>
          <p className="truncate text-sm text-slate-600">
            {followUp.product || "Sans produit"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${bucketClass(bucket, status)}`}
        >
          {bucketLabel(bucket, status)}
        </span>
      </div>

      <p className="text-sm text-slate-600">
        {amount ? `${amount} · ` : null}
        {when}
      </p>

      {status === "pending" ? (
        <>
          <WhatsAppButton
            phone={followUp.client_phone}
            clientName={followUp.client_name}
            product={followUp.product}
            message={followUp.message}
            label="Relancer sur WhatsApp"
          />
          <button
            type="button"
            onClick={handleComplete}
            disabled={pending}
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 px-4 text-base font-medium text-slate-800 disabled:opacity-60"
          >
            ✓ Marquer comme effectuée
          </button>
        </>
      ) : null}

      {completeError ? (
        <p className="text-sm text-red-600" role="alert">
          {completeError}
        </p>
      ) : null}
    </article>
  );
}
