"use client";

export default function ClientsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Clients
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          Impossible de charger vos clients.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-base font-medium text-white"
      >
        Réessayer
      </button>
    </section>
  );
}
