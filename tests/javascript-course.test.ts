import assert from 'node:assert/strict';
import test from 'node:test';
import { javascriptLessons, lessonForProfile } from '../src/lib/javascript-course';
import { initialLessonState, lessonReducer, lessonXP } from '../src/lib/lesson-session';
import { firstNameFrom, readProfile, type LocalProfile } from '../src/lib/local-profile';
import { learnerProgress } from '../src/lib/progress';
import { stepStatus, trails } from '../src/lib/trails';

test('o perfil mantém primeiro nome, rascunho e XP ao ler os dados salvos', () => {
  const firstName = firstNameFrom('  Júlia Silva ');
  const lesson = lessonForProfile('js-6', firstName);
  const question = lesson.questions[4];
  assert.equal(question.type, 'code');
  const answer = 'const nome = "Júlia";\nconst ativo = true;';
  const state = { ...initialLessonState(), phase: 'practice' as const, index: 4 };
  const draft = lessonReducer(state, { type: 'draft', questionId: question.id, answer }, lesson);
  const profile: LocalProfile = { firstName, lessons: { 'js-6': draft }, securityExplored: true };
  const loaded = readProfile(JSON.stringify(profile))!;
  assert.deepEqual(loaded, JSON.parse(JSON.stringify(profile)));
  const result = lessonReducer(loaded.lessons['js-6'], { type: 'submit', questionId: question.id, submittedAt: '2026-01-01' }, lesson);
  assert.equal(result.results[question.id]?.correct, true);
  assert.equal(lessonXP(result), 10);
  assert.equal(readProfile('{'), null);
});

test('as seis etapas práticas podem ser concluídas em sequência e revisão não duplica XP', () => {
  const trail = trails.find(trail => trail.id === 'javascript')!;
  const sessions = [];
  for (let stage = 6; stage <= 11; stage++) {
    const lesson = javascriptLessons[`js-${stage}`];
    const progress = learnerProgress(sessions[0] ?? initialLessonState(), sessions.slice(1));
    assert.notEqual(stepStatus(trail, stage - 1, progress), 'locked', lesson.title);
    assert.equal(trail.steps[stage - 1].playable, true);
    let state = lessonReducer(initialLessonState(), { type: 'start' }, lesson);
    for (const question of lesson.questions) {
      const answer = question.type === 'choice' ? String(question.correct) : question.type === 'text' ? question.accepted[0] : question.solution;
      state = lessonReducer(state, { type: 'draft', questionId: question.id, answer }, lesson);
      state = lessonReducer(state, { type: 'submit', questionId: question.id, submittedAt: '2026-01-01' }, lesson);
      assert.equal(state.results[question.id]?.correct, true);
      state = lessonReducer(state, { type: 'next', at: '2026-01-01' }, lesson);
    }
    assert.equal(state.completed, true);
    assert.equal(lessonXP(lessonReducer(state, { type: 'review' }, lesson)), lessonXP(state));
    sessions.push(state);
  }
  assert.equal(learnerProgress(sessions[0], sessions.slice(1)).completed.javascript, 11);
});
