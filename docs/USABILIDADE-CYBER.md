# Revisão heurística e responsividade — Kodeo

## Escopo e situação da publicação

A aplicação exportada para o GitHub Pages contém a rota `/licoes/ciberseguranca/`. Na execução do workflow **Publicar Kodeo no GitHub Pages** de 09/11/2026 (run 42720480301), o log de empacotamento contém `./licoes/ciberseguranca/index.html`. Um build bem-sucedido, portanto, não confirma que a URL pública seja acessível.

A PR #7 do projeto (incorporada à main antes desta revisão) adicionou verificação do arquivo gerado e uma etapa pós-deploy para validar a URL pública e executar o fluxo de responder/retomar a questão no navegador. O resultado da verificação pós-deploy deve ser consultado em **Actions**, não presumido a partir da conclusão do build.

Não foi possível abrir a URL hospedada diretamente no ambiente de análise; a falha pública precisa ser validada pelo workflow pós-deploy e pelo navegador do usuário.

## Heurísticas de Nielsen — avaliação do fluxo de estudo

| Heurística | Avaliação e medida |
| --- | --- |
| 1. Visibilidade do status | A prática apresenta questão atual, total, barra e XP. Para lições longas, o contador compacto substitui 20 marcadores densos. |
| 2. Correspondência com o mundo real | Textos e orientações da prática ficam em português; enunciados usam contexto cotidiano e exemplos reais de segurança. |
| 3. Controle e liberdade | Sair/retomar, voltar ao exercício anterior e revisar mantêm os caminhos de recuperação. A conclusão não deve duplicar XP. |
| 4. Consistência e padrões | O quiz usa os mesmos botões, painéis e linguagem de feedback do restante das lições, em vez de uma interface divergente. |
| 5. Prevenção de erros | Botão de resposta desabilitado sem seleção, sem avanço sem acerto; evitar que o usuário perca o rascunho ao sair. |
| 6. Reconhecimento em vez de memorização | Estado atual, explicação, dica e opções permanecem visíveis; instruções não devem mencionar campos inexistentes. |
| 7. Flexibilidade e eficiência | Teclado, revisão e retomada; o mapa permite alternar para visualização em lista em telas estreitas. |
| 8. Estética e minimalismo | O painel de 20 marcadores foi substituído por um resumo que não compete com a pergunta. |
| 9. Diagnóstico e recuperação de erros | Feedback explica a escolha; o botão **Tentar novamente** permite correção após erro. |
| 10. Ajuda e documentação | Ajuda contextual: instruções sobre editor de código só aparecem onde existe exercício de código. |

Referência: Nielsen Norman Group — https://www.nngroup.com/articles/ten-usability-heuristics/

## Matriz de responsividade e critérios de aceitação

| Largura | Dispositivo-alvo | Critérios |
| --- | --- | --- |
| 320 px | Celular pequeno | Controles tocáveis, alternativas legíveis, sem rolagem horizontal do diálogo |
| 390 px | Celular | Fluxo completo de responder, corrigir e continuar |
| 768 px | Tablet retrato | Conteúdo ajustado e botões sem sobreposição |
| 1024 px | Tablet paisagem | Painéis com largura fluida e texto sem cortes |

Os testes automatizados em `tests/e2e/cyber-responsive.spec.ts` verificam o fluxo nas quatro larguras, a ausência de rolagem horizontal no diálogo, a ajuda contextual e a retomada após recarregar.

## Checklist antes de publicar

1. Confirmar que a PR passou no workflow **Validar Kodeo**, incluindo Playwright em desktop e mobile.
2. Confirmar que o workflow **Publicar Kodeo no GitHub Pages** produziu `out/licoes/ciberseguranca/index.html`.
3. Confirmar resultado **verde** no job `verify-cyber` após o deploy público.
4. Abrir a URL publicada diretamente em uma nova aba, testar resposta incorreta/correta e recarregar a segunda questão.
5. Revisar o comportamento em hardware real, inclusive zoom de texto, teclado virtual e orientação retrato/paisagem; testes em navegador automatizado não substituem essa validação.

A avaliação heurística é qualitativa e não equivale a uma certificação formal de acessibilidade. Contraste, leitura por leitores de tela e auditoria WCAG completa exigem verificação específica.
