export type FollowUpStatus = "pending" | "completed" | "cancelled";

export function statusLabel(status: FollowUpStatus): string {
  switch (status) {
    case "completed":
      return "Fait";
    case "cancelled":
      return "Annulé";
    default:
      return "À faire";
  }
}

export function statusClass(status: FollowUpStatus): string {
  switch (status) {
    case "completed":
      return "bg-teal-50 text-teal-800";
    case "cancelled":
      return "bg-slate-100 text-slate-500";
    default:
      return "bg-amber-50 text-amber-800";
  }
}
