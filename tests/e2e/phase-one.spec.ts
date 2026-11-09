import { expect, test } from '@playwright/test';
import { begin, finishQuestions, navigate, noOverflow } from './helpers';

test('fluxo completo: erro, retomada, conclusão, mapa e revisão sem XP duplicado', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.demo-notice')).toContainText('ficam salvos neste navegador');
  await noOverflow(page);
  await begin(page);
  const dialog = page.locator('.lesson-dialog');
  const verify = dialog.getByRole('button', { name: 'Verificar resposta', exact: true });
  await expect(verify).toBeDisabled();
  const wrong = dialog.getByRole('radio', { name: /const/ });
  await wrong.focus();
  await page.keyboard.press('Space');
  await verify.focus();
  await page.keyboard.press('Enter');
  await expect(dialog.getByRole('status')).toContainText('const impede reatribuir');
  await expect(dialog.locator('.lesson-reward')).toContainText('0 XP');
  await expect(dialog.locator('.lesson-feedback')).toBeFocused();
  await noOverflow(page);
  await dialog.getByRole('button', { name: 'Sair e continuar depois' }).click();
  await expect(page).toHaveURL('/');
  await page.goBack();
  await expect(dialog.getByRole('heading', { name: 'Qual declaração permite reatribuir o valor de uma variável?' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: /Bom te ver/ })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar aprendendo' }).click();
  await expect(wrong).toBeChecked();
  await dialog.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await finishQuestions(page);
  await expect(dialog.locator('.lesson-summary-stats')).toContainText('100 XP');
  await expect(dialog.locator('.summary-unlock')).toContainText('Conquista desbloqueada');
  await dialog.getByText('Ver minhas tentativas').click();
  await expect(dialog.locator('.attempt-history li')).toHaveCount(6);
  await dialog.getByRole('button', { name: 'Voltar ao meu aprendizado' }).click();
  await expect(page.locator('.stats-grid')).toContainText('1.340');
  await expect(page.locator('.stats-grid')).toContainText('14');
  await expect(page.locator('.hero-footer')).toContainText('50%');
  await expect(page.locator('.course-card').filter({ hasText: 'Fundamentos de JavaScript' })).toContainText('6 de 12');
  await expect(page.locator('.achievement').filter({ hasText: 'Mais um passo' })).not.toHaveClass(/locked/);
  await navigate(page, 'Minhas trilhas');
  await expect(page.locator('.map-progress')).toContainText('6 de 12');
  await expect(page.getByRole('button', { name: /Etapa 7: Operadores. Em andamento/ })).toBeVisible();
  await page.getByRole('button', { name: /Etapa 6: Variáveis e tipos/ }).click();
  await page.getByRole('button', { name: 'Revisar lição', exact: true }).click();
  await page.getByRole('button', { name: 'Começar revisão', exact: true }).click();
  await finishQuestions(page);
  await expect(dialog.locator('.lesson-summary-stats')).toContainText('0 XP');
  await dialog.getByRole('button', { name: 'Voltar ao meu aprendizado' }).click();
  await navigate(page, 'Visão geral');
  await expect(page.locator('.stats-grid')).toContainText('1.340');
  await page.getByRole('button', { name: 'Kodeo, início' }).isVisible().then(async visible => {
    if (visible) await page.getByRole('button', { name: 'Kodeo, início' }).click();
  });
  await expect(page.locator('.stats-grid')).toContainText('1.340');
  await page.reload();
  await expect(page.locator('.stats-grid')).toContainText('1.340');
  expect(errors).toEqual([]);
});

test('editor: sintaxe, critérios, rascunho, desfazer e teclado', async ({ page }) => {
  await page.goto('/licoes/variaveis');
  const dialog = page.locator('.lesson-dialog');
  await dialog.getByRole('button', { name: 'Vamos praticar' }).click();
  for (const option of [/let/, /15/]) {
    await dialog.getByRole('radio', { name: option }).check();
    await dialog.getByRole('button', { name: 'Verificar resposta', exact: true }).click();
    await dialog.getByRole('button', { name: 'Próximo exercício', exact: true }).click();
  }
  await dialog.getByRole('textbox', { name: 'Sua resposta escrita' }).fill('boolean');
  await dialog.getByRole('button', { name: 'Verificar resposta', exact: true }).click();
  await dialog.getByRole('button', { name: 'Próximo exercício', exact: true }).click();
  const editor = dialog.getByRole('textbox', { name: 'Seu código JavaScript' });
  await editor.fill('let pontos = ;');
  await dialog.getByRole('button', { name: 'Analisar código', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('Vamos ajustar a sintaxe');
  await dialog.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(editor).toBeFocused();
  await editor.fill('let pontos = 10; pontos += 6;');
  await dialog.getByRole('button', { name: 'Analisar código', exact: true }).click();
  await expect(dialog.locator('.criterion-failed')).toContainText('Somar 5');
  await dialog.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await dialog.getByRole('button', { name: 'Restaurar modelo', exact: true }).click();
  await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
  await expect(editor).toHaveValue('let pontos = 10; pontos += 6;');
  await dialog.getByRole('button', { name: 'Sair e continuar depois' }).click();
  await expect(page).toHaveURL('/trilhas?trilha=javascript');
  await page.getByRole('button', { name: /Etapa 6: Variáveis e tipos/ }).click();
  await page.getByRole('button', { name: 'Continuar lição', exact: true }).click();
  await expect(editor).toHaveValue('let pontos = 10; pontos += 6;');
  await editor.focus();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Restaurar modelo', exact: true })).toBeFocused();
  await noOverflow(page);
});

test('mapa e lista: bloqueios explicados, filtros e etapa sem conteúdo', async ({ page }) => {
  await page.goto('/trilhas');
  await page.getByRole('button', { name: /Etapa 7: Operadores/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Concluir a etapa anterior');
  await page.getByRole('button', { name: 'Voltar ao mapa' }).click();
  await page.getByRole('button', { name: 'Ver como lista' }).click();
  await page.getByRole('button', { name: /Introdução à cibersegurança/ }).click();
  await page.getByRole('button', { name: /Etapa 1: O que estamos protegendo/ }).click();
  await expect(page.getByRole('dialog')).toContainText('O conteúdo interativo desta lição será adicionado');
  await expect(page.getByRole('button', { name: 'Continuar lição', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Voltar ao mapa' }).click();
  await page.getByRole('button', { name: /Bloqueadas/ }).click();
  await expect(page.locator('.map-access-banner')).toContainText('Atingir o nível 6');
  await page.getByRole('button', { name: /Concluídas/ }).click();
  await expect(page.getByRole('heading', { name: 'Lógica de programação', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Todas/ }).click();
  await expect(page.locator('.library-card')).toHaveCount(6);
  await noOverflow(page);
});

test('tema funciona mesmo se o navegador bloquear armazenamento', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
  });
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Primeiro nome' }).fill('Kodeo');
  await page.getByRole('button', { name: 'Começar', exact: true }).click();
  await page.getByRole('button', { name: 'Ativar modo escuro', exact: true }).click();
  await expect(page.locator('.app').first()).toHaveAttribute('data-theme', 'dark');
  await begin(page);
  await expect(page.getByRole('button', { name: 'Verificar resposta', exact: true })).toBeDisabled();
});

test('mobile: menu mantém foco, Escape fecha e fluxo cabe em 320px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Comportamento específico do menu mobile.');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await noOverflow(page);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('button', { name: 'Como funciona', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Kodeo, início' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  await begin(page);
  await noOverflow(page);
});
