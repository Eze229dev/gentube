import type { Metadata } from "next";

import { LogoutButton } from "@/modules/auth/components/LogoutButton";
import { requireUser } from "@/modules/auth/session";
import { FollowUpCard } from "@/modules/prospects/components/FollowUpCard";
import { NewFollowUpButton } from "@/modules/prospects/components/NewFollowUpButton";
import {
  getDashboardData,
  type DashboardFollowUp,
} from "@/modules/prospects/queries";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

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

function FollowUpSection({
  title,
  empty,
  followUps,
}: {
  title: string;
  empty: string;
  followUps: DashboardFollowUp[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-slate-500">{title}</h2>
      {followUps.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm leading-relaxed text-slate-600">
          {empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {followUps.map((followUp) => (
            <FollowUpCard key={followUp.id} followUp={followUp} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const user = await requireUser();
  const data = await getDashboardData(user);
  const { created } = await searchParams;

  return (
    <section className="flex min-h-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-slate-500">Bonjour</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {data.displayName}
        </h1>
      </div>

      {created === "1" ? (
        <p
          role="status"
          className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800"
        >
          Relance créée.
        </p>
      ) : null}

      <div className="flex gap-2">
        <Stat label="Aujourd’hui" value={data.todayCount} />
        <Stat label="En retard" value={data.overdueCount} />
        <Stat label="À venir" value={data.upcomingCount} />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <FollowUpSection
          title="À relancer aujourd’hui"
          empty="Aucune relance aujourd’hui."
          followUps={data.todayFollowUps}
        />
        <FollowUpSection
          title="En retard"
          empty="Aucune relance en retard."
          followUps={data.overdueFollowUps}
        />
        <FollowUpSection
          title="À venir"
          empty="Aucune relance à venir."
          followUps={data.upcomingFollowUps}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <NewFollowUpButton />
        <LogoutButton />
      </div>
    </section>
  );
}
