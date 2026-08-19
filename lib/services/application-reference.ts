/** Generates a distinct mock application reference, e.g. "SKA-APP-2026-0001". */
export function generateApplicationReference(sequence: number, year = new Date().getFullYear()): string {
  return `SKA-APP-${year}-${String(sequence).padStart(4, "0")}`;
}
