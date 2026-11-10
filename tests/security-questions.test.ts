import { test } from 'node:test';
import assert from 'node:assert/strict';
import { securityQuiz, securityQuestions } from '../src/lib/security-questions';

test('questionário tem 25 questões originais com distribuição planejada', () => {
  assert.equal(securityQuiz.questions, securityQuestions);
  assert.equal(securityQuiz.questions.length, 25);
  const totals = Object.fromEntries(
    [...new Set(securityQuestions.map(question => question.topic))].map(
      topic => [topic, securityQuestions.filter(question => question.topic === topic).length],
    ),
  );
  assert.deepEqual(totals, {
    'Fundamentos': 5,
    'Avaliação de segurança': 3,
    'Identidades e acesso': 5,
    'Segurança de redes': 8,
    'Monitoramento e resposta': 3,
    'Arquitetura de segurança': 1,
  });
});

test('cinco cenários avançados são inéditos, distintos e aparecem após os fundamentos', () => {
  const expert = securityQuestions.slice(20);
  assert.deepEqual(expert.map(question => question.id), ['secq-21', 'secq-22', 'secq-23', 'secq-24', 'secq-25']);
  assert.deepEqual(expert.map(question => question.topic), [
    'Identidades e acesso', 'Identidades e acesso',
    'Segurança de redes', 'Segurança de redes', 'Arquitetura de segurança',
  ]);
  assert.ok(expert.every(question => question.difficulty === 'Avançado'));
  assert.ok(expert.every(question => question.context.length > 300));
  assert.ok(expert.every(question => question.explanation.length > 300));
  assert.equal(securityQuestions.reduce((sum, question) => sum + question.xp, 50), 300);
});


test('questões têm quatro alternativas distintas, uma resposta válida e explicações', () => {
  const ids = new Set<string>();
  const titles = new Set<string>();
  for (const question of securityQuestions) {
    assert.equal(ids.has(question.id), false, 'ID duplicado: ' + question.id);
    assert.equal(titles.has(question.title), false, 'Título duplicado: ' + question.title);
    ids.add(question.id);
    titles.add(question.title);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(option => option.trim().toLowerCase())).size, 4);
    assert.equal(Number.isInteger(question.correct), true);
    assert.ok(question.correct >= 0 && question.correct < question.options.length);
    assert.ok(question.title.trim().length > 15);
    assert.ok(question.context.trim().length > 35);
    assert.ok(question.explanation.trim().length > 80);
    assert.ok(question.hint.trim().length > 20);
    assert.equal(question.xp, 10);
    assert.ok(['Básico', 'Intermediário', 'Avançado'].includes(question.difficulty));
  }
  assert.equal(securityQuiz.completionXP, 50);
});

test('questões não apresentam rótulos de certificação', () => {
  const forbidden = /\b(?:PenTest\+|SC-300|SC-200|SCOR|CCNP Security)\b/i;
  for (const question of securityQuestions) {
    assert.equal(forbidden.test([question.title, question.context, question.explanation, ...question.options].join(' ')), false, question.id);
  }
});

import { courseLesson } from '../src/lib/course-lessons';
import { achievementProgress } from '../src/lib/achievements';
import { initialLessonState, lessonReducer } from '../src/lib/lesson-session';
import { readProfile } from '../src/lib/local-profile';
import { learnerProgress } from '../src/lib/progress';

test('concluir Cyber salva o perfil e soma XP sem avançar a trilha de JavaScript', () => {
  const lesson = courseLesson('sec-quiz');
  let session = lessonReducer(initialLessonState(), { type: 'start' }, lesson);
  for (const question of securityQuestions) {
    session = lessonReducer(session, { type: 'draft', questionId: question.id, answer: String(question.correct) }, lesson);
    session = lessonReducer(session, { type: 'submit', questionId: question.id, submittedAt: '2026-11-09' }, lesson);
    session = lessonReducer(session, { type: 'next', at: '2026-11-09' }, lesson);
  }
  const profile = readProfile(JSON.stringify({ firstName: 'Ana', lessons: { 'sec-quiz': session }, securityExplored: true }))!;
  const progress = learnerProgress(initialLessonState(), [], profile.lessons['sec-quiz']);
  assert.deepEqual(progress.completed, { javascript: 5, security: 1 });
  assert.equal(progress.xp, 1540);
  assert.equal(achievementProgress(profile.lessons).find(badge => badge.id === 'cyber')?.current, 1);
});
