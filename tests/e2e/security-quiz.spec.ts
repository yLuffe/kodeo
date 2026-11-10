import { expect, test } from '@playwright/test';

test('Cyber usa a lição padrão e retoma sem misturar o progresso de JavaScript', async ({ page, baseURL }) => {
  const trailUrl = new URL('trilhas?trilha=security', baseURL).href;
  await page.goto(trailUrl);
  await page.getByRole('button', { name: /Etapa 1: Desafios de cibersegurança/ }).click();
  await page.getByRole('button', { name: 'Continuar lição', exact: true }).click();
  await expect(page).toHaveURL(/\/licoes\/ciberseguranca\/?$/);
  await page.getByRole('button', { name: 'Vamos praticar' }).click();
  await expect(page.getByText('Exercício 1 de 25')).toBeVisible();
  await page.getByRole('radio', { name: /Disponibilidade/ }).check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.locator('.lesson-feedback')).toBeFocused();
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.getByRole('radio', { name: /Integridade/ }).check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.locator('.lesson-xp')).toContainText('10 de 300 XP');
  await page.getByRole('button', { name: 'Próximo exercício' }).click();
  await expect(page.getByText('Exercício 2 de 25')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Exercício 2 de 25')).toBeVisible();
  await expect(page.locator('.lesson-xp')).toContainText('10 de 300 XP');
  await page.getByRole('button', { name: 'Sair e continuar depois' }).click();
  await expect(page).toHaveURL(/\/trilhas\/?\?trilha=security$/);
  await expect(page.getByRole('heading', { name: 'Introdução à cibersegurança', exact: true })).toBeVisible();
});
