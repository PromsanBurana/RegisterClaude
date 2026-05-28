import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getCourses } from '../api';
import {
  courses as DEFAULT_COURSES,
  type Course,
} from '../data/courses';

type CoursesState = {
  courses: Course[];
  loading: boolean;
  /** Re-fetch courses from the server (e.g. after admin mutations). */
  refresh: () => Promise<void>;
};

const CoursesContext = createContext<CoursesState | null>(null);

/**
 * Provides the live course list (with their batches) from the server.
 * Falls back to the bundled defaults while the first fetch resolves
 * so the UI doesn't pop in empty.
 */
export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const list = await getCourses();
      if (!Array.isArray(list) || list.length === 0) return;
      // Merge: keep the bundled static metadata (highlights, audience,
      // accent, icon, …) and only swap in `batches` from the server.
      // This avoids `undefined.map` crashes when consumers reach for
      // metadata fields that the server never sends.
      const merged: Course[] = DEFAULT_COURSES.map((defaultCourse) => {
        const fromServer = list.find((c) => c.id === defaultCourse.id);
        return fromServer
          ? { ...defaultCourse, batches: fromServer.batches }
          : defaultCourse;
      });
      setCourses(merged);
    } catch (err) {
      console.warn('[courses] fetch failed, using bundled defaults', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<CoursesState>(
    () => ({ courses, loading, refresh }),
    [courses, loading, refresh],
  );

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
}

export function useCourses(): CoursesState {
  const ctx = useContext(CoursesContext);
  if (!ctx) {
    throw new Error('useCourses must be used inside <CoursesProvider>');
  }
  return ctx;
}

/** Convenience: lookup a course by id from the current context. */
export function useCourseById(id: string | null | undefined): Course | undefined {
  const { courses } = useCourses();
  if (!id) return undefined;
  return courses.find((c) => c.id === id);
}
