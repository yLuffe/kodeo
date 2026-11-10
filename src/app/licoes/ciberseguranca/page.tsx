import type { Metadata } from 'next';
import KodeoApp from '@/components/KodeoApp';

export const metadata: Metadata = {
  title: 'Desafios de cibersegurança — Kodeo',
  description: '25 questões originais em português, com correção imediata, explicações e revisão.',
};

export default function CybersecurityLessonPage() {
  return <KodeoApp initialSection="courses" initialLessonOpen initialLessonId="sec-quiz"/>;
}
