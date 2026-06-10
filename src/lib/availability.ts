export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'
};

export const SHIFTS = ['open', 'mid', 'close'] as const;
export const SHIFT_LABELS: Record<string, string> = {
  open: 'Open (6–11a)',
  mid: 'Midday (11a–3p)',
  close: 'Close (3–7p)'
};

export function shiftKey(day: string, shift: string): string {
  return `${day}-${shift}`;
}

/** Fraction of the job's needed shifts the seeker can cover (0..1). */
export function shiftOverlap(seekerShifts: string[], jobShifts: string[]): number {
  if (jobShifts.length === 0) return 1;
  const have = new Set(seekerShifts);
  const covered = jobShifts.filter((s) => have.has(s)).length;
  return covered / jobShifts.length;
}

export function describeShifts(shifts: string[]): string {
  if (shifts.length === 0) return 'Flexible';
  const byShift = new Map<string, string[]>();
  for (const s of shifts) {
    const [day, shift] = s.split('-');
    if (!byShift.has(shift)) byShift.set(shift, []);
    byShift.get(shift)!.push(DAY_LABELS[day] ?? day);
  }
  return [...byShift.entries()]
    .map(([shift, days]) => `${SHIFT_LABELS[shift]?.split(' ')[0] ?? shift}: ${days.join(', ')}`)
    .join(' · ');
}
