'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ThemeProvider, CssBaseline, Button, IconButton, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, Tooltip, useMediaQuery } from '@mui/material';
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Code2, Compass, Flame, GraduationCap, LayoutDashboard, LockKeyhole, Menu, Moon, Play, ShieldCheck, Sparkles, Sun, Target, Terminal, Trophy, Zap, CircleHelp, CheckCircle2, Clock3 } from 'lucide-react';
import { makeTheme } from '@/components/theme';
import { courses, gamification } from '@/lib/learning';
import { LessonWorkspace } from '@/components/LessonWorkspace';
import { initialLessonState, lessonReducer } from '@/lib/lesson-session';
import { TrailExplorer } from '@/components/TrailExplorer';
import { trails } from '@/lib/trails';
import { learnerProgress, levelProgress, totalCompleted, trailProgress } from '@/lib/progress';
import type { TrailId } from '@/lib/trails';

type Section = 'overview' | 'courses' | 'achievements';
const basePath = process.env.NEXT_PUBLIC_KODEO_BASE_PATH ?? '';

function appUrl(path: string, query = '') {
  const suffix = process.env.NEXT_PUBLIC_KODEO_STATIC_EXPORT === '1' && path !== '/' ? '/' : '';
  return basePath + path + suffix + query;
}

export default function KodeoApp({ initialSection = 'overview', initialLessonOpen = false }: { initialSection?: Section; initialLessonOpen?: boolean }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [section, setSection] = useState<Section>(initialSection);
  const [selectedTrail, setSelectedTrail] = useState<TrailId>('javascript');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [securityExplored, setSecurityExplored] = useState(false);
  const isMobile = useMediaQuery('(max-width:760px)');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  const [lessonOpen, setLessonOpen] = useState(initialLessonOpen);
  const [lessonReturnUrl, setLessonReturnUrl] = useState(appUrl('/trilhas', '?trilha=javascript'));
  const [info, setInfo] = useState<string | null>(null);
  const [lessonState, lessonDispatch] = useReducer(lessonReducer, undefined, initialLessonState);
  const lessonDone = lessonState.completed;
  const progress = learnerProgress(lessonState);
  const xp = progress.xp;
  const level = levelProgress(xp);
  const javascriptProgress = trailProgress(trails.find(trail => trail.id === 'javascript')!, progress);
  const theme = useMemo(() => makeTheme(mode), [mode]);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('kodeo-theme'); } catch { /* Theme still works if storage is unavailable. */ }
    setMode(saved === 'dark' || saved === 'light' ? saved : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);
  const restoreLocation = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname.slice(basePath.length).replace(/\/$/, '') || '/';
    setLessonOpen(path === '/licoes/variaveis');
    setSection(['/trilhas', '/licoes/variaveis'].includes(path) ? 'courses' : params.get('view') === 'achievements' ? 'achievements' : 'overview');
    const id = params.get('trilha');
    if (trails.some(trail => trail.id === id)) setSelectedTrail(id as TrailId);
    else if (path === '/trilhas') setSelectedTrail('javascript');
    if (path === '/trilhas' && id === 'security') setSecurityExplored(true);
    setMobileOpen(false);
  }, []);
  useEffect(() => {
    restoreLocation();
    function onPopState() { focusHeading.current = true; restoreLocation(); }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [restoreLocation]);
  useEffect(() => {
    if (focusHeading.current && !lessonOpen) {
      focusHeading.current = false;
      headingRef.current?.focus();
    }
  }, [section, lessonOpen, selectedTrail]);
  function toggleTheme() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    try { localStorage.setItem('kodeo-theme', next); } catch { /* Storage is optional for this preview. */ }
  }
  function openLesson() {
    setLessonReturnUrl(window.location.pathname + window.location.search);
    if (lessonState.phase === 'summary') lessonDispatch({ type: 'review' });
    setLessonOpen(true); setMobileOpen(false);
    window.history.pushState(null, '', appUrl('/licoes/variaveis'));
  }
  function closeLesson() {
    focusHeading.current = true;
    window.history.pushState(null, '', lessonReturnUrl);
    restoreLocation();
  }
  function navigate(next: Section, trailId: TrailId = selectedTrail) {
    focusHeading.current = true;
    setSelectedTrail(trailId);
    window.history.pushState(null, '', next === 'courses' ? appUrl('/trilhas', `?trilha=${trailId}`) : appUrl('/', next === 'achievements' ? '?view=achievements' : ''));
    restoreLocation();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function selectTrail(id: TrailId) {
    window.history.replaceState(null, '', appUrl('/trilhas', `?trilha=${id}`));
    restoreLocation();
  }
  const icons = { code: Code2, shield: ShieldCheck, terminal: Terminal };
  const sidebar = <aside className="app sidebar" data-theme={mode} aria-label="Navegação principal">
      <button className="brand" onClick={() => navigate('overview')} aria-label="Kodeo, início"><span className="brand-mark"><Code2 size={23}/></span>kodeo<span className="brand-dot">.</span></button>
      <div className="workspace-label">SEU ESPAÇO DE APRENDIZADO</div>
      <nav><button className={section === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('overview')} aria-current={section === 'overview' ? 'page' : undefined}><LayoutDashboard size={19}/>Visão geral</button><button className={section === 'courses' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('courses')} aria-current={section === 'courses' ? 'page' : undefined}><Compass size={19}/>Minhas trilhas<span className="nav-count">{trails.length}</span></button><button className={section === 'achievements' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('achievements')} aria-current={section === 'achievements' ? 'page' : undefined}><Trophy size={19}/>Conquistas</button></nav>
      <div className="sidebar-note"><div className="note-icon"><Sparkles size={20}/></div><strong>Um passo por dia.</strong><p>Pequenas práticas constroem grandes habilidades.</p><span>Você está no caminho certo <ArrowUpRight size={14}/></span></div>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => { setMobileOpen(false); setInfo('Escolha uma trilha e continue sua lição. Em cada questão, selecione uma alternativa e clique em Verificar resposta. Você recebe uma explicação antes de avançar. Os dados desta primeira versão são demonstrativos e o progresso é reiniciado ao atualizar a página.'); }}><CircleHelp size={19}/>Como funciona</button><div className="profile"><span className="avatar">N</span><div><strong>Nando</strong><small>Aprendiz de tecnologia</small></div><span className="online-dot" title="Perfil demonstrativo"/></div></div>
    </aside>;
  return <ThemeProvider theme={theme}><CssBaseline /><div className="app" data-theme={mode}>
    <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
    {isMobile ? <Drawer className="mobile-drawer" open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ paper: { id: 'mobile-navigation', role: 'dialog', 'aria-modal': true, 'aria-label': 'Menu de navegação' } }}>{sidebar}</Drawer> : sidebar}
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><IconButton className="mobile-menu" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={mobileOpen} aria-controls={mobileOpen ? "mobile-navigation" : undefined} onClick={() => setMobileOpen(true)}><Menu size={21}/></IconButton><span>Meu aprendizado</span><ChevronRight size={14}/><strong>{section === 'overview' ? 'Visão geral' : section === 'courses' ? 'Minhas trilhas' : 'Conquistas'}</strong></div><div className="topbar-actions"><span className="demo-label">Prévia do dashboard</span><Tooltip title={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}><IconButton onClick={toggleTheme} aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}>{mode === 'light' ? <Moon size={19}/> : <Sun size={19}/>}</IconButton></Tooltip><span className="avatar small">N</span></div></header>
    <main id="main-content" tabIndex={-1}><div className="page-heading"><div><div className="eyebrow">APRENDA. PRATIQUE. EVOLUA.</div><h1 ref={headingRef} tabIndex={-1}>{section === 'overview' ? 'Bom te ver por aqui, Nando' : section === 'courses' ? 'Seu mapa de aprendizado' : 'Cada passo merece uma conquista'}{section === 'overview' && <span className="greeting-dot">.</span>}</h1><p>{section === 'overview' ? 'Seu próximo passo começa aqui. Vamos aprender algo novo hoje?' : section === 'courses' ? 'Escolha seu caminho. Cada etapa abre uma nova possibilidade.' : 'Celebre o que você já aprendeu e descubra o que vem a seguir.'}</p></div><div className="streak-tag"><Flame size={18}/><strong>3 dias</strong><span>de sequência</span></div></div>
    <p className="demo-notice">Protótipo com dados simulados. Recarregar reinicia XP e progresso; sair da lição mantém seu rascunho nesta sessão.</p>
    {section === 'overview' && <>
      <div className="stats-grid"><div className="stat-card"><span className="stat-icon blue"><GraduationCap size={21}/></span><div><small>Nível atual</small><strong>{level.level} <span>Aprendiz</span></strong></div></div><div className="stat-card"><span className="stat-icon amber"><Zap size={21}/></span><div><small>Experiência total</small><strong>{xp.toLocaleString('pt-BR')} <span>XP</span></strong></div></div><div className="stat-card"><span className="stat-icon green"><CheckCircle2 size={21}/></span><div><small>Lições concluídas</small><strong>{totalCompleted(progress)} <span>uma de cada vez</span></strong></div></div><div className="stat-card"><span className="stat-icon purple"><Trophy size={21}/></span><div><small>Conquistas</small><strong>{lessonDone ? 4 : 3} <span>desbloqueadas</span></strong></div></div></div>
      <div className="dashboard-grid"><div className="primary-column"><section className="continue-card"><div className="hero-content"><span className="hero-label"><span className="pulse-dot"/> SUA JORNADA CONTINUA</span><h2>Grandes ideias começam<br/>com pequenos códigos.</h2><p>Fundamentos de JavaScript</p><div className="lesson-meta"><span>Módulo 2</span><span className="meta-dot"/><span>Variáveis e tipos de dados</span></div><Button variant="contained" onClick={openLesson} endIcon={<ArrowRight size={17}/>}>{lessonDone ? 'Revisar lição' : 'Continuar aprendendo'}</Button><span className="hero-time"><Clock3 size={13}/> Cerca de 8 minutos</span></div><div className="code-art" aria-hidden="true"><div className="code-window"><div className="window-top"><i/><i/><i/><span>seu-proximo-passo.js</span></div><div className="code-lines"><span className="comment">// todo dia, um pouco melhor</span><span><b>const</b> aprendiz = {'{'}</span><span>&nbsp; curiosidade: <em>true</em>,</span><span>&nbsp; próximoPasso: <i>'aprender'</i></span><span>{'}'};</span><span className="code-gap"/><span><b>evoluir</b>(aprendiz);<span className="cursor"/></span></div></div><span className="floating-code">{'</>'}</span></div><div className="hero-footer"><span>Seu progresso na trilha</span><LinearProgress variant="determinate" value={javascriptProgress.percent} aria-label="Progresso na trilha JavaScript"/><strong>{javascriptProgress.percent}%</strong></div></section>
      <section className="section-block"><div className="section-title"><h2>Seu plano de hoje</h2><span className="muted">{1 + Number(lessonDone) + Number(securityExplored)} de 3 concluídas</span></div><div className="task-list"><div className="task-row completed"><span className="task-check"><Check size={15}/></span><div><strong>Dar o primeiro passo</strong><p>Acesse sua jornada e prepare-se para aprender.</p></div><span className="task-status">Concluído</span></div><div className={`task-row ${lessonDone ? 'completed' : ''}`}><span className={`task-check ${lessonDone ? '' : 'pending'}`}>{lessonDone ? <Check size={15}/> : <Play size={13}/>}</span><div><strong>Uma nova habilidade</strong><p>Conclua a lição de variáveis e tipos de dados.</p></div><button className="task-action" onClick={openLesson}>{lessonDone ? 'Revisar' : 'Praticar'}<ArrowRight size={15}/></button></div><div className={`task-row ${securityExplored ? 'completed' : ''}`}><span className={`task-check ${securityExplored ? '' : 'pending'}`}>{securityExplored ? <Check size={15}/> : <Target size={15}/>}</span><div><strong>Explore um novo caminho</strong><p>Conheça a trilha de introdução à cibersegurança.</p></div><button className="task-action" onClick={() => navigate('courses', 'security')}>Explorar<ArrowRight size={15}/></button></div></div></section></div>
      <aside className="secondary-column"><section className="panel level-panel"><div className="panel-heading"><h2>Seu próximo nível</h2><Sparkles size={17}/></div><div className="level-symbol"><span><GraduationCap size={31}/></span><b>{level.level}</b></div><h3>Nível {level.level}</h3><p>Cada descoberta te leva mais longe.</p><div className="xp-label"><strong>{xp.toLocaleString('pt-BR')} XP</strong><span>{level.next === null ? 'Nível máximo da prévia' : `${level.next.toLocaleString('pt-BR')} XP`}</span></div><LinearProgress variant="determinate" value={level.percent} aria-label={level.next === null ? 'Nível máximo da prévia' : `Progresso para o nível ${level.level + 1}`}/><div className="next-level">{level.next === null ? 'Você alcançou o último nível desta prévia.' : <>Faltam <strong>{level.remaining.toLocaleString('pt-BR')} XP</strong> para o nível {level.level + 1}</>}</div>{level.next !== null && <div className="level-bottom"><span>Nível {level.level + 1}</span><strong>Próxima descoberta <ArrowUpRight size={14}/></strong></div>}</section><section className="panel weekly-panel"><div className="panel-heading"><h2>Constância é tudo</h2><Flame size={18}/></div><p>Você estudou em <strong>3 dias</strong> nesta semana.</p><div className="week-days" aria-hidden="true">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => <div key={index}><span>{day}</span><i className={index < 3 ? 'day done' : 'day'}>{index < 3 ? <Check size={14}/> : <span/>}</i></div>)}</div><div className="weekly-message"><span/> Continue cultivando esse hábito.</div></section></aside></div>
    </>}
    {section === 'courses' && <TrailExplorer progress={progress} selectedTrail={selectedTrail} onSelectTrail={selectTrail} onOpenLesson={openLesson}/>}
    {section === 'overview' && <section className="section-block courses-section"><div className="section-title"><div><h2>{section === 'overview' ? 'Suas trilhas de aprendizado' : 'Encontre seu caminho'}</h2><p>Conhecimento que cresce junto com você.</p></div>{section === 'overview' && <button className="text-action" onClick={() => navigate('courses')}>Ver todas as trilhas<ArrowRight size={16}/></button>}</div><div className="courses-grid">{courses.map(course => { const Icon = icons[course.icon]; const courseProgress = trailProgress(trails.find(trail => trail.id === course.id)!, progress); return <article className="course-card" key={course.id}><div className="course-top"><span className={`course-icon ${course.color}`}><Icon size={23}/></span><span className={`course-tag ${course.color}`}>{course.tag}</span></div><span className="course-category">{course.category}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-progress-label"><span>{courseProgress.completed} de {courseProgress.total} lições</span><strong>{courseProgress.percent}%</strong></div><LinearProgress variant="determinate" value={courseProgress.percent} aria-label={`Progresso em ${course.title}`}/><button className="course-link" onClick={() => navigate('courses', course.id)}>{courseProgress.percent === 100 ? 'Revisar trilha' : courseProgress.percent === 0 ? 'Conhecer trilha' : 'Continuar trilha'}<ArrowUpRight size={17}/></button></article>; })}</div></section>}
    {section !== 'courses' && <section className="section-block achievement-section"><div className="section-title"><div><h2>{section === 'achievements' ? 'Suas conquistas' : 'Pequenas vitórias, grandes passos'}</h2><p>Seu esforço deixa marcas.</p></div>{section === 'overview' && <button className="text-action" onClick={() => navigate('achievements')}>Ver conquistas<ArrowRight size={16}/></button>}</div><div className="achievements-grid">{[{name:'Primeiros passos', description:'Sua primeira lição concluída', icon: BookOpen, color:'blue', unlocked:true},{name:'Na mosca',description:'10 respostas corretas',icon:Target,color:'green',unlocked:true},{name:'Persistente',description:'3 dias seguidos aprendendo',icon:Flame,color:'amber',unlocked:true},{name:'Mais um passo',description:'Conclua a lição de variáveis',icon:Trophy,color:'purple',unlocked:lessonDone}].map(item => <div className={`achievement ${!item.unlocked ? 'locked' : ''}`} key={item.name}><span className={`achievement-icon ${item.color}`}><item.icon size={23}/></span><div><h3>{item.name}</h3><p>{item.description}</p></div>{item.unlocked ? <CheckCircle2 size={16} className="achievement-check"/> : <LockKeyhole size={15}/>}</div>)}</div></section>}
    <footer className="page-footer"><span><Code2 size={15}/> Feito para quem nunca para de aprender.</span><span>Kodeo · um passo de cada vez</span></footer>
    </main></div>
    <LessonWorkspace open={lessonOpen} mode={mode} state={lessonState} dispatch={lessonDispatch} onExit={closeLesson} onToggleTheme={toggleTheme}/>
    <Dialog aria-labelledby="info-title" open={!!info} onClose={() => setInfo(null)} fullWidth maxWidth="sm"><DialogTitle id="info-title">Seu aprendizado no Kodeo</DialogTitle><DialogContent><p>{info}</p></DialogContent><DialogActions><Button onClick={() => setInfo(null)}>Entendi</Button></DialogActions></Dialog>
  </div></ThemeProvider>;
}
