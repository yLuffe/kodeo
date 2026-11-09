import { gamification } from './learning';

export type TrailId = 'javascript' | 'security' | 'logic' | 'web' | 'defense' | 'pentest';
export type StepStatus = 'completed' | 'available' | 'current' | 'locked';
export type AccessRequirement = { minLevel?: number; minXP?: number; prerequisite?: TrailId };
export type TrailStep = { id: string; title: string; description: string; module: string; minutes: number; xp: number; minLevel?: number; minXP?: number; playable?: boolean };
export type Trail = { id: TrailId; title: string; category: string; description: string; icon: 'code' | 'shield' | 'terminal'; color: 'blue' | 'green' | 'purple'; requirements?: AccessRequirement; initialCompleted: number; steps: TrailStep[] };

export const levelThresholds = [0, 100, 250, 500, 1000, 1500, 2100, 2800];
export function getLevel(xp: number) { return Math.max(1, levelThresholds.filter(threshold => xp >= threshold).length); }
const step = (id: string, title: string, description: string, module: string, extra: Partial<TrailStep> = {}): TrailStep => ({ id, title, description, module, minutes: 5, xp: gamification.lessonXP, ...extra });
export const trails: Trail[] = [
  { id: 'javascript', title: 'Fundamentos de JavaScript', category: 'Programação', description: 'Da primeira linha de código às suas próprias soluções. Avance uma descoberta por vez.', icon: 'code', color: 'blue', initialCompleted: 5, steps: [
    step('js-1', 'Boas-vindas ao JavaScript', 'Conheça a linguagem e onde ela está presente.', 'Primeiros passos'),
    step('js-2', 'Seu primeiro código', 'Entenda instruções e experimente o console.', 'Primeiros passos'),
    step('js-3', 'Pensando como dev', 'Divida problemas em passos menores.', 'Primeiros passos'),
    step('js-4', 'Comentários e clareza', 'Aprenda a tornar suas intenções legíveis.', 'Primeiros passos'),
    step('js-5', 'Valores e expressões', 'Combine valores para produzir resultados.', 'Dados e decisões'),
    step('js-6', 'Variáveis e tipos', 'Pratique let, const, números e valores booleanos.', 'Dados e decisões', { playable: true, minutes: 8 }),
    step('js-7', 'Operadores', 'Compare valores e combine expressões.', 'Dados e decisões', { playable: true }),
    step('js-8', 'Tomando decisões', 'Escolha caminhos com if e else.', 'Dados e decisões', { playable: true }),
    step('js-9', 'Laços de repetição', 'Automatize passos com for e while.', 'Construindo soluções', { playable: true, minLevel: 6 }),
    step('js-10', 'Funções', 'Organize comportamentos reutilizáveis.', 'Construindo soluções', { playable: true, minXP: 1600 }),
    step('js-11', 'Arrays e objetos', 'Agrupe dados para modelar suas ideias.', 'Construindo soluções', { playable: true }),
    step('js-12', 'Desafio da trilha', 'Reúna seus conhecimentos em um pequeno desafio.', 'Construindo soluções', { minLevel: 6, minXP: 1800, minutes: 10, xp: 100 }),
  ] },
  { id: 'security', title: 'Introdução à cibersegurança', category: 'Cibersegurança', description: 'Reconheça riscos e aprenda os fundamentos para proteger pessoas, sistemas e informações.', icon: 'shield', color: 'purple', initialCompleted: 0, steps: [
    step('sec-quiz', 'Desafios de cibersegurança', 'Pratique com 20 questões inéditas, explicações e correção imediata.', 'Prática guiada', { playable: true, minutes: 25 }),
    step('sec-1', 'O que estamos protegendo?', 'Conheça confidencialidade, integridade e disponibilidade.', 'Fundamentos'),
    step('sec-2', 'Ameaças e riscos', 'Entenda a diferença entre ameaça, vulnerabilidade e risco.', 'Fundamentos'),
    step('sec-3', 'Engenharia social', 'Identifique manipulações e sinais de phishing.', 'Fundamentos'),
    step('sec-4', 'Senhas e autenticação', 'Aprenda boas práticas de proteção de contas.', 'Proteção no dia a dia'),
    step('sec-5', 'Navegação segura', 'Reconheça cuidados com links, arquivos e conexões.', 'Proteção no dia a dia'),
    step('sec-6', 'Permissões e acesso', 'Entenda o princípio do menor privilégio.', 'Proteção no dia a dia'),
    step('sec-7', 'Protegendo informações', 'Conheça os princípios de criptografia.', 'Defesa em prática', { minLevel: 6 }),
    step('sec-8', 'Backups e recuperação', 'Planeje a recuperação de informações.', 'Defesa em prática'),
    step('sec-9', 'Resposta a incidentes', 'Conheça as primeiras ações diante de um incidente.', 'Defesa em prática', { minXP: 1600 }),
    step('sec-10', 'Desafio de proteção', 'Analise um cenário e escolha práticas de segurança.', 'Defesa em prática', { minutes: 10, xp: 100 }),
  ] },
  { id: 'logic', title: 'Lógica de programação', category: 'Programação', description: 'Uma base sólida para pensar em algoritmos e resolver problemas com clareza.', icon: 'terminal', color: 'green', initialCompleted: 8, steps: [
    step('logic-1', 'Entendendo problemas', 'Identifique entradas, processos e resultados.', 'Raciocínio lógico'),
    step('logic-2', 'Sequências', 'Ordene instruções de forma coerente.', 'Raciocínio lógico'),
    step('logic-3', 'Algoritmos', 'Descreva soluções passo a passo.', 'Raciocínio lógico'),
    step('logic-4', 'Variáveis', 'Represente informações que mudam.', 'Raciocínio lógico'),
    step('logic-5', 'Condições', 'Tome decisões a partir de critérios.', 'Resolução de problemas'),
    step('logic-6', 'Repetições', 'Identifique padrões que podem ser repetidos.', 'Resolução de problemas'),
    step('logic-7', 'Decomposição', 'Divida soluções em partes menores.', 'Resolução de problemas'),
    step('logic-8', 'Desafio de lógica', 'Aplique o raciocínio em uma solução completa.', 'Resolução de problemas', { minutes: 10, xp: 100 }),
  ] },
  { id: 'web', title: 'Desenvolvimento web', category: 'Programação', description: 'Conecte estrutura, estilo e comportamento para criar experiências na web.', icon: 'code', color: 'blue', requirements: { minLevel: 6 }, initialCompleted: 0, steps: [
    step('web-1', 'Como a web funciona', 'Entenda o ciclo de uma requisição.', 'A base da web'),
    step('web-2', 'HTML semântico', 'Estruture conteúdo com significado.', 'A base da web'),
    step('web-3', 'CSS e layouts', 'Organize a interface com flex e grid.', 'A base da web'),
    step('web-4', 'Interfaces responsivas', 'Adapte sua interface a diferentes telas.', 'Interfaces'),
    step('web-5', 'JavaScript no navegador', 'Conecte interações ao documento.', 'Interfaces'),
    step('web-6', 'Seu primeiro projeto', 'Reúna os fundamentos em uma página.', 'Interfaces', { minutes: 10, xp: 100 }),
  ] },
  { id: 'defense', title: 'Defesa de sistemas', category: 'Cibersegurança', description: 'Investigue eventos, reconheça sinais e fortaleça a proteção dos sistemas.', icon: 'shield', color: 'purple', requirements: { minXP: 1800 }, initialCompleted: 0, steps: [
    step('def-1', 'Superfície de ataque', 'Identifique pontos de exposição.', 'Conhecendo o ambiente'),
    step('def-2', 'Logs e eventos', 'Leia os sinais deixados pelo sistema.', 'Conhecendo o ambiente'),
    step('def-3', 'Configuração segura', 'Reduza permissões e serviços desnecessários.', 'Fortalecendo a defesa'),
    step('def-4', 'Monitoramento', 'Reconheça desvios e comportamentos suspeitos.', 'Fortalecendo a defesa'),
    step('def-5', 'Plano de resposta', 'Organize ações diante de incidentes.', 'Fortalecendo a defesa', { minutes: 10, xp: 100 }),
  ] },
  { id: 'pentest', title: 'Segurança de aplicações', category: 'Cibersegurança', description: 'Aprenda a identificar falhas em aplicações dentro de ambientes autorizados.', icon: 'shield', color: 'purple', requirements: { minLevel: 7, minXP: 2300, prerequisite: 'security' }, initialCompleted: 0, steps: [
    step('app-1', 'Escopo e autorização', 'Defina os limites de uma avaliação de segurança.', 'Segurança com responsabilidade'),
    step('app-2', 'Validação de entradas', 'Entenda por que entradas precisam de validação.', 'Segurança com responsabilidade'),
    step('app-3', 'Autenticação e sessão', 'Reconheça cuidados na gestão de identidades.', 'Protegendo aplicações'),
    step('app-4', 'Controle de acesso', 'Avalie quem pode acessar cada recurso.', 'Protegendo aplicações'),
    step('app-5', 'Relatando descobertas', 'Documente falhas e suas possíveis correções.', 'Protegendo aplicações', { minutes: 10, xp: 100 }),
  ] },
];

