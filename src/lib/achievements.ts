import type { LessonState } from './lesson-session';

function dayKey(date: Date) {
  return [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
}

export function studyWeek(sessions: LessonState[], now = new Date()) {
  const days = new Set(sessions.flatMap(session => session.attempts.map(attempt => dayKey(new Date(attempt.submittedAt)))));
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + 6) % 7);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    return { name: date.toLocaleDateString('pt-BR', { weekday: 'long' }), done: days.has(dayKey(date)) };
  });
}

export function achievementProgress(sessions: Record<string, LessonState>) {
  const states = Object.values(sessions);
  const events = states.flatMap(state => state.xpEvents);
  const answers = events.filter(event => event.reason === 'question').length;
  const completed = states.filter(state => state.completed).length;
  const recovered = states.some(state => {
    const missed = new Set<string>();
    return state.attempts.some(attempt => {
      if (attempt.review) return false;
      if (!attempt.correct) missed.add(attempt.questionId);
      return attempt.correct && missed.has(attempt.questionId);
    });
  });
  return [
    { id: 'start', name: 'Primeiros passos', description: 'Acerte seu primeiro exercício.', current: answers, target: 1, color: 'blue' },
    { id: 'variables', name: 'Mais um passo', description: 'Conclua a lição de variáveis.', current: Number(!!sessions['js-6']?.completed), target: 1, color: 'purple' },
    { id: 'recovery', name: 'Persistente', description: 'Corrija uma resposta depois de errar.', current: Number(recovered), target: 1, color: 'amber' },
    { id: 'accurate', name: 'Na mosca', description: 'Acerte 10 exercícios diferentes.', current: answers, target: 10, color: 'green' },
    { id: 'rhythm', name: 'Pegando o ritmo', description: 'Conclua 3 lições práticas de JavaScript.', current: completed, target: 3, color: 'blue' },
    { id: 'xp', name: 'XP em alta', description: 'Ganhe 250 XP nas atividades.', current: events.reduce((sum, event) => sum + event.amount, 0), target: 250, color: 'amber' },
    { id: 'code', name: 'Mãos no código', description: 'Resolva os dois desafios de código da etapa 6.', current: events.filter(event => event.reason === 'question' && ['points', 'profile'].includes(event.sourceId)).length, target: 2, color: 'green' },
    { id: 'javascript', name: 'Base de JavaScript', description: 'Conclua as 6 lições práticas, das etapas 6 a 11.', current: completed, target: 6, color: 'purple' },
  ];
}
