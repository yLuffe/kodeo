import { expect, test } from '@playwright/test';
import { begin, noOverflow } from './helpers';

test('painel, trilha e exercício se ajustam ao tamanho da tela', async ({ page }, info) => {
  const widths = info.project.name === 'mobile' ? [320, 390] : [768, 1024, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Bom te ver/ })).toBeVisible();
    await noOverflow(page);
    await page.goto('/trilhas');
    await expect(page.locator('.learning-board')).toBeVisible();
    if (width <= 650) await expect(page.getByRole('button', { name: 'Ver como lista' })).toHaveAttribute('aria-pressed', 'true');
    await noOverflow(page);
    await page.goto('/licoes/variaveis');
    if (width === widths[0]) await page.getByRole('button', { name: 'Vamos praticar' }).click();
    await expect(page.getByRole('heading', { name: /Qual declaração permite/ })).toBeVisible();
    await noOverflow(page);
  }
});

test('XP e conquista aparecem após o acerto, com movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ir para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await begin(page);
  await page.getByRole('radio', { name: /let/ }).check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.locator('.lesson-feedback')).toBeFocused();
  await expect(page.locator('.lesson-xp')).toContainText('10 de 100 XP');
  await expect(page.locator('.xp-gain')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Sair e continuar depois' }).click();
  await expect(page.locator('.achievement').filter({ hasText: 'Primeiros passos' })).toContainText('Desbloqueada');
  await expect(page.getByRole('button', { name: 'Continuar de onde parei' })).toBeVisible();
});
