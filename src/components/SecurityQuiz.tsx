'use client';

import { useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, LinearProgress, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Lightbulb, RotateCcw, ShieldCheck, XCircle, Zap } from 'lucide-react';
import { securityQuiz } from '@/lib/security-questions';

interface Props {
  open: boolean;
  mode: 'light' | 'dark';
  onExit: () => void;
  completed: boolean;
  onAwardQuestion: (questionId: string) => void;
  onComplete: () => void;
}

/** Questionário independente: mantém estado ao sair e não duplica recompensas na revisão. */
export function SecurityQuiz({ open, mode, completed, onExit, onAwardQuestion, onComplete }: Props) {
  const [phase, setPhase] = useState<'intro' | 'practice' | 'summary'>('intro');
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hintVisible, setHintVisible] = useState(false);
  const [review, setReview] = useState(false);
  const questions = securityQuiz.questions;
  const question = questions[index];
  const answered = Object.prototype.hasOwnProperty.call(answers, question.id);
  const right = answered && answers[question.id] === question.correct;
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(item => answers[item.id] === item.correct).length;
  const letter = (value: number) => String.fromCharCode(65 + value);
  function move(to: number) {
    setIndex(to);
    const nextId = questions[to].id;
    setSelection(Object.prototype.hasOwnProperty.call(answers, nextId) ? answers[nextId] : null);
    setHintVisible(false);
  }
  function verify() {
    if (answered || selection === null) return;
    setAnswers(current => ({ ...current, [question.id]: selection }));
    if (!review && !completed && selection === question.correct) onAwardQuestion(question.id);
  }
  function next() {
    if (!answered) return;
    if (index < questions.length - 1) return move(index + 1);
    setPhase('summary');
    if (!completed) onComplete();
  }
  function startReview() {
    setReview(true);
    setPhase('practice');
    setIndex(0);
    setSelection(null);
    setAnswers({});
    setHintVisible(false);
  }
  const pageBackground = mode === 'dark' ? '#101722' : '#f6f8fc';
  const panelBackground = mode === 'dark' ? '#192333' : '#ffffff';
  const panelBorder = mode === 'dark' ? '#354356' : '#dee4ee';
  return <Dialog fullScreen open={open} onClose={onExit} aria-labelledby="security-quiz-title">
    <Box sx={{ minHeight: '100vh', bgcolor: pageBackground, color: 'text.primary' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, px: { xs: 2, md: 5 }, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: panelBackground }}>
        <Button startIcon={<ArrowLeft size={17}/>} onClick={onExit}>Sair e continuar depois</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}><ShieldCheck size={22}/><Typography variant="subtitle1" fontWeight={800}>kodeo.</Typography></Box>
        <Chip size="small" label="20 exercícios originais" sx={{ display: { xs: 'none', sm: 'flex' } }}/>
      </Box>
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><BookOpen size={16}/>{securityQuiz.course} · {securityQuiz.module}</Typography>
        {phase === 'intro' ? <Box>
          <Typography variant="overline" color="primary">PRÁTICA GUIADA</Typography>
          <Typography id="security-quiz-title" variant="h3" fontWeight={800} sx={{ fontSize: { xs: 30, sm: 42 }, mt: 1, mb: 2 }}>Desafios de cibersegurança</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 700, mb: 3 }}>Resolva 20 situações fictícias, dos fundamentos à análise de incidentes. Cada exercício apresenta quatro alternativas, uma dica e uma explicação após a resposta. As questões não são reproduções de exames.</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            <Chip icon={<BookOpen size={15}/>} label="20 questões"/><Chip icon={<Clock3 size={15}/>} label="Cerca de 25 minutos"/><Chip icon={<Zap size={15}/>} label={review || completed ? 'Revisão sem novo XP' : 'Até 250 XP'}/>
          </Box>
          {completed && <Alert severity="info" sx={{ mb: 3 }}>Você já concluiu este questionário. Repetir a atividade não concede XP novamente.</Alert>}
          <Button size="large" variant="contained" endIcon={<ArrowRight size={18}/>} onClick={() => setPhase('practice')}>{review ? 'Iniciar revisão' : 'Começar questões'}</Button>
        </Box> : phase === 'summary' ? <Box>
          <Typography variant="overline" color="primary">QUESTIONÁRIO CONCLUÍDO</Typography>
          <Typography id="security-quiz-title" variant="h3" sx={{ fontSize: { xs: 30, sm: 40 }, fontWeight: 800, my: 2 }}>Resultado da prática</Typography>
          <Box sx={{ p: 4, bgcolor: panelBackground, border: '1px solid', borderColor: panelBorder, borderRadius: 3, mb: 3 }}>
            <Typography variant="h2" fontWeight={800}>{correctCount} de {questions.length}</Typography>
            <Typography color="text.secondary">respostas corretas · {Math.round(100 * correctCount / questions.length)}% de aproveitamento</Typography>
            <LinearProgress variant="determinate" value={100 * correctCount / questions.length} sx={{ mt: 3, height: 9, borderRadius: 3 }}/>
            <Typography sx={{ mt: 2 }} color="text.secondary">{review || completed ? 'Revisão concluída. Nenhum XP adicional foi concedido.' : 'Primeira conclusão registrada na trilha. Você pode revisar todas as questões sem duplicar recompensas.'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}><Button variant="contained" onClick={onExit} endIcon={<ArrowRight size={17}/>}>Voltar à trilha</Button><Button startIcon={<RotateCcw size={17}/>} variant="outlined" onClick={startReview}>Refazer as questões</Button></Box>
        </Box> : <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 1 }}>
            <Typography variant="overline" color="primary">{review ? 'REVISÃO' : 'PRÁTICA'} · Questão {index + 1} de {questions.length}</Typography>
            <Typography variant="body2" color="text.secondary">{answeredCount} respondidas</Typography>
          </Box>
          <LinearProgress variant="determinate" value={100 * answeredCount / questions.length} sx={{ height: 7, borderRadius: 3, mb: 3 }}/>
          <Box sx={{ p: { xs: 2.5, md: 4 }, bgcolor: panelBackground, border: '1px solid', borderColor: panelBorder, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}><Chip label={question.topic} variant="outlined" size="small"/><Chip label={question.difficulty} variant="outlined" size="small"/></Box>
            <Typography variant="h4" id="security-quiz-title" sx={{ fontWeight: 800, fontSize: { xs: 22, sm: 27 }, mb: 2 }}>{question.title}</Typography>
            <Typography sx={{ lineHeight: 1.75, mb: 3 }}>{question.context}</Typography>
            <Box role="radiogroup" aria-labelledby="security-quiz-title" sx={{ display: 'grid', gap: 1.25 }}>
              {question.options.map((option, optionIndex) => {
                const selected = selection === optionIndex;
                const isCorrect = answered && optionIndex === question.correct;
                const isWrong = answered && selected && optionIndex !== question.correct;
                return <Box key={optionIndex} component="button" type="button" role="radio" aria-checked={selected} disabled={answered} onClick={() => setSelection(optionIndex)}
                  sx={{ width: '100%', cursor: answered ? 'default' : 'pointer', font: 'inherit', color: 'text.primary', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.75, bgcolor: isCorrect ? (mode === 'dark' ? '#16352f' : '#e6f4ed') : isWrong ? (mode === 'dark' ? '#3d2429' : '#fff0ef') : selected ? (mode === 'dark' ? '#223b58' : '#eaf2ff') : 'transparent', border: '1px solid', borderColor: isCorrect ? 'success.main' : isWrong ? 'error.main' : selected ? 'primary.main' : panelBorder, borderRadius: 2, '&:hover': { borderColor: answered ? undefined : 'primary.main' }, '&:disabled': { opacity: 1 } }}>
                  <Box component="span" aria-hidden="true" sx={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: selected ? 'primary.main' : 'text.secondary', bgcolor: selected ? 'primary.main' : 'transparent', boxShadow: selected ? 'inset 0 0 0 3px ' + panelBackground : 'none', flexShrink: 0 }}/>
                  <Typography component="span" fontWeight={700}>{letter(optionIndex)}.</Typography>
                  <Typography component="span" sx={{ flex: 1, overflowWrap: 'anywhere' }}>{option}</Typography>
                  {isCorrect && <CheckCircle2 size={20} color="#23815b"/>}{isWrong && <XCircle size={20} color="#c83a3a"/>}
                </Box>;
              })}
            </Box>
            {answered && <Alert severity={right ? 'success' : 'error'} sx={{ mt: 3 }} icon={right ? <CheckCircle2 size={22}/> : <XCircle size={22}/>}>
              <Typography fontWeight={800}>{right ? 'Resposta correta' : `Resposta incorreta. A alternativa correta é ${letter(question.correct)}.`}</Typography>
              <Typography sx={{ mt: 1, whiteSpace: 'pre-line' }}>{question.explanation}</Typography>
              {right && !review && !completed && <Typography fontWeight={700} sx={{ mt: 1 }}>+{question.xp} XP</Typography>}
            </Alert>}
            {hintVisible && !answered && <Alert severity="info" icon={<Lightbulb size={20}/>} sx={{ mt: 2 }}>{question.hint}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap', mt: 3 }}>
              <Button onClick={() => setHintVisible(value => !value)} disabled={answered} startIcon={<Lightbulb size={17}/>}>{hintVisible ? 'Ocultar dica' : 'Mostrar dica'}</Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => move(index - 1)} disabled={index === 0} startIcon={<ArrowLeft size={16}/>}>Anterior</Button>
                {answered ? <Button variant="contained" onClick={next} endIcon={<ArrowRight size={17}/>}>{index === questions.length - 1 ? 'Ver resultado' : 'Próxima questão'}</Button> : <Button variant="contained" onClick={verify} disabled={selection === null}>Verificar resposta</Button>}
              </Box>
            </Box>
          </Box>
          <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">A resposta é conferida antes de avançar. Você pode voltar às questões anteriores e consultar suas explicações. O progresso permanece nesta sessão.</Typography>
        </Box>}
      </Box>
    </Box>
  </Dialog>;
}
