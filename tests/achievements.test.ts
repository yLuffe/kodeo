import assert from 'node:assert/strict';
import test from 'node:test';
import { achievementProgress, studyWeek } from '../src/lib/achievements';
import { initialLessonState, lessonReducer } from '../src/lib/lesson-session';

test('uma resposta corrigida desbloqueia conquistas sem contar o XP inicial', () => {
  const start = achievementProgress({});
  assert.equal(start.filter(badge => badge.current >= badge.target).length, 0);

  let state = lessonReducer(initialLessonState(), { type: 'start' });
  for (const answer of ['0', '1']) {
    state = lessonReducer(state, { type: 'draft', questionId: 'declarations', answer });
    state = lessonReducer(state, { type: 'submit', questionId: 'declarations', submittedAt: new Date(2026, 10, 9, 12).toISOString() });
  }
  const badges = achievementProgress({ 'js-6': state });
  assert.deepEqual(badges.filter(badge => badge.current >= badge.target).map(badge => badge.id), ['start', 'recovery']);
  assert.equal(badges.find(badge => badge.id === 'xp')?.current, 10);
  assert.equal(studyWeek([state], new Date(2026, 10, 10)).filter(day => day.done).length, 1);
  assert.equal(studyWeek([state], new Date(2026, 10, 17)).filter(day => day.done).length, 0);
});
