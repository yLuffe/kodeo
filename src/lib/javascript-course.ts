import { lesson, type ChoiceQuestion, type LessonDefinition } from './lesson';
import { gamification } from './learning';

export const primers: Record<string, { text: string; example: string; check: string }> = {
  'js-1': { text: 'JavaScript é uma linguagem que permite responder a eventos e alterar o conteúdo de uma página. Também pode rodar fora do navegador, por exemplo em Node.js.', example: 'console.log("Olá, JavaScript!");', check: 'O que torna uma página interativa? O código que reage às ações da pessoa, como o clique em um botão.' },
  'js-2': { text: 'Uma instrução realiza uma ação. console.log exibe um valor no console, uma ferramenta de diagnóstico para quem está programando.', example: 'console.log(2 + 3); // 5', check: 'Qual valor aparece no console? O número 5.' },
  'js-3': { text: 'Divida um problema em passos com entrada, processamento e saída. Para calcular pontos, receba o valor inicial, faça a soma e apresente o resultado.', example: 'const inicial = 10;\nconst resultado = inicial + 5;\nconsole.log(resultado);', check: 'Qual é o processamento? A soma de 5 ao valor inicial.' },
  'js-4': { text: 'Comentários explicam a intenção do código e não são executados. Use // para uma linha e /* */ para um bloco.', example: '// Bônus por concluir a etapa\nconst bonus = 50;', check: 'Qual linha declara um valor? A linha com const bonus.' },
  'js-5': { text: 'Uma expressão produz um valor. Parênteses controlam a ordem das operações. Textos entre aspas são strings.', example: 'const total = (2 + 3) * 4; // 20', check: 'O que seria calculado sem os parênteses? 2 + 12, ou seja, 14.' },
};

type Exercise = [title: string, code: string, options: [string, string, string], correct: number, explanation: string, hint: string];

function activity(step: number, title: string, module: string, introduction: string, example: string, exercises: Exercise[]): LessonDefinition {
  return {
    id: `js-${step}`, title, module, introduction, example, minutes: 6, course: lesson.course,
    questions: exercises.map(([title, code, options, correct, explanation, hint], index): ChoiceQuestion => {
      const offset = (step + index) % options.length;
      return {
        id: `js-${step}-q${index + 1}`, type: 'choice', title, code, explanation, hint,
        options: [...options.slice(offset), ...options.slice(0, offset)],
        correct: (correct + options.length - offset) % options.length,
        context: 'Leia o trecho e selecione a alternativa correta.',
        xp: gamification.questionXP,
      };
    }),
  };
}

