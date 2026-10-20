export default function ClientsLoading() {
  return (
    <section className="flex min-h-full flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-28 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
    </section>
  );
}
