import { DateTime } from "luxon";

export function formatDate(iso: string): string {
  return DateTime.fromISO(iso).toFormat("dd.MM.yyyy");
}

export function formatRelative(iso: string): string {
  return DateTime.fromISO(iso).toRelative() ?? "";
}

export function daysAgo(iso: string): number {
  return Math.floor(DateTime.now().diff(DateTime.fromISO(iso), "days").days);
}

export function isToday(iso: string): boolean {
  return DateTime.fromISO(iso).hasSame(DateTime.now(), "day");
}

export function isYesterday(iso: string): boolean {
  return DateTime.fromISO(iso).hasSame(DateTime.now().minus({ days: 1 }), "day");
}

export function nowIso(): string {
  return DateTime.now().toISO() as string;
}
