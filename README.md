<div align="center">

# ⌘ Kodeo

**Aprenda. Pratique. Evolua.**

Uma plataforma gamificada para aprender programação e cibersegurança,<br />
uma descoberta de cada vez.

![Status: protótipo](https://img.shields.io/badge/status-prot%C3%B3tipo-143352?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-App_Router-202938?style=flat-square)
![React](https://img.shields.io/badge/React-interface-345e8b?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-tipado-345e8b?style=flat-square)
![Material UI](https://img.shields.io/badge/Material_UI-design_system-345e8b?style=flat-square)

[O projeto](#o-projeto) · [Funcionalidades](#funcionalidades) · [Começar](#começar) · [Roadmap](#roadmap)

</div>

---

## O projeto

O Kodeo transforma o estudo em uma jornada: você percorre trilhas, pratica com questões, entende seus erros e acompanha sua evolução com XP, níveis e conquistas.

A proposta é simples: **a gamificação apoia o aprendizado, e o conteúdo continua sendo o foco.** Interface clara, arquitetura enxuta e desenvolvimento incremental orientam cada etapa.

## Funcionalidades

| Área | O que você encontra |
| --- | --- |
| **Dashboard** | Tarefas do dia, progresso, experiência, níveis e conquistas. |
| **Mapa de aprendizado** | Percursos pontilhados em formato de tabuleiro, com etapas selecionáveis. |
| **Biblioteca de trilhas** | Blocos compactos, filtros por status e visualização alternativa em lista. |
| **Desbloqueios** | Requisitos explícitos de nível, XP, etapa anterior e conclusão de outras trilhas. |
| **Prática** | Lição de JavaScript com alternativas, resposta escrita, editor de código e feedback por critério. |
| **Aparência** | Temas claro e escuro, azul sóbrio e layout responsivo. |
| **Acessibilidade** | Estados com texto e ícones, foco visível e respeito à redução de movimento. |

> **Estágio atual:** Fase 1 com fluxo completo em dados simulados e sem login. Veja os [critérios e a validação da Fase 1](docs/FASE_1.md). O progresso e o XP reiniciam ao recarregar a página; a preferência de tema fica salva no navegador. As demais lições apresentam resumos, com suas atividades completas previstas para as próximas etapas. XP é acumulado, não gasto para acessar trilhas.

### Ambiente de lições

A rota `/licoes/variaveis` oferece uma introdução e cinco exercícios em uma área de estudo ampla. O aluno pode consultar dicas, corrigir respostas, voltar ao exercício anterior e sair para retomar o rascunho nesta sessão. O resumo final apresenta tentativas, recompensas e conquistas; revisões não concedem XP novamente.

Os exercícios de código usam **Acorn** para analisar sintaxe e critérios específicos, aceitando as variações descritas no enunciado. Nenhum código enviado pelo aluno é executado. Esta etapa não é um avaliador genérico de programas. Respostas curtas seguem os valores aceitos pelo exercício.

Tentativas e eventos de XP ficam no estado demonstrativo da sessão. A validação confiável no servidor e a persistência continuam previstas na integração com Supabase.

## Tecnologias

- **Next.js + React** — aplicação com App Router.
- **TypeScript** — tipos para dados, componentes e regras de acesso.
- **Material UI + Emotion** — componentes e tema centralizado.
- **Lucide** — ícones da interface.
- **Acorn** — análise de sintaxe dos exercícios de código, sem execução.
- **Supabase + PostgreSQL** — planejados para autenticação, persistência e políticas de acesso.

## Começar

Requisitos: **Node.js 20.9+** e **pnpm**.

```bash
git clone https://github.com/yLuffe/kodeo.git
cd kodeo
pnpm install
pnpm dev
```

Abra **[localhost:3000](http://localhost:3000)** para o dashboard ou **[localhost:3000/trilhas](http://localhost:3000/trilhas)** para o mapa de aprendizado.

Nenhuma conta externa ou chave de API é necessária para executar o protótipo.

### Verificação e produção

```bash
pnpm typecheck  # Verificar tipos
pnpm test       # Testar regras de progressão e desbloqueio
pnpm build      # Gerar a versão de produção
pnpm start      # Executar a versão compilada
```

### GitHub Pages

Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como fonte.
O workflow **Publicar Kodeo no GitHub Pages** roda a cada envio à `main` e também pode ser
iniciado manualmente pela aba **Actions**. A URL publicada aparece no resultado do deploy.

O workflow gera `out/index.html` e um índice para cada rota. O prefixo do repositório
é aplicado aos arquivos estáticos e à navegação. Para testar a exportação localmente:

```bash
KODEO_STATIC_EXPORT=1 KODEO_BASE_PATH=/kodeo pnpm build
```

Essa publicação serve a versão estática da Fase 1, com dados simulados.

### Regressão de navegação no navegador

```bash
pnpm exec playwright install chromium  # Preparar o navegador uma vez
pnpm test:e2e                          # Compilar, iniciar e testar a aplicação
```

A suíte cobre o botão **Explorar** da tarefa de cibersegurança, a lição completa, retomada, erros, teclado, editor, conclusão e revisão sem XP duplicado. Executa cenários em desktop e mobile, incluindo uma verificação em 320 px. O servidor de teste usa a porta 3100. Para usar um Chromium já instalado, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` com o caminho do executável.

## Organização

```text
src/
├── app/                 # Rotas, layout e estilos globais
│   └── trilhas/          # Tela do mapa de aprendizado
├── components/          # Interface, tema e componentes das trilhas
└── lib/                 # Dados simulados e regras de gamificação

tests/                   # Testes das regras de acesso e progressão
```

As regras de nível, requisitos e acesso às etapas ficam em `src/lib/trails.ts`. Cursos e recompensas demonstrativas ficam em `src/lib/learning.ts`; questões em `src/lib/lesson.ts`. Os valores exibidos de XP e progresso são derivados em `src/lib/progress.ts`.

## Roadmap

- [x] Dashboard com perfil demonstrativo.
- [x] Temas claro e escuro.
- [x] Mapa interativo e biblioteca de trilhas.
- [x] Requisitos de acesso por nível, XP e pré-requisitos.
- [x] Lição com formulários, feedback, exercícios de código e atualização de progresso.
- [x] Progresso compartilhado entre dashboard e mapa, níveis dinâmicos e navegação sem reiniciar a sessão.
- [x] Menu mobile com controle de foco e Escape; aviso explícito dos dados simulados.
- [x] Testes do fluxo da Fase 1 em desktop e mobile.
- [ ] Expandir os conteúdos e as atividades das lições.
- [ ] Integrar Supabase Auth, PostgreSQL e Row Level Security.
- [ ] Persistir tentativas, progresso, conquistas e histórico de XP.
- [ ] Validar respostas e recompensas no servidor.
- [ ] Refinar a acessibilidade e realizar testes de usabilidade.

## Cuidados com configuração

Arquivos de ambiente, chaves privadas, credenciais locais e saídas de compilação ficam fora do versionamento. Exemplos de configuração devem conter somente valores fictícios. Na integração futura com Supabase, chaves administrativas serão usadas exclusivamente no servidor.

---

<div align="center">

**Um passo de cada vez. Um pouco melhor a cada descoberta.**

</div>
