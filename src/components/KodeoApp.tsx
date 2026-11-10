'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider, CssBaseline, Button, IconButton, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Drawer, Tooltip, useMediaQuery } from '@mui/material';
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Code2, Compass, Flame, GraduationCap, LayoutDashboard, LockKeyhole, Menu, Moon, Play, ShieldCheck, Sparkles, Sun, Target, Terminal, Trophy, Zap, CircleHelp, CheckCircle2, Clock3 } from 'lucide-react';
import { makeTheme } from '@/components/theme';
import { courses, gamification } from '@/lib/learning';
import { InstallKodeo } from '@/components/InstallKodeo';
import { LessonWorkspace } from '@/components/LessonWorkspace';
import { initialLessonState, lessonReducer, type LessonAction, type LessonState } from '@/lib/lesson-session';
import { TrailExplorer } from '@/components/TrailExplorer';
import { trails, stepStatus } from '@/lib/trails';
import { learnerProgress, levelProgress, totalCompleted, trailProgress } from '@/lib/progress';
import type { TrailId } from '@/lib/trails';

import { isJavascriptLesson } from '@/lib/javascript-course';
import { courseLesson, isCourseLesson, securityLessonId } from '@/lib/course-lessons';
import { achievementProgress, studyWeek } from '@/lib/achievements';
import { firstNameFrom, PROFILE_KEY, readProfile } from '@/lib/local-profile';

const emptyLesson = initialLessonState();
const javascript = trails.find(trail => trail.id === 'javascript')!;
const security = trails.find(trail => trail.id === 'security')!;

type Section = 'overview' | 'courses' | 'achievements';
const basePath = process.env.NEXT_PUBLIC_KODEO_BASE_PATH ?? '';

function appUrl(path: string, query = '') {
  const suffix = process.env.NEXT_PUBLIC_KODEO_STATIC_EXPORT === '1' && path !== '/' ? '/' : '';
  return basePath + path + suffix + query;
}

