import { parse } from 'acorn';
import type { CodeQuestion, LessonQuestion } from './lesson';

export interface CriterionResult { label: string; passed: boolean; }
export interface AnswerResult { correct: boolean; kind: 'correct' | 'incorrect' | 'empty' | 'syntax' | 'unsupported' | 'too-long'; title: string; message: string; criteria?: CriterionResult[]; }
interface AstNode { type: string; body?: AstNode[]; kind?: string; declarations?: AstNode[]; id?: AstNode; name?: string; init?: AstNode | null; expression?: AstNode; value?: unknown; operator?: string; left?: AstNode; right?: AstNode; }
export const MAX_ANSWER_LENGTH = 2000;
const matchesId = (node: AstNode | undefined, name: string) => node?.type === 'Identifier' && node.name === name;
const matchesLiteral = (node: AstNode | undefined | null, value: unknown) => node?.type === 'Literal' && node.value === value;
const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/[.!?]+$/, '').trim();

/** Analisa somente os formatos definidos para cada exercício. Nunca executa o texto enviado. */
export function analyzeCode(source: string, question: CodeQuestion): AnswerResult {
  if (source.length > MAX_ANSWER_LENGTH) return { correct: false, kind: 'too-long', title: 'Seu código está muito longo.', message: `Use até ${MAX_ANSWER_LENGTH} caracteres para este exercício.` };
  let body: AstNode[];
  try {
    body = (parse(source, { ecmaVersion: 2022, sourceType: 'script' }) as unknown as AstNode).body!.filter(node => node.type !== 'EmptyStatement');
  } catch (error) {
    const location = (error as { loc?: { line: number } }).loc;
    return { correct: false, kind: 'syntax', title: 'Vamos ajustar a sintaxe.', message: `Confira ${location ? `a linha ${location.line}` : 'seu código'}: verifique nomes, sinais de atribuição e aspas. Nenhum código foi executado.` };
  }
  if (body.length === 0) return { correct: false, kind: 'empty', title: 'Falta escrever sua resposta.', message: 'Os comentários são um ponto de partida. Escreva as instruções pedidas antes de verificar.' };
  let criteria: CriterionResult[];
  if (question.challenge === 'points') {
    if (body.some(node => node.type !== 'VariableDeclaration' && !(node.type === 'ExpressionStatement' && node.expression?.type === 'AssignmentExpression'))) return unsupported();
    const declaration = body[0];
    const assignment = body[1]?.expression;
    const declared = declaration?.type === 'VariableDeclaration' && declaration.kind === 'let' && declaration.declarations?.length === 1 && matchesId(declaration.declarations[0].id, 'pontos') && matchesLiteral(declaration.declarations[0].init, 10);
    const addsFive = assignment?.operator === '+=' && matchesLiteral(assignment.right, 5) || assignment?.operator === '=' && assignment.right?.type === 'BinaryExpression' && assignment.right.operator === '+' && ((matchesId(assignment.right.left, 'pontos') && matchesLiteral(assignment.right.right, 5)) || (matchesLiteral(assignment.right.left, 5) && matchesId(assignment.right.right, 'pontos')));
    criteria = [{ label: question.criteria[0], passed: !!declared }, { label: question.criteria[1], passed: body.length === 2 && !!assignment && matchesId(assignment.left, 'pontos') && !!addsFive }];
  } else {
    if (body.some(node => node.type !== 'VariableDeclaration')) return unsupported();
    const declarations = body.flatMap(node => (node.declarations ?? []).map(value => ({ ...value, kind: node.kind })));
    const allowed = declarations.length === 2 && declarations.every(node => matchesId(node.id, 'nome') || matchesId(node.id, 'ativo'));
    criteria = [
      { label: question.criteria[0], passed: allowed && declarations.some(node => node.kind === 'const' && matchesId(node.id, 'nome') && matchesLiteral(node.init, question.expectedName ?? 'Kodeo')) },
      { label: question.criteria[1], passed: allowed && declarations.some(node => node.kind === 'const' && matchesId(node.id, 'ativo') && matchesLiteral(node.init, true)) },
    ];
  }
  const correct = criteria.every(item => item.passed);
  return { correct, kind: correct ? 'correct' : 'incorrect', title: correct ? 'Seu código atende ao desafio!' : 'Seu código ainda precisa de um ajuste.', message: correct ? question.explanation : 'Confira os critérios abaixo. Mantenha o que já está correto e ajuste os itens indicados antes de tentar novamente.', criteria };
}
function unsupported(): AnswerResult { return { correct: false, kind: 'unsupported', title: 'Vamos manter o foco no exercício.', message: 'Use somente as declarações e atribuições solicitadas. Chamadas de funções, laços e outras instruções não fazem parte desta atividade. Seu código não é executado.' }; }
export function evaluateAnswer(question: LessonQuestion, answer: string): AnswerResult {
  if (!answer.trim()) return { correct: false, kind: 'empty', title: 'Preencha sua resposta.', message: question.type === 'choice' ? 'Escolha uma alternativa antes de verificar.' : 'Escreva uma resposta antes de verificar.' };
  if (answer.length > MAX_ANSWER_LENGTH) return { correct: false, kind: 'too-long', title: 'Sua resposta está muito longa.', message: `Use até ${MAX_ANSWER_LENGTH} caracteres para este exercício.` };
  if (question.type === 'code') return analyzeCode(answer, question);
  const correct = question.type === 'choice' ? answer === String(question.correct) : question.accepted.includes(normalizeText(answer));
  return { correct, kind: correct ? 'correct' : 'incorrect', title: correct ? 'Resposta correta. Bom trabalho!' : 'Ainda não. Vamos entender juntos.', message: correct ? question.explanation : question.type === 'choice' ? (question.incorrectFeedback?.[Number(answer)] ?? 'Releia o enunciado e a dica, depois tente novamente. Você pode corrigir sua resposta sem perder XP.') : 'true e false são valores booleanos. Responda com o nome desse tipo: boolean em inglês ou booleano em português. Valores numéricos e textos têm outros tipos.' };
}
