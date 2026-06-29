const DAY_MS = 24 * 60 * 60 * 1000;

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgoUtc(days: number, from = new Date()): string {
  return new Date(from.getTime() - days * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetweenUtc(fromIso: string, to = new Date()): number {
  const fromDate = new Date(fromIso);
  if (Number.isNaN(fromDate.getTime())) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.max(0, (to.getTime() - fromDate.getTime()) / DAY_MS);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(new Date(iso));
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(new Date(`${isoDate}T00:00:00.000Z`));
}