export const javascriptLessons: Record<string, LessonDefinition> = {
  [lesson.id]: lesson,
  'js-7': activity(7, 'Operadores', 'Dados e decisões', 'Use operadores para calcular, comparar valores e combinar condições.', 'const passou = 7 >= 6 && true; // true', [
    ['Qual é o resultado da expressão?', '10 % 3', ['0', '1', '3'], 1, '% retorna o resto da divisão. 10 dividido por 3 deixa resto 1.', 'Pense no que sobra após formar três grupos de três.'],
    ['O que a comparação retorna?', '5 === "5"', ['true', 'false', 'undefined'], 1, 'A igualdade estrita compara valor e tipo. Um número e uma string são diferentes.', 'Observe as aspas no segundo valor.'],
    ['O que aparece no console?', 'console.log(2 + 3 * 4);', ['20', '14', '24'], 1, 'A multiplicação vem antes da soma. Primeiro 3 × 4, depois somamos 2.', 'Resolva a multiplicação primeiro.'],
    ['A condição é verdadeira?', 'const liberado = true && false;', ['Sim', 'Não', 'A expressão causa erro'], 1, 'Com &&, os dois valores precisam ser verdadeiros para obter true neste exemplo.', 'Leia && como “e”.'],
  ]),
  'js-8': activity(8, 'Tomando decisões', 'Dados e decisões', 'if executa um bloco quando a condição é verdadeira. else cobre o caminho alternativo.', 'if (xp >= 100) {\n  console.log("Liberado");\n} else {\n  console.log("Em andamento");\n}', [
    ['Qual mensagem aparece?', 'const xp = 80;\nif (xp >= 100) console.log("Liberado");\nelse console.log("Em andamento");', ['Liberado', 'Em andamento', 'As duas mensagens'], 1, '80 é menor que 100, então o bloco else é executado.', 'Compare 80 com 100.'],
    ['O valor 100 libera a etapa?', 'if (100 >= 100) console.log("Liberado");', ['Sim', 'Não', 'Depende do navegador'], 0, '>= aceita valores maiores ou iguais ao limite.', 'O sinal = inclui o limite.'],
    ['Qual caminho é escolhido?', 'const nivel = 2;\nif (nivel === 1) console.log("A");\nelse if (nivel === 2) console.log("B");\nelse console.log("C");', ['A', 'B', 'C'], 1, 'A primeira condição falha e a segunda é verdadeira. Apenas B é exibido.', 'As condições são avaliadas em ordem.'],
    ['Qual mensagem sai quando ativo é falso?', 'const ativo = false;\nif (!ativo) console.log("Pausado");\nelse console.log("Ativo");', ['Ativo', 'Pausado', 'Nenhuma'], 1, '! inverte o booleano. !false é true, então aparece Pausado.', 'Leia ! como “não”.'],
  ]),
  'js-9': activity(9, 'Laços de repetição', 'Construindo soluções', 'Use for para repetir com um contador e while para repetir enquanto uma condição valer.', 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}', [
    ['Quais números são exibidos?', 'for (let i = 0; i < 3; i++) console.log(i);', ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3'], 1, 'O contador começa em 0 e para antes de 3, pois a condição é i < 3.', 'Leia o valor inicial e o limite.'],
    ['Quantas vezes a instrução é executada?', 'let i = 3;\nwhile (i > 0) {\n  console.log(i);\n  i--;\n}', ['2 vezes', '3 vezes', '4 vezes'], 1, 'A execução ocorre com i igual a 3, 2 e 1. Com 0, a condição fica falsa.', 'O decremento acontece depois de exibir.'],
    ['Qual é o total ao terminar?', 'let total = 0;\nfor (let i = 1; i <= 3; i++) total += i;', ['3', '6', '7'], 1, 'O acumulador soma 1 + 2 + 3, chegando a 6.', 'Anote o valor de total a cada repetição.'],
    ['O que evita uma repetição infinita neste caso?', 'let i = 0;\nwhile (i < 3) {\n  i++;\n}', ['A atualização i++', 'O uso de let', 'As chaves'], 0, 'i++ faz o contador alcançar 3. Nesse ponto i < 3 passa a ser falso.', 'Procure o que modifica a condição.'],
  ]),
  'js-10': activity(10, 'Funções', 'Construindo soluções', 'Funções agrupam instruções reutilizáveis. Parâmetros recebem valores e return devolve um resultado.', 'function dobrar(valor) {\n  return valor * 2;\n}', [
    ['Qual valor a chamada devolve?', 'function dobrar(valor) { return valor * 2; }\ndobrar(4);', ['4', '8', 'undefined'], 1, 'O argumento 4 entra no parâmetro valor. A função devolve 4 × 2.', 'Substitua valor por 4.'],
    ['Qual é o parâmetro?', 'function saudar(nome) { return "Olá, " + nome; }\nsaudar("Ana");', ['saudar', 'nome', '"Ana"'], 1, 'nome é o parâmetro declarado. "Ana" é o argumento passado na chamada.', 'Observe o identificador na declaração.'],
    ['O que a função devolve?', 'function praticar() { console.log("Prática"); }\npraticar();', ['"Prática"', 'true', 'undefined'], 2, 'console.log imprime uma mensagem. Sem return com valor, a função devolve undefined.', 'Imprimir e devolver são ações diferentes.'],
    ['Qual é o resultado?', 'const somar = (a, b) => a + b;\nsomar(2, 5);', ['25', '7', 'undefined'], 1, 'Uma arrow function com corpo de expressão devolve o valor da expressão, aqui 2 + 5.', 'Os dois argumentos são números.'],
  ]),
  'js-11': activity(11, 'Arrays e objetos', 'Construindo soluções', 'Arrays guardam itens por posição. Objetos agrupam valores em propriedades com nome.', 'const perfil = { nome: "Ana", xp: 100 };\nconst trilhas = ["JS", "Web"];', [
    ['Qual item é selecionado?', 'const trilhas = ["JS", "Web", "Dados"];\ntrilhas[1];', ['JS', 'Web', 'Dados'], 1, 'A primeira posição é 0. O índice 1 seleciona o segundo item, Web.', 'Conte a partir de zero.'],
    ['Qual expressão lê o XP do perfil?', 'const perfil = { nome: "Ana", xp: 100 };', ['perfil[100]', 'perfil.xp', 'perfil.nome'], 1, 'A notação com ponto acessa a propriedade pelo nome. perfil.xp vale 100.', 'Qual propriedade tem o valor 100?'],
    ['Quantos itens o array terá?', 'const tarefas = ["Estudar"];\ntarefas.push("Praticar");\ntarefas.length;', ['1', '2', '3'], 1, 'push adiciona um item ao final. length informa a quantidade total de itens.', 'O array já tinha um item antes do push.'],
    ['Qual nome é retornado?', 'const perfis = [{ nome: "Ana" }, { nome: "Leo" }];\nperfis[0].nome;', ['Ana', 'Leo', 'undefined'], 0, 'perfis[0] seleciona o primeiro objeto e .nome lê a propriedade desse objeto.', 'Leia a expressão da esquerda para a direita.'],
  ]),
};

export function isJavascriptLesson(id: string | null): id is string {
  return id !== null && Object.hasOwn(javascriptLessons, id);
}

export function lessonForProfile(id: string, firstName: string): LessonDefinition {
  const definition = javascriptLessons[id];
  if (id !== lesson.id || !firstName) return definition;
  const name = JSON.stringify(firstName);
  return { ...definition, questions: definition.questions.map(question =>
    question.type === 'code' && question.challenge === 'profile' ? {
      ...question, expectedName: firstName,
      context: `Declare const nome com o texto ${name} e const ativo com o booleano true. Use apenas essas duas declarações.`,
      criteria: [`Declarar const nome com a string ${name}`, question.criteria[1]],
      solution: `const nome = ${name};\nconst ativo = true;`,
      explanation: `${name} é uma string e true é um booleano. const mantém a referência fixa.`,
    } : question) };
}
