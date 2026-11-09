import { gamification } from './learning';
import { lessonXP } from './lesson-session';
import type { LessonState } from './lesson-session';
import { completedCount, getLevel, levelThresholds, trails } from './trails';
import type { LearnerProgress, Trail } from './trails';

export function levelProgress(xp: number) {
  const level = getLevel(xp);
  const start = levelThresholds[level - 1];
  const next = levelThresholds[level] ?? null;
  return { level, next, remaining: next === null ? 0 : Math.max(0, next - xp), percent: next === null ? 100 : Math.min(100, Math.max(0, (xp - start) / (next - start) * 100)) };
}

export function learnerProgress(state: LessonState, otherLessons: LessonState[] = []): LearnerProgress {
  const javascript = trails.find(trail => trail.id === 'javascript')!;
  const sessions = [state, ...otherLessons];
  return { xp: gamification.initialXP + sessions.reduce((xp, session) => xp + lessonXP(session), 0), completed: { javascript: javascript.initialCompleted + sessions.filter(session => session.completed).length } };
}

export function trailProgress(trail: Trail, progress: LearnerProgress) {
  const completed = completedCount(trail, progress);
  return { completed, total: trail.steps.length, percent: Math.round(completed / trail.steps.length * 100) };
}

export function totalCompleted(progress: LearnerProgress) {
  return trails.reduce((total, trail) => total + completedCount(trail, progress), 0);
}
