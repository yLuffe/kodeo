'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, ToggleButton, ToggleButtonGroup, useMediaQuery } from '@mui/material';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Clock3, Code2, Compass, Flag, GraduationCap, LayoutList, LockKeyhole, Map, Play, ShieldCheck, Target, Terminal, Trophy, X, Zap } from 'lucide-react';
import { accessReasons, completedCount, getLevel, statusLabels, stepReasons, stepStatus, trails, trailStatus } from '@/lib/trails';
import type { LearnerProgress, StepStatus, Trail, TrailId } from '@/lib/trails';
import { primers } from '@/lib/javascript-course';
import './trails.css';

type Filter = 'all' | StepStatus;
const filters: { id: Filter; label: string }[] = [{ id: 'all', label: 'Todas' }, { id: 'current', label: 'Em andamento' }, { id: 'available', label: 'Disponíveis' }, { id: 'completed', label: 'Concluídas' }, { id: 'locked', label: 'Bloqueadas' }];
const icons = { code: Code2, shield: ShieldCheck, terminal: Terminal };
const stepIcons = { completed: Check, current: Play, available: BookOpen, locked: LockKeyhole };
const columns = [160, 450, 740];
function coordinates(index: number) { const row = Math.floor(index / 3); const col = row % 2 === 0 ? index % 3 : 2 - index % 3; return { x: columns[col], y: 90 + row * 210 }; }
function pathFor(count: number, mobile = false) {
  return Array.from({ length: count }, (_, index) => {
    const point = mobile ? { x: index % 2 === 0 ? 108 : 252, y: 75 + index * 165 } : coordinates(index);
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = mobile ? { x: (index - 1) % 2 === 0 ? 108 : 252, y: 75 + (index - 1) * 165 } : coordinates(index - 1);
    const midY = (previous.y + point.y) / 2;
    if (mobile || previous.y !== point.y) return `C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
    return `L ${point.x} ${point.y}`;
  }).join(' ');
}

export function TrailExplorer({ progress, selectedTrail, onSelectTrail, onOpenLesson }: { progress: LearnerProgress; selectedTrail: TrailId; onSelectTrail: (id: TrailId) => void; onOpenLesson: (id: string) => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const compact = useMediaQuery('(max-width:1024px)', { defaultMatches: true });
  const [preferredView, setView] = useState<'map' | 'list' | null>(null);
  const view = preferredView ?? (compact ? 'list' : 'map');
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const xp = progress.xp;
  useEffect(() => { setSelectedStep(null); }, [selectedTrail]);
  const filtered = trails.filter(trail => filter === 'all' || trailStatus(trail, progress) === filter);
  const active = filtered.find(trail => trail.id === selectedTrail) ?? filtered[0];
  const counts = Object.fromEntries(filters.map(item => [item.id, item.id === 'all' ? trails.length : trails.filter(trail => trailStatus(trail, progress) === item.id).length]));
  const modules = active ? [...new Set(active.steps.map(step => step.module))] : [];
  const complete = active ? completedCount(active, progress) : 0;
  const percent = active ? Math.round(complete / active.steps.length * 100) : 0;
  const requirements = active ? accessReasons(active.requirements, progress) : [];
  const nextIndex = active?.steps.findIndex((_, index) => ['available', 'current'].includes(stepStatus(active, index, progress))) ?? -1;
  const currentStep = active && selectedStep !== null ? active.steps[selectedStep] : null;
  const currentStatus = active && selectedStep !== null ? stepStatus(active, selectedStep, progress) : null;
  const reasons = active && selectedStep !== null ? stepReasons(active, selectedStep, progress) : [];
  function selectTrail(id: TrailId) { setSelectedStep(null); onSelectTrail(id); }
  function changeFilter(nextFilter: Filter) {
    setFilter(nextFilter); setSelectedStep(null);
    const matches = trails.filter(trail => nextFilter === 'all' || trailStatus(trail, progress) === nextFilter);
    if (!matches.some(trail => trail.id === selectedTrail) && matches[0]) onSelectTrail(matches[0].id);
  }
  function selectStep(index: number) { setSelectedStep(index); }
  function focusNext() { nextRef.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); nextRef.current?.focus({ preventScroll: true }); }
  function renderStep(trail: Trail, index: number) {
    const item = trail.steps[index]; const status = stepStatus(trail, index, progress); const Icon = stepIcons[status];
    const { x, y } = coordinates(index);
    return <li key={item.id} className={`path-step ${status}`} style={{ '--step-left': `${x / 9}%`, '--step-top': `${y}px`, '--mobile-left': `${index % 2 === 0 ? 30 : 70}%`, '--mobile-top': `${75 + index * 165}px` } as CSSProperties}>
      {index === nextIndex && <span className="you-are-here">{complete > 0 ? 'VOCÊ ESTÁ AQUI' : 'COMECE AQUI'}</span>}
      <button ref={index === nextIndex ? nextRef : undefined} className="step-button" onClick={() => selectStep(index)} aria-label={`Etapa ${index + 1}: ${item.title}. ${statusLabels[status]}. ${status === 'locked' ? 'Ver requisitos para desbloquear.' : 'Ver detalhes da lição.'}`} aria-current={index === nextIndex ? 'step' : undefined}><Icon size={view === 'map' ? 25 : 19}/></button>
      <div className="step-caption"><span className="step-number">ETAPA {String(index + 1).padStart(2, '0')}</span>{view === 'map' ? <h3>{item.title}</h3> : <h4>{item.title}</h4>}<span className="step-state">{status === 'locked' && <LockKeyhole size={11}/>} {statusLabels[status]}</span>{status === 'locked' && (item.minLevel || item.minXP) && <small>{[item.minLevel && `Nível ${item.minLevel}`, item.minXP && `${item.minXP.toLocaleString('pt-BR')} XP`].filter(Boolean).join(' + ')}</small>}</div>
      {view === 'list' && <button className="text-action" aria-label={`Detalhes de ${item.title}`} onClick={() => selectStep(index)}>Detalhes<ArrowRight size={15}/></button>}
    </li>;
  }
  return <div className="trail-explorer">
    <div className="journey-summary"><div><span className="summary-level"><GraduationCap size={18}/> Nível {getLevel(xp)}</span><span className="summary-xp"><Zap size={17}/> {xp.toLocaleString('pt-BR')} XP acumulados</span></div><p>Seu XP abre novos caminhos. Ele não é gasto ao desbloquear trilhas.</p></div>
    <div className="trail-filter" role="group" aria-label="Filtrar trilhas por status">{filters.map(item => <button key={item.id} className={filter === item.id ? 'selected' : ''} aria-pressed={filter === item.id} onClick={() => changeFilter(item.id)}>{item.label}<span>{counts[item.id]}</span></button>)}</div>
    <div className="trail-workspace"><aside className="trail-library" aria-label="Seleção de trilhas"><div className="library-heading"><Compass size={17}/><h2>Escolha sua trilha</h2></div><p className="library-description" role="status">{filtered.length} {filtered.length === 1 ? 'trilha encontrada' : 'trilhas encontradas'}</p><div className="library-cards">{filtered.map(trail => { const Icon = icons[trail.icon]; const status = trailStatus(trail, progress); const done = completedCount(trail, progress); return <button key={trail.id} className={`library-card ${active?.id === trail.id ? 'selected' : ''}`} aria-pressed={active?.id === trail.id} onClick={() => selectTrail(trail.id)}><span className={`library-icon ${trail.color}`}><Icon size={19}/></span><div><span className="library-category">{trail.category}</span><strong>{trail.title}</strong><span className={`library-state ${status}`}>{status === 'locked' ? <LockKeyhole size={12}/> : status === 'completed' ? <CheckCircle2 size={12}/> : <span className="library-state-dot"/>}{statusLabels[status]}</span>{status === 'locked' ? <small>{[trail.requirements?.minLevel && `Nível ${trail.requirements.minLevel}`, trail.requirements?.minXP && `${trail.requirements.minXP.toLocaleString('pt-BR')} XP`, trail.requirements?.prerequisite && 'Trilha anterior'].filter(Boolean).join(' · ')}</small> : <LinearProgress variant="determinate" value={done / trail.steps.length * 100} aria-label={`Progresso em ${trail.title}`}/>}</div></button>; })}</div><div className="library-help"><Flag size={17}/><p><strong>Um passo de cada vez.</strong> Conclua uma lição para abrir a próxima etapa do percurso.</p></div></aside>
    {active ? <section className="trail-map-panel" aria-labelledby="active-trail-title"><header className="trail-map-heading"><div><span className="trail-kicker">{active.category} <span>·</span> {active.steps.length} etapas</span><h2 id="active-trail-title" aria-live="polite" aria-atomic="true">{active.title}</h2><p>{active.description}</p></div><span className={`map-course-icon ${active.color}`}>{(() => { const Icon = icons[active.icon]; return <Icon size={28}/>; })()}</span></header>
      <div className="map-progress"><div><span>{complete} de {active.steps.length} lições concluídas</span><strong>{percent}%</strong></div><LinearProgress variant="determinate" value={percent} aria-label="Progresso da trilha selecionada"/></div>
      {requirements.length > 0 ? <div className="map-access-banner" role="status"><LockKeyhole size={20}/><div><strong>Este caminho ainda está bloqueado</strong><p>Você pode explorar o mapa. Para começar, cumpra todos os requisitos:</p><ul>{requirements.map(reason => <li key={reason}>{reason}</li>)}</ul></div></div> : complete === active.steps.length ? <div className="map-completed-banner"><Trophy size={21}/><div><strong>Trilha concluída. Sua base está pronta!</strong><p>Selecione uma etapa para consultar seus detalhes e revisar o percurso.</p></div></div> : <div className="map-next-banner"><span className="map-next-icon"><Play size={18}/></span><div><strong>{nextIndex >= 0 ? `Próximo passo: ${active.steps[nextIndex].title}` : 'Você chegou a um novo requisito'}</strong><p>{nextIndex >= 0 ? 'Selecione a etapa para ver o conteúdo e as recompensas.' : 'Selecione a próxima etapa bloqueada para entender o que falta.'}</p></div>{nextIndex >= 0 && <Button size="small" variant="contained" onClick={() => selectStep(nextIndex)} endIcon={<ArrowRight size={15}/>}>Ver lição</Button>}</div>}
      <div className="map-toolbar"><div className="map-legend" aria-label="Legenda do mapa"><span><CheckCircle2 size={14}/>Concluída</span><span><Play size={13}/>Atual</span><span><LockKeyhole size={13}/>Bloqueada</span></div><ToggleButtonGroup value={view} exclusive onChange={(_, value) => { if (value) setView(value); }} size="small" aria-label="Visualização das etapas"><ToggleButton value="map" aria-label="Ver como tabuleiro"><Map size={16}/><span>Mapa</span></ToggleButton><ToggleButton value="list" aria-label="Ver como lista"><LayoutList size={16}/><span>Lista</span></ToggleButton></ToggleButtonGroup></div>
      {view === "map" && <div className="map-module-guide"><BookOpen size={15}/><span>{modules.join(' → ')}</span></div>}
      <div className={`learning-board ${view}`} style={{ '--board-height': `${Math.ceil(active.steps.length / 3) * 210 + 30}px`, '--mobile-board-height': `${active.steps.length * 165 + 30}px` } as CSSProperties}>
        {view === 'map' && <><svg className="board-line desktop-line" viewBox={`0 0 900 ${Math.ceil(active.steps.length / 3) * 210 + 30}`} preserveAspectRatio="none" aria-hidden="true"><path d={pathFor(active.steps.length)}/><path className="completed-path" d={pathFor(Math.min(complete + 1, active.steps.length))}/></svg><svg className="board-line mobile-line" viewBox={`0 0 360 ${active.steps.length * 165 + 30}`} preserveAspectRatio="none" aria-hidden="true"><path d={pathFor(active.steps.length, true)}/><path className="completed-path" d={pathFor(Math.min(complete + 1, active.steps.length), true)}/></svg></>}
        {view === 'map' ? <ol aria-label={`Percurso de ${active.title}`}>{active.steps.map((_, index) => renderStep(active, index))}</ol> : modules.map((module, moduleIndex) => {
          const steps = active.steps.map((step, index) => ({ step, index })).filter(item => item.step.module === module);
          const done = steps.filter(item => item.index < complete).length;
          return <section className="trail-module" key={module} aria-labelledby={`module-${moduleIndex}`}>
            <header className="module-heading"><span className="module-symbol"><BookOpen size={19} aria-hidden="true"/></span>
              <div><span>Módulo {moduleIndex + 1}</span><h3 id={`module-${moduleIndex}`}>{module}</h3></div>
              <span className="module-count">{done}/{steps.length} concluídas</span>
            </header>
            <ol aria-label={module}>{steps.map(({ index }) => renderStep(active, index))}</ol>
          </section>;
        })}
      </div><div className="map-finish"><Flag size={19}/><span>Seu destino: <strong>{active.title}</strong></span><span>{complete === active.steps.length ? 'Conquistado' : 'Continue no seu ritmo'}</span></div>
      {nextIndex >= 0 && <button className="back-to-current" onClick={focusNext}><Target size={16}/>Localizar minha etapa atual</button>}
    </section> : <section className="trail-empty"><Compass size={35}/><h2>Nenhuma trilha neste status</h2><p>Explore os outros caminhos disponíveis.</p><Button variant="outlined" onClick={() => changeFilter('all')}>Mostrar todas as trilhas</Button></section>}
    </div>
    <p className="trails-demo-note">Seu XP e o progresso ficam salvos no perfil deste navegador.</p>
    <Dialog open={!!currentStep} onClose={() => setSelectedStep(null)} fullWidth maxWidth="sm" aria-labelledby="step-dialog-title"><DialogTitle component="div"><div className="dialog-heading"><h2 id="step-dialog-title">{currentStep?.title}</h2><IconButton aria-label="Fechar detalhes da etapa" onClick={() => setSelectedStep(null)}><X size={20}/></IconButton></div></DialogTitle><DialogContent>{currentStep && currentStatus && active && <><Chip size="small" label={statusLabels[currentStatus]} variant="outlined" icon={currentStatus === 'locked' ? <LockKeyhole size={14}/> : currentStatus === 'completed' ? <CheckCircle2 size={14}/> : <Play size={14}/>}/><p className="step-detail-description">{currentStep.description}</p><div className="step-detail-meta"><span><BookOpen size={16}/>{currentStep.module}</span><span><Clock3 size={16}/>{currentStep.minutes} min</span><span><Zap size={16}/>{currentStep.xp} XP pela conclusão</span></div>{currentStatus === 'locked' ? <Alert severity="info" icon={<LockKeyhole size={20}/>}><strong>Como desbloquear esta etapa</strong><ul className="step-requirements">{reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>Todos os requisitos precisam ser cumpridos. O XP é acumulado, não gasto.</Alert> : currentStep.playable ? <Alert severity="success">{currentStatus === 'completed' ? 'Você já concluiu esta lição. Pode revisá-la sem receber XP novamente.' : 'Esta lição está pronta para você. As respostas têm explicações e seu progresso será atualizado ao concluir.'}</Alert> : <Alert severity="info">{currentStatus === 'completed' ? 'Esta conclusão faz parte do perfil demonstrativo.' : 'A etapa está liberada pelas regras do percurso.'} O conteúdo interativo desta lição será adicionado nas próximas etapas. Consulte o resumo abaixo.</Alert>}{primers[currentStep.id] && currentStatus !== 'locked' ? <div className="step-content-preview"><h3>Guia rápido</h3><p>{primers[currentStep.id].text}</p><pre className="question-code" tabIndex={0} role="region" aria-label="Exemplo de JavaScript">{primers[currentStep.id].example}</pre><details><summary>Confira seu entendimento</summary><p>{primers[currentStep.id].check}</p></details></div> : (!currentStep.playable && currentStatus !== 'locked') && <div className="step-content-preview"><h3>O que você vai aprender</h3><p>{currentStep.description} Esta etapa faz parte do módulo “{currentStep.module}” da trilha {active.title}.</p><p>Ao concluir a atividade completa, o progresso será registrado e a próxima etapa ficará disponível quando seus requisitos forem atendidos.</p></div>}</>}</DialogContent><DialogActions sx={{ p: 3, flexWrap: 'wrap', gap: 1 }}><Button onClick={() => setSelectedStep(null)} startIcon={<ArrowLeft size={15}/>}>Voltar ao mapa</Button>{currentStatus === 'locked' && nextIndex >= 0 && <Button variant="contained" onClick={() => { setSelectedStep(nextIndex); }}>Ver etapa disponível</Button>}{currentStep?.playable && currentStatus !== 'locked' && <Button variant="contained" onClick={() => { setSelectedStep(null); onOpenLesson(currentStep.id); }} endIcon={<Play size={16}/>}>{currentStatus === 'completed' ? 'Revisar lição' : 'Continuar lição'}</Button>}</DialogActions></Dialog>
  </div>;
}
