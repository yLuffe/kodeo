# Kodeo

Plataforma gamificada para praticar JavaScript e cibersegurança. O aluno percorre trilhas, responde a exercícios, recebe explicações e acompanha seu progresso por XP e conquistas.

**[Abrir o Kodeo](https://yluffe.github.io/kodeo/)** · [Guia da trilha de JavaScript](docs/JAVASCRIPT.md)

## Funcionalidades

| Área | O que funciona hoje |
| --- | --- |
| **Perfil de demonstração** | A primeira visita pede o primeiro nome. O perfil, os rascunhos, as tentativas e o progresso ficam salvos no navegador. |
| **Painel de aprendizado** | Mostra o nível, o XP, as tarefas e o próximo exercício recomendado. A meta semanal registra dias em que o aluno praticou. |
| **Trilhas** | Etapas com status, requisitos de desbloqueio e filtros. A lista abre por padrão no celular, com opção de alternar para o mapa. |
| **JavaScript** | Etapas 1 a 5 com leitura, exemplos e revisão. Etapas 6 a 11 com 25 exercícios, entre alternativas, resposta escrita e desafios de código. |
| **Cibersegurança** | A primeira atividade da trilha tem 20 questões com quatro alternativas, dicas, explicações e retomada após recarregar. |
| **Feedback e recompensas** | A resposta recebe correção imediata. A barra mostra o XP conquistado na lição e a primeira conclusão libera a próxima etapa quando os requisitos são cumpridos. |
| **Conquistas** | Nove metas ligadas a ações como corrigir um erro, resolver desafios de código e concluir a prática de cibersegurança. Revisões não duplicam XP. |
| **Mobile e acessibilidade** | Layout adaptável, alvos de toque maiores, temas claro e escuro, foco visível, controles com nomes acessíveis e suporte à preferência por movimento reduzido. |

O perfil é demonstrativo e vale para o navegador e o endereço usados. Limpar os dados do site reinicia a demonstração. As cinco primeiras etapas de JavaScript e o XP inicial já vêm preenchidos para facilitar a apresentação. O XP de Cyber soma no total geral, enquanto a conclusão avança apenas a trilha de cibersegurança.

## Stack

| Tecnologia | Papel no Kodeo |
| --- | --- |
| **Next.js** | Organiza as rotas com App Router. O build pode exportar as páginas para HTML estático e publicá-las no GitHub Pages. |
| **React + TypeScript** | React mantém o estado da interface e das lições. TypeScript define os contratos de questões, respostas, progresso e recompensas. |
| **Material UI + Emotion** | Fornecem botões, formulários, diálogos e barras de progresso com um tema compartilhado. CSS adapta o layout ao tamanho da tela. |
| **Lucide** | Fornece os ícones da navegação, dos estados e das recompensas. |
| **Acorn** | Analisa a sintaxe dos exercícios de código e verifica critérios específicos. O código digitado não é executado. |
| **localStorage** | Guarda o perfil e as sessões de prática localmente, sem conta externa ou chave de API. |
| **Playwright + Node.js** | Playwright verifica os fluxos no navegador em projetos desktop e mobile. Node.js executa os testes unitários das regras de negócio. |
| **GitHub Actions + Pages** | Actions valida os PRs e publica a exportação estática após mudanças na `main`. Pages hospeda os arquivos gerados. |

**Planejado para as próximas fases:** autenticação, sincronização entre dispositivos e validação de respostas e recompensas no servidor com Supabase e PostgreSQL.

## Executar localmente

Requisitos: Node.js 24 e pnpm 11.

```bash
git clone https://github.com/yLuffe/kodeo.git
cd kodeo
pnpm install --frozen-lockfile
pnpm dev
```

Abra [localhost:3000](http://localhost:3000). O mapa fica em `/trilhas`, a prática de JavaScript começa em `/licoes/variaveis` e o quiz de Cyber fica em `/licoes/ciberseguranca`.

## Validar e publicar

```bash
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
KODEO_STATIC_EXPORT=1 KODEO_BASE_PATH=/kodeo pnpm build
```

O GitHub Pages usa **GitHub Actions** como fonte em **Settings → Pages → Build and deployment**. O workflow gera `out/index.html` e os índices das rotas, incluindo o prefixo `/kodeo`. A aba **Actions** mostra o status e a URL da publicação.

O [registro da Fase 1](docs/FASE_1.md) descreve a entrega inicial. As regras de XP e acesso ficam em `src/lib`; as telas e seus estilos ficam em `src/app` e `src/components`.
