import { isJavascriptLesson, javascriptLessons } from './javascript-course';
import type { LessonState } from './lesson-session';
import { securityQuestions } from './security-questions';

export const PROFILE_KEY = 'kodeo:profile:v1';
export type SecurityProgress = { awardedQuestionIds: string[]; completed: boolean };
export type LocalProfile = { firstName: string; lessons: Record<string, LessonState>; securityExplored: boolean; security?: SecurityProgress };

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
      if (!isJavascriptLesson(id) || !state ||
          !['intro', 'practice', 'summary'].includes(state.phase) ||
          !Number.isInteger(state.index) || state.index < 0 || state.index >= javascriptLessons[id].questions.length ||
          !state.drafts || !state.results || !Array.isArray(state.attempts) || !Array.isArray(state.xpEvents) ||
          state.xpEvents.some(event => !event || !Number.isFinite(event.amount))) continue;
      lessons[id] = state;
    }
    const validIds = new Set(securityQuestions.map(question => question.id));
    const awardedQuestionIds = [...new Set(Array.isArray(saved.security?.awardedQuestionIds) ? saved.security.awardedQuestionIds.filter(id => typeof id === 'string' && validIds.has(id)) : [])];
    const security = saved.security ? { security: { awardedQuestionIds, completed: saved.security.completed === true } } : {};
    return { firstName: firstNameFrom(saved.firstName), lessons, securityExplored: saved.securityExplored === true, ...security };
  } catch {
    return null;
  }
}
