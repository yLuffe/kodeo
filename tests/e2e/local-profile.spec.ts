import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('pede o primeiro nome uma vez e recupera resposta e XP após recarregar', async ({ page }) => {
  await page.goto('/');
  const profile = page.getByRole('dialog', { name: 'Como podemos chamar você?' });
  await profile.getByRole('textbox', { name: 'Primeiro nome' }).fill('Júlia Silva');
  await profile.getByRole('button', { name: 'Começar', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Bom te ver por aqui, Júlia/ })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar aprendendo' }).click();
  await page.getByRole('button', { name: 'Vamos praticar' }).click();
  await page.getByRole('radio', { name: /let/ }).check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.locator('.lesson-feedback')).toContainText('Resposta correta');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('kodeo:profile:v1') ?? '{}').lessons?.['js-6']?.xpEvents?.length)).toBe(1);
  await page.reload();
  await expect(profile).toBeHidden();
  await expect(page.locator('.lesson-feedback')).toContainText('Resposta correta');
  await expect(page.locator('.lesson-reward')).toContainText('10 XP');
});
