import { isToday, todayKey } from "./format";
import { statusClass, statusLabel, type FollowUpStatus } from "./status";

export type FollowUpBucket = "today" | "overdue" | "upcoming" | "done";

export function isOverduePending(
  followUp: { status: FollowUpStatus; scheduled_at: string },
  now: Date = new Date(),
): boolean {
  return (
    followUp.status === "pending" &&
    new Date(followUp.scheduled_at).getTime() < now.getTime()
  );
}

export function getFollowUpBucket(
  followUp: { status: FollowUpStatus; scheduled_at: string },
  now: Date = new Date(),
): FollowUpBucket {
  if (followUp.status !== "pending") {
    return "done";
  }

  if (isOverduePending(followUp, now)) {
    return "overdue";
  }

  if (isToday(followUp.scheduled_at, todayKey(now))) {
    return "today";
  }

  return "upcoming";
}

export function groupFollowUps<
  T extends { status: FollowUpStatus; scheduled_at: string },
>(
  followUps: T[],
  now: Date = new Date(),
): { today: T[]; overdue: T[]; upcoming: T[] } {
  const today: T[] = [];
  const overdue: T[] = [];
  const upcoming: T[] = [];

  for (const item of followUps) {
    switch (getFollowUpBucket(item, now)) {
      case "today":
        today.push(item);
        break;
      case "overdue":
        overdue.push(item);
        break;
      case "upcoming":
        upcoming.push(item);
        break;
      default:
        break;
    }
  }

  return { today, overdue, upcoming };
}

export function bucketLabel(
  bucket: FollowUpBucket,
  status: FollowUpStatus,
): string {
  if (bucket === "overdue") {
    return "En retard";
  }

  return statusLabel(status);
}

export function bucketClass(
  bucket: FollowUpBucket,
  status: FollowUpStatus,
): string {
  if (bucket === "overdue") {
    return "bg-red-50 text-red-800";
  }

  return statusClass(status);
}
