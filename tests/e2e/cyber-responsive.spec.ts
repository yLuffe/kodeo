import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 740, label: 'celular pequeno' },
  { width: 390, height: 844, label: 'celular' },
  { width: 768, height: 1024, label: 'tablet retrato' },
  { width: 1024, height: 768, label: 'tablet paisagem' },
];

for (const viewport of viewports) {
  test(`Cyber responsivo em ${viewport.label} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/licoes/ciberseguranca');
    const dialog = page.locator('.lesson-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Desafios de cibersegurança' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Vamos praticar' }).click();

    await expect(dialog.getByText('Exercício 1 de 25')).toBeVisible();
    await expect(dialog.getByText('Questão atual: 1')).toBeVisible();
    await expect(dialog.locator('.lesson-progress ol')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect.poll(() => dialog.locator('.MuiDialog-paper').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);

    await dialog.getByRole('button', { name: 'Ajuda da lição' }).click();
    await expect(page.getByText(/O progresso fica salvo no perfil deste navegador/)).toBeVisible();
    await expect(page.getByText(/Os desafios de código aceitam/)).toHaveCount(0);
    await page.getByRole('button', { name: 'Entendi' }).click();

    await dialog.getByRole('radio', { name: /Integridade/ }).check();
    await dialog.getByRole('button', { name: 'Verificar resposta' }).click();
    await expect(dialog.locator('.lesson-feedback')).toContainText('Resposta correta');
    await dialog.getByRole('button', { name: 'Próximo exercício' }).click();
    await expect(dialog.getByText('Questão atual: 2')).toBeVisible();
    await page.reload();
    await expect(dialog.getByText('Questão atual: 2')).toBeVisible();
    await expect.poll(() => dialog.locator('.MuiDialog-paper').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  });
}