export default function KodeoApp({ initialSection = 'overview', initialLessonOpen = false, initialLessonId = 'js-6' }: { initialSection?: Section; initialLessonOpen?: boolean; initialLessonId?: string }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [section, setSection] = useState<Section>(initialSection);
  const [selectedTrail, setSelectedTrail] = useState<TrailId>(initialLessonId === securityLessonId ? 'security' : 'javascript');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [securityExplored, setSecurityExplored] = useState(false);
  const isMobile = useMediaQuery('(max-width:1024px)', { defaultMatches: true });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  const [lessonOpen, setLessonOpen] = useState(initialLessonOpen);
  const [lessonReturnUrl, setLessonReturnUrl] = useState(appUrl('/trilhas', initialLessonId === securityLessonId ? '?trilha=security' : '?trilha=javascript'));
  const [info, setInfo] = useState<string | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [sessions, setSessions] = useState<Record<string, LessonState>>({});
  const [lessonId, setLessonId] = useState(initialLessonId);
  const lesson = useMemo(() => courseLesson(lessonId, firstName), [lessonId, firstName]);
  const lessonState = sessions[lessonId] ?? emptyLesson;
  const firstLesson = sessions['js-6'] ?? emptyLesson;
  const lessonDone = firstLesson.completed;
  const progress = learnerProgress(firstLesson, Object.entries(sessions).filter(([id]) => id !== 'js-6' && isJavascriptLesson(id)).map(([, state]) => state), sessions[securityLessonId]);
  const activeTrail = lessonId === securityLessonId ? security : javascript;
  const activeLessonIndex = activeTrail.steps.findIndex(step => step.id === lessonId);
  const canOpenLesson = stepStatus(activeTrail, activeLessonIndex, progress) !== 'locked';
  const nextLesson = javascript.steps.find((step, index) => step.playable && !sessions[step.id]?.completed && stepStatus(javascript, index, progress) !== 'locked');
  const followingLesson = activeTrail.steps[activeLessonIndex + 1];
  const nextPractice = followingLesson?.playable && stepStatus(activeTrail, activeLessonIndex + 1, progress) !== 'locked' ? followingLesson : undefined;
  const avatar = Array.from(firstName)[0]?.toLocaleUpperCase('pt-BR') ?? 'K';

  useEffect(() => {
    try {
      const profile = readProfile(localStorage.getItem(PROFILE_KEY));
      if (profile) {
        setFirstName(profile.firstName);
        setSessions(profile.lessons);
        if (profile.securityExplored) setSecurityExplored(true);
      }
    } catch {
      setStorageAvailable(false);
    }
    setProfileReady(true);
  }, []);

  useEffect(() => {
    if (!profileReady || !firstName || !storageAvailable) return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ firstName, lessons: sessions, securityExplored }));
    } catch {
      setStorageAvailable(false);
    }
  }, [profileReady, firstName, sessions, securityExplored, storageAvailable]);

  function lessonDispatch(action: LessonAction) {
    setSessions(current => {
      const previous = current[lessonId] ?? emptyLesson;
      const next = lessonReducer(previous, action, lesson);
      return next === previous ? current : { ...current, [lessonId]: next };
    });
  }
  const badges = achievementProgress(sessions);
  const unlocked = badges.filter(badge => badge.current >= badge.target);
  const featuredBadges = [...unlocked.slice(-2), ...badges.filter(badge => badge.current < badge.target).slice(0, 3)].slice(0, 3);
  const badgeIcons = { blue: BookOpen, purple: Trophy, amber: Zap, green: Target };
  const week = studyWeek(Object.values(sessions));
  const daysPracticed = week.filter(day => day.done).length;
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
    const requested = params.get('etapa');
    const cyber = path === '/licoes/ciberseguranca';
    setLessonId(cyber ? securityLessonId : path === '/licoes/variaveis' && isJavascriptLesson(requested) ? requested : 'js-6');
    setLessonOpen(cyber || path === '/licoes/variaveis');
    setSection(['/trilhas', '/licoes/variaveis', '/licoes/ciberseguranca'].includes(path) ? 'courses' : params.get('view') === 'achievements' ? 'achievements' : 'overview');
    const id = params.get('trilha');
    if (trails.some(trail => trail.id === id)) setSelectedTrail(id as TrailId);
    else if (cyber) setSelectedTrail('security');
    else if (path === '/trilhas') setSelectedTrail('javascript');
    if (cyber || path === '/trilhas' && id === 'security') setSecurityExplored(true);
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
  function openLesson(id: string, keepReturnUrl = false) {
    const isCyber = id === securityLessonId;
    const trail = isCyber ? security : javascript;
    const index = trail.steps.findIndex(step => step.id === id);
    if (!isCourseLesson(id) || stepStatus(trail, index, progress) === 'locked') return;
    if (isCyber) setSecurityExplored(true);
    if (!keepReturnUrl) setLessonReturnUrl(window.location.pathname + window.location.search);
    setSessions(current => {
      const state = current[id];
      return state?.phase === 'summary'
        ? { ...current, [id]: lessonReducer(state, { type: 'review' }, courseLesson(id, firstName)) }
        : current;
    });
    setLessonId(id);
    setLessonOpen(true);
    setMobileOpen(false);
    window.history.pushState(null, '', isCyber ? appUrl('/licoes/ciberseguranca') : appUrl('/licoes/variaveis', id === 'js-6' ? '' : `?etapa=${id}`));
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
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => { setMobileOpen(false); setInfo('Escolha uma trilha e continue sua lição. Em cada questão, selecione uma alternativa e clique em Verificar resposta. Você recebe uma explicação antes de avançar. Os dados desta primeira versão são demonstrativos e o progresso é reiniciado ao atualizar a página.'); }}><CircleHelp size={19}/>Como funciona</button><div className="profile"><span className="avatar">{avatar}</span><div><strong>{firstName || "Aprendiz"}</strong><small>Aprendiz de tecnologia</small></div><span className="online-dot" title="Perfil demonstrativo"/></div></div>
    </aside>;
  return <ThemeProvider theme={theme}><CssBaseline /><div className="app kodeo-shell" data-theme={mode}>
    <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
    {isMobile ? <Drawer className="mobile-drawer" open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ paper: { id: 'mobile-navigation', role: 'dialog', 'aria-modal': true, 'aria-label': 'Menu de navegação' } }}>{sidebar}</Drawer> : sidebar}
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><IconButton className="mobile-menu" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={mobileOpen} aria-controls={mobileOpen ? "mobile-navigation" : undefined} onClick={() => setMobileOpen(true)}><Menu size={21}/></IconButton><span>Meu aprendizado</span><ChevronRight size={14}/><span className="compact-brand" aria-hidden="true"><Code2 size={22}/> Kodeo</span><strong>{section === 'overview' ? 'Visão geral' : section === 'courses' ? 'Minhas trilhas' : 'Conquistas'}</strong></div><div className="topbar-actions"><InstallKodeo/><span className="demo-label">Prévia do dashboard</span><Tooltip title={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}><IconButton onClick={toggleTheme} aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}>{mode === 'light' ? <Moon size={19}/> : <Sun size={19}/>}</IconButton></Tooltip><span className="avatar small">{avatar}</span></div></header>
    <main id="main-content" tabIndex={-1} data-section={section}><div className="page-heading"><div><div className="eyebrow">APRENDA. PRATIQUE. EVOLUA.</div><h1 ref={headingRef} tabIndex={-1}>{section === 'overview' ? (firstName ? `Bom te ver por aqui, ${firstName}` : 'Bom te ver por aqui') : section === 'courses' ? 'Seu mapa de aprendizado' : 'Cada passo merece uma conquista'}{section === 'overview' && <span className="greeting-dot">.</span>}</h1><p>{section === 'overview' ? 'Seu próximo passo começa aqui. Vamos aprender algo novo hoje?' : section === 'courses' ? 'Escolha seu caminho. Cada etapa abre uma nova possibilidade.' : 'Celebre o que você já aprendeu e descubra o que vem a seguir.'}</p></div><div className="streak-tag"><Flame size={18}/><strong>{daysPracticed} {daysPracticed === 1 ? "dia" : "dias"}</strong><span>de prática nesta semana</span></div></div>
    <p className="demo-notice">{storageAvailable ? "Perfil de teste. Nome, progresso e rascunhos ficam salvos neste navegador." : "O navegador bloqueou o armazenamento. O progresso dura apenas nesta sessão."}</p>
    {section === 'overview' && <>
      <div className="stats-grid"><div className="stat-card"><span className="stat-icon blue"><GraduationCap size={21}/></span><div><small>Nível atual</small><strong>{level.level} <span>Aprendiz</span></strong></div></div><div className="stat-card"><span className="stat-icon amber"><Zap size={21}/></span><div><small>Experiência total</small><strong>{xp.toLocaleString('pt-BR')} <span>XP</span></strong></div></div><div className="stat-card"><span className="stat-icon green"><CheckCircle2 size={21}/></span><div><small>Lições concluídas</small><strong>{totalCompleted(progress)} <span>uma de cada vez</span></strong></div></div><div className="stat-card"><span className="stat-icon purple"><Trophy size={21}/></span><div><small>Conquistas</small><strong>{lessonDone ? 4 : 3} <span>desbloqueadas</span></strong></div></div></div>
      <div className="dashboard-grid"><div className="primary-column"><section className="continue-card"><div className="hero-content"><span className="hero-label"><span className="pulse-dot"/> SUA JORNADA CONTINUA</span><h2>{nextLesson ? nextLesson.title : "Revise sua última missão"}</h2><p>Fundamentos de JavaScript</p><div className="lesson-meta"><span>{nextLesson?.module ?? "Revisão"}</span></div><Button variant="contained" onClick={() => openLesson(nextLesson?.id ?? "js-6")} endIcon={<ArrowRight size={17}/>}>{!nextLesson ? 'Revisar lição' : sessions[nextLesson.id]?.phase === 'practice' ? 'Continuar de onde parei' : 'Continuar aprendendo'}</Button><span className="hero-time"><Clock3 size={13}/> Cerca de {nextLesson?.minutes ?? 8} minutos</span></div><div className="code-art" aria-hidden="true"><div className="code-window"><div className="window-top"><i/><i/><i/><span>seu-proximo-passo.js</span></div><div className="code-lines"><span className="comment">// todo dia, um pouco melhor</span><span><b>const</b> aprendiz = {'{'}</span><span>&nbsp; curiosidade: <em>true</em>,</span><span>&nbsp; próximoPasso: <i>'aprender'</i></span><span>{'}'};</span><span className="code-gap"/><span><b>evoluir</b>(aprendiz);<span className="cursor"/></span></div></div><span className="floating-code">{'</>'}</span></div><div className="hero-footer"><span>Seu progresso na trilha</span><LinearProgress variant="determinate" value={javascriptProgress.percent} aria-label="Progresso na trilha JavaScript"/><strong>{javascriptProgress.percent}%</strong></div></section>
      <section className="section-block"><div className="section-title"><h2>Seu plano de hoje</h2><span className="muted">{1 + Number(lessonDone) + Number(securityExplored)} de 3 concluídas</span></div><div className="task-list"><div className="task-row completed"><span className="task-check"><Check size={15}/></span><div><strong>Dar o primeiro passo</strong><p>Acesse sua jornada e prepare-se para aprender.</p></div><span className="task-status">Concluído</span></div><div className={`task-row ${lessonDone ? 'completed' : ''}`}><span className={`task-check ${lessonDone ? '' : 'pending'}`}>{lessonDone ? <Check size={15}/> : <Play size={13}/>}</span><div><strong>Uma nova habilidade</strong><p>Conclua a lição de variáveis e tipos de dados.</p></div><button className="task-action" onClick={() => openLesson("js-6")}>{lessonDone ? 'Revisar' : 'Praticar'}<ArrowRight size={15}/></button></div><div className={`task-row ${securityExplored ? 'completed' : ''}`}><span className={`task-check ${securityExplored ? '' : 'pending'}`}>{securityExplored ? <Check size={15}/> : <Target size={15}/>}</span><div><strong>Explore um novo caminho</strong><p>Conheça a trilha de introdução à cibersegurança.</p></div><button className="task-action" onClick={() => navigate('courses', 'security')}>Explorar<ArrowRight size={15}/></button></div></div></section></div>
      <aside className="secondary-column"><section className="panel level-panel"><div className="panel-heading"><h2>Seu próximo nível</h2><Sparkles size={17}/></div><div className="level-symbol"><span><GraduationCap size={31}/></span><b>{level.level}</b></div><h3>Nível {level.level}</h3><p>Cada descoberta te leva mais longe.</p><div className="xp-label"><strong>{xp.toLocaleString('pt-BR')} XP</strong><span>{level.next === null ? 'Nível máximo da prévia' : `${level.next.toLocaleString('pt-BR')} XP`}</span></div><LinearProgress variant="determinate" value={level.percent} aria-label={level.next === null ? 'Nível máximo da prévia' : `Progresso para o nível ${level.level + 1}`}/><div className="next-level">{level.next === null ? 'Você alcançou o último nível desta prévia.' : <>Faltam <strong>{level.remaining.toLocaleString('pt-BR')} XP</strong> para o nível {level.level + 1}</>}</div>{level.next !== null && <div className="level-bottom"><span>Nível {level.level + 1}</span><strong>Próxima descoberta <ArrowUpRight size={14}/></strong></div>}</section><section className="panel weekly-panel"><div className="panel-heading"><h2>Meta da semana</h2><Flame size={18}/></div>
        <p><strong>{Math.min(daysPracticed, 3)} de 3 dias</strong> de prática nesta semana.</p>
        <div className="week-days">{week.map(day => <div key={day.name}>
          <span aria-hidden="true">{day.name[0].toLocaleUpperCase('pt-BR')}</span>
          <i className={day.done ? 'day done' : 'day'} aria-hidden="true">{day.done ? <Check size={14}/> : <span/>}</i>
          <span className="sr-only">{day.name}: {day.done ? 'com prática' : 'sem prática'}</span>
        </div>)}</div>
        <div className="weekly-message"><span/>{daysPracticed >= 3 ? 'Meta alcançada! Continue no seu ritmo.' : 'Responda a um exercício para registrar o dia.'}</div>
      </section></aside></div>
    </>}
    {section === 'courses' && <TrailExplorer progress={progress} selectedTrail={selectedTrail} onSelectTrail={selectTrail} onOpenLesson={openLesson}/>}
    {section === 'overview' && <section className="section-block courses-section"><div className="section-title"><div><h2>{section === 'overview' ? 'Suas trilhas de aprendizado' : 'Encontre seu caminho'}</h2><p>Conhecimento que cresce junto com você.</p></div>{section === 'overview' && <button className="text-action" onClick={() => navigate('courses')}>Ver todas as trilhas<ArrowRight size={16}/></button>}</div><div className="courses-grid">{courses.map(course => { const Icon = icons[course.icon]; const courseProgress = trailProgress(trails.find(trail => trail.id === course.id)!, progress); return <article className="course-card" key={course.id}><div className="course-top"><span className={`course-icon ${course.color}`}><Icon size={23}/></span><span className={`course-tag ${course.color}`}>{course.tag}</span></div><span className="course-category">{course.category}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-progress-label"><span>{courseProgress.completed} de {courseProgress.total} lições</span><strong>{courseProgress.percent}%</strong></div><LinearProgress variant="determinate" value={courseProgress.percent} aria-label={`Progresso em ${course.title}`}/><button className="course-link" onClick={() => navigate('courses', course.id)}>{courseProgress.percent === 100 ? 'Revisar trilha' : courseProgress.percent === 0 ? 'Conhecer trilha' : 'Continuar trilha'}<ArrowUpRight size={17}/></button></article>; })}</div></section>}
    {section !== 'courses' && <section className="section-block achievement-section" aria-labelledby="badges-title">
      <div className="section-title"><div><h2 id="badges-title">Suas conquistas</h2><p>{unlocked.length} de {badges.length} desbloqueadas.</p></div>
        {section === 'overview' && <button className="text-action" onClick={() => navigate('achievements')}>Ver conquistas<ArrowRight size={16}/></button>}
      </div>
      <div className="achievements-grid">{(section === 'overview' ? featuredBadges : badges).map(badge => {
        const earned = badge.current >= badge.target;
        const Icon = badgeIcons[badge.color as keyof typeof badgeIcons];
        return <article className={`achievement ${earned ? '' : 'locked'}`} key={badge.id}>
          <span className={`achievement-icon ${badge.color}`} aria-hidden="true"><Icon size={23}/></span>
          <div className="badge-detail"><h3>{badge.name}</h3><p>{badge.description}</p>
            {earned ? <span className="badge-earned"><CheckCircle2 size={14}/> Desbloqueada</span> : <>
              <LinearProgress variant="determinate" value={badge.current / badge.target * 100} aria-label={`Progresso: ${badge.name}`}/>
              <p>{badge.current} de {badge.target}</p>
            </>}
          </div>
        </article>;
      })}</div>
    </section>}
    <footer className="page-footer"><span><Code2 size={15}/> Feito para quem nunca para de aprender.</span><span>Kodeo · um passo de cada vez</span></footer>
    </main></div>
    {isMobile && <nav className="compact-nav" aria-label="Atalhos do Kodeo">
      <button aria-current={section === 'overview' ? 'page' : undefined} onClick={() => navigate('overview')}><LayoutDashboard size={22} aria-hidden="true"/><span>Início</span></button>
      <button aria-current={section === 'courses' ? 'page' : undefined} onClick={() => navigate('courses')}><Compass size={22} aria-hidden="true"/><span>Trilhas</span></button>
      <button aria-current={section === 'achievements' ? 'page' : undefined} onClick={() => navigate('achievements')}><Trophy size={22} aria-hidden="true"/><span>Medalhas</span></button>
    </nav>}
    <Dialog open={profileReady && !firstName} aria-labelledby="local-profile-title" fullWidth maxWidth="xs">
      <form onSubmit={event => { event.preventDefault(); const name = firstNameFrom(nameInput); if (name) setFirstName(name); }}>
        <DialogTitle id="local-profile-title">Como podemos chamar você?</DialogTitle>
        <DialogContent>
          <p>Seu perfil de teste e seu progresso ficam neste navegador.</p>
          <TextField autoFocus required fullWidth margin="normal" label="Primeiro nome" autoComplete="given-name"
            value={nameInput} onChange={event => setNameInput(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 80 } }}/>
        </DialogContent>
        <DialogActions><Button type="submit" variant="contained" disabled={!firstNameFrom(nameInput)}>Começar</Button></DialogActions>
      </form>
    </Dialog>
    <LessonWorkspace key={lessonId} lesson={lesson} open={profileReady && !!firstName && lessonOpen && canOpenLesson} mode={mode} state={lessonState} dispatch={lessonDispatch} onExit={closeLesson} onToggleTheme={toggleTheme} nextPractice={nextPractice ? { title: nextPractice.title, open: () => openLesson(nextPractice.id, true) } : undefined}/>
    <Dialog aria-labelledby="info-title" open={!!info} onClose={() => setInfo(null)} fullWidth maxWidth="sm"><DialogTitle id="info-title">Seu aprendizado no Kodeo</DialogTitle><DialogContent><p>{info}</p></DialogContent><DialogActions><Button onClick={() => setInfo(null)}>Entendi</Button></DialogActions></Dialog>
  </div></ThemeProvider>;
}
