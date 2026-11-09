import { test } from 'node:test';
import assert from 'node:assert/strict';
import { securityQuiz, securityQuestions } from '../src/lib/security-questions';

test('questionário tem 20 questões originais com distribuição planejada', () => {
  assert.equal(securityQuiz.questions, securityQuestions);
  assert.equal(securityQuiz.questions.length, 20);
  const totals = Object.fromEntries(
    [...new Set(securityQuestions.map(question => question.topic))].map(
      topic => [topic, securityQuestions.filter(question => question.topic === topic).length],
    ),
  );
  assert.deepEqual(totals, {
    'Fundamentos': 5,
    'Avaliação de segurança': 3,
    'Identidades e acesso': 3,
    'Segurança de redes': 6,
    'Monitoramento e resposta': 3,
  });
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