export type LearnerProgress = { xp: number; completed: Partial<Record<TrailId, number>> };
export function completedCount(trail: Trail, progress: LearnerProgress) { return Math.min(trail.steps.length, Math.max(0, progress.completed[trail.id] ?? trail.initialCompleted)); }
export function accessReasons(requirements: AccessRequirement | undefined, progress: LearnerProgress): string[] {
  if (!requirements) return [];
  const reasons: string[] = [];
  if (requirements.minLevel && getLevel(progress.xp) < requirements.minLevel) reasons.push(`Atingir o nível ${requirements.minLevel} (seu nível: ${getLevel(progress.xp)}).`);
  if (requirements.minXP && progress.xp < requirements.minXP) reasons.push(`Acumular ${requirements.minXP.toLocaleString('pt-BR')} XP (faltam ${(requirements.minXP - progress.xp).toLocaleString('pt-BR')} XP).`);
  if (requirements.prerequisite) {
    const trail = trails.find(item => item.id === requirements.prerequisite)!;
    if (completedCount(trail, progress) < trail.steps.length) reasons.push(`Concluir a trilha ${trail.title}.`);
  }
  return reasons;
}
export function trailStatus(trail: Trail, progress: LearnerProgress) {
  if (accessReasons(trail.requirements, progress).length) return 'locked';
  const count = completedCount(trail, progress);
  return count === trail.steps.length ? 'completed' : count > 0 ? 'current' : 'available';
}
export function stepReasons(trail: Trail, index: number, progress: LearnerProgress) {
  const reasons = [...accessReasons(trail.requirements, progress), ...accessReasons(trail.steps[index], progress)];
  if (index > completedCount(trail, progress)) reasons.unshift(`Concluir a etapa anterior: ${trail.steps[index - 1].title}.`);
  return reasons;
}
export function stepStatus(trail: Trail, index: number, progress: LearnerProgress): StepStatus {
  if (index < completedCount(trail, progress)) return 'completed';
  if (stepReasons(trail, index, progress).length) return 'locked';
  return completedCount(trail, progress) > 0 ? 'current' : 'available';
}
export const statusLabels: Record<StepStatus, string> = { completed: 'Concluída', current: 'Em andamento', available: 'Disponível', locked: 'Bloqueada' };
