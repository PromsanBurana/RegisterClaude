import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBatchAvailability } from '../api';
import type { BatchAvailability } from '../types';

export type AvailabilityHelper = {
  data: BatchAvailability[];
  loading: boolean;
  refresh: () => Promise<void>;
  /** Look up a single batch's availability. Returns undefined while loading. */
  lookup: (courseId: string, batchId: string) => BatchAvailability | undefined;
  /** True if every batch in the given course is full. */
  isCourseFull: (courseId: string) => boolean;
};

/**
 * Fetches public batch availability once on mount and exposes lookup helpers.
 * Designed to be lifted into the Landing page so multiple sections share a
 * single fetch (and can refresh together after a successful submission).
 */
export function useBatchAvailability(): AvailabilityHelper {
  const [data, setData] = useState<BatchAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const list = await getBatchAvailability();
      setData(list);
    } catch (err) {
      // Non-critical — UI just falls back to "no data" state
      console.warn('[batches] availability fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return useMemo<AvailabilityHelper>(
    () => ({
      data,
      loading,
      refresh,
      lookup: (courseId, batchId) =>
        data.find((b) => b.courseId === courseId && b.batchId === batchId),
      isCourseFull: (courseId) => {
        const forCourse = data.filter((b) => b.courseId === courseId);
        if (forCourse.length === 0) return false;
        return forCourse.every((b) => b.isFull);
      },
    }),
    [data, loading, refresh],
  );
}

/**
 * Returns a Thai label + tone for a given availability record.
 *  - full          → "ที่นั่งเต็ม"        red
 *  - low (≤3)      → "เหลืออีก N ที่นั่ง"   orange
 *  - medium (4-9)  → "เหลือ N ที่นั่ง"     gray
 *  - high (10+)    → "เหลือ N ที่นั่ง"     green (subtle)
 */
export function describeAvailability(b: BatchAvailability | undefined) {
  if (!b) return { label: '', tone: 'gray' as const };
  if (b.isFull) return { label: 'ที่นั่งเต็ม', tone: 'red' as const };
  if (b.available <= 3)
    return { label: `เหลืออีก ${b.available} ที่นั่ง`, tone: 'orange' as const };
  if (b.available <= 9)
    return { label: `เหลือ ${b.available} ที่นั่ง`, tone: 'gray' as const };
  return { label: `เหลือ ${b.available} ที่นั่ง`, tone: 'green' as const };
}
