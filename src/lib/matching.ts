import { distanceMiles } from '$lib/geo';
import { shiftOverlap } from '$lib/availability';
import type { Job, Seeker, Shop } from '$lib/types';

export interface ScoredJob {
  job: Job;
  shop: Shop;
  distance: number;
  overlap: number;
  score: number;
}

/**
 * Score a job for a seeker: 0–100.
 * Hard filter: shop must be inside the seeker's radius.
 * 50% proximity (closer is better), 50% shift coverage.
 */
export function scoreJobs(seeker: Seeker, jobs: Job[]): ScoredJob[] {
  const results: ScoredJob[] = [];
  for (const job of jobs) {
    const shop = job.shops;
    if (!shop || !job.is_open) continue;
    const distance = distanceMiles(seeker, shop);
    if (distance > seeker.radius_miles) continue;
    const overlap = shiftOverlap(seeker.shifts, job.shifts);
    const proximity = 1 - distance / Math.max(seeker.radius_miles, 0.1);
    const score = Math.round((proximity * 0.5 + overlap * 0.5) * 100);
    results.push({ job, shop, distance, overlap, score });
  }
  return results.sort((a, b) => b.score - a.score);
}

export interface ScoredSeeker {
  seeker: Seeker;
  distance: number;
  overlap: number;
  score: number;
}

/** The owner-side mirror: rank nearby candidates for a shop's job. */
export function scoreSeekers(shop: Shop, jobShifts: string[], seekers: Seeker[]): ScoredSeeker[] {
  const results: ScoredSeeker[] = [];
  for (const seeker of seekers) {
    const distance = distanceMiles(seeker, shop);
    if (distance > seeker.radius_miles) continue;
    const overlap = shiftOverlap(seeker.shifts, jobShifts);
    const proximity = 1 - distance / Math.max(seeker.radius_miles, 0.1);
    const score = Math.round((proximity * 0.5 + overlap * 0.5) * 100);
    results.push({ seeker, distance, overlap, score });
  }
  return results.sort((a, b) => b.score - a.score);
}
