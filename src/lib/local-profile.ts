import { isCourseLesson, courseLesson } from './course-lessons';
import type { LessonState } from './lesson-session';

export const PROFILE_KEY = 'kodeo:profile:v1';
export type LocalProfile = { firstName: string; lessons: Record<string, LessonState>; securityExplored: boolean };

export function firstNameFrom(value: string) {
  return (value.trim().split(/\s+/u)[0] ?? '').slice(0, 40);
}

export function readProfile(raw: string | null): LocalProfile | null {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as Partial<LocalProfile> | null;
    if (typeof saved?.firstName !== 'string' || !firstNameFrom(saved.firstName)) return null;
    const lessons: LocalProfile['lessons'] = {};
    for (const [id, state] of Object.entries(saved.lessons ?? {})) {
      if (!isCourseLesson(id) || !state ||
          !['intro', 'practice', 'summary'].includes(state.phase) ||
          !Number.isInteger(state.index) || state.index < 0 || state.index >= courseLesson(id).questions.length ||
          !state.drafts || !state.results || !Array.isArray(state.attempts) || !Array.isArray(state.xpEvents) ||
          state.xpEvents.some(event => !event || !Number.isFinite(event.amount))) continue;
      lessons[id] = state;
    }
    return { firstName: firstNameFrom(saved.firstName), lessons, securityExplored: saved.securityExplored === true };
  } catch {
    return null;
  }
}
