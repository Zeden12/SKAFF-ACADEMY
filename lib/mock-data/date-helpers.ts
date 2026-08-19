/**
 * Generates ISO timestamps relative to "now" so schedule/activity mock data always looks
 * current regardless of when the app is actually run, instead of drifting into the past.
 */
export function relativeDay(offsetDays: number, hour = 9, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}
