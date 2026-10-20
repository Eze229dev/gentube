const TIME_ZONE = "Europe/Paris";

function parisDateKey(value: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

export function todayKey(now: Date = new Date()): string {
  return parisDateKey(now);
}

export function isToday(iso: string, today = todayKey()): boolean {
  return parisDateKey(iso) === today;
}

export function isBeforeToday(iso: string, today = todayKey()): boolean {
  return parisDateKey(iso) < today;
}

export function isAfterToday(iso: string, today = todayKey()): boolean {
  return parisDateKey(iso) > today;
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatAmount(amount: number | string | null): string | null {
  if (amount === null || amount === "") {
    return null;
  }

  const value = typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(value)) {
    return null;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function parisDateAndTimeToIso(
  date: string,
  time: string,
): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})/.exec(time);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59
  ) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const targetUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utc = targetUtc;

  for (let index = 0; index < 4; index += 1) {
    const parts = formatter.formatToParts(new Date(utc));
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value);

    const asParisUtc = Date.UTC(
      read("year"),
      read("month") - 1,
      read("day"),
      read("hour"),
      read("minute"),
      read("second"),
    );

    utc += targetUtc - asParisUtc;
  }

  const verified = formatter.formatToParts(new Date(utc));
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(verified.find((part) => part.type === type)?.value);

  if (
    read("year") !== year ||
    read("month") !== month ||
    read("day") !== day ||
    read("hour") !== hour ||
    read("minute") !== minute
  ) {
    return null;
  }

  return new Date(utc).toISOString();
}
