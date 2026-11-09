import { evaluateAnswer } from './answer-validation';
import type { AnswerResult } from './answer-validation';
import { lesson as defaultLesson, type LessonDefinition } from './lesson';
import { gamification } from './learning';

export interface Attempt { questionId: string; answer: string; correct: boolean; submittedAt: string; number: number; xpAwarded: number; review: boolean; }
export interface XPEvent { id: string; amount: number; reason: 'question' | 'lesson'; sourceId: string; createdAt: string; }
export interface LessonState { phase: 'intro' | 'practice' | 'summary'; index: number; drafts: Record<string, string>; results: Record<string, AnswerResult | undefined>; attempts: Attempt[]; xpEvents: XPEvent[]; completed: boolean; review: boolean; reviewOffset: number; }
export type LessonAction = { type: 'start' } | { type: 'draft'; questionId: string; answer: string } | { type: 'submit'; questionId: string; submittedAt: string } | { type: 'retry'; questionId: string } | { type: 'next'; at: string } | { type: 'review' } | { type: 'previous' };
export function initialLessonState(): LessonState { return { phase: 'intro', index: 0, drafts: {}, results: {}, attempts: [], xpEvents: [], completed: false, review: false, reviewOffset: 0 }; }
export const lessonXP = (state: LessonState) => state.xpEvents.reduce((total, event) => total + event.amount, 0);
export function lessonReducer(state: LessonState, action: LessonAction, lesson: LessonDefinition = defaultLesson): LessonState {
  if (action.type === 'start') return state.phase === 'intro' ? { ...state, phase: 'practice' } : state;
  if (action.type === 'review') return state.completed ? { ...state, phase: 'intro', index: 0, drafts: {}, results: {}, review: true, reviewOffset: state.attempts.length } : state;
  if (action.type === 'previous') return state.phase === 'practice' && state.index > 0 ? { ...state, index: state.index - 1 } : state;
  const question = lesson.questions[state.index];
  if (action.type === 'draft') {
    if (state.phase !== 'practice' || question.id !== action.questionId || state.results[question.id]?.correct) return state;
    return { ...state, drafts: { ...state.drafts, [question.id]: action.answer }, results: { ...state.results, [question.id]: undefined } };
  }
  if (action.type === 'retry') return state.results[action.questionId]?.correct ? state : { ...state, results: { ...state.results, [action.questionId]: undefined } };
  if (action.type === 'submit') {
    if (state.phase !== 'practice' || question.id !== action.questionId || state.results[question.id]) return state;
    const answer = state.drafts[question.id] ?? (question.type === 'code' ? question.starter : '');
    const result = evaluateAnswer(question, answer);
    const shouldAward = result.correct && !state.completed && !state.xpEvents.some(event => event.id === `question:${question.id}`);
    const xpAwarded = shouldAward ? question.xp : 0;
    const shouldRecord = !['empty', 'too-long'].includes(result.kind);
    return { ...state, results: { ...state.results, [question.id]: result }, attempts: shouldRecord ? [...state.attempts, { questionId: question.id, answer, correct: result.correct, submittedAt: action.submittedAt, number: state.attempts.slice(state.reviewOffset).filter(attempt => attempt.questionId === question.id).length + 1, xpAwarded, review: state.review }] : state.attempts, xpEvents: shouldAward ? [...state.xpEvents, { id: `question:${question.id}`, amount: xpAwarded, reason: 'question', sourceId: question.id, createdAt: action.submittedAt }] : state.xpEvents };
  }
  if (action.type === 'next') {
    if (state.phase !== 'practice' || !state.results[question.id]?.correct) return state;
    if (state.index < lesson.questions.length - 1) return { ...state, index: state.index + 1 };
    const shouldAward = !state.completed && !state.xpEvents.some(event => event.id === `lesson:${lesson.id}`);
    return { ...state, phase: 'summary', completed: true, xpEvents: shouldAward ? [...state.xpEvents, { id: `lesson:${lesson.id}`, amount: gamification.lessonXP, reason: 'lesson', sourceId: lesson.id, createdAt: action.at }] : state.xpEvents };
  }
  return state;
}
