import { isJavascriptLesson, lessonForProfile } from './javascript-course';
import type { LessonDefinition } from './lesson';
import { securityQuiz } from './security-questions';

export const securityLessonId = 'sec-quiz';
const securityLesson: LessonDefinition = {
  ...securityQuiz,
  id: securityLessonId,
  introduction: 'Pratique com 20 situações fictícias, dos fundamentos à resposta a incidentes. Cada questão tem uma dica e explica o raciocínio após a resposta.',
  questions: securityQuiz.questions.map(question => ({ ...question, type: 'choice', options: [...question.options] })),
};

export function isCourseLesson(id: string | null): id is string {
  return id === securityLessonId || isJavascriptLesson(id);
}

export function courseLesson(id: string, firstName = ''): LessonDefinition {
  return id === securityLessonId ? securityLesson : lessonForProfile(id, firstName);
}
