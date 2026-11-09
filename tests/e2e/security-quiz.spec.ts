import { expect, test, type Page } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

async function createDemoProfile(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Como podemos chamar você?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Primeiro nome' }).fill('Aluno');
  await dialog.getByRole('button', { name: 'Começar', exact: true }).click();
}

test('questionário de cibersegurança apresenta correção e permite voltar à trilha', async ({ page }) => {
  await page.goto('/trilhas?trilha=security');
  await createDemoProfile(page);
  await expect(page.getByRole('heading', { name: 'Introdução à cibersegurança', exact: true })).toBeVisible();

  await page.getByRole('button', { name: /Etapa 1: Desafios de cibersegurança/ }).click();
  await page.getByRole('button', { name: 'Continuar lição' }).click();
  await expect(page).toHaveURL('/licoes/ciberseguranca');

  await page.getByRole('button', { name: 'Começar questões' }).click();
  await expect(page.getByText('Questão 1 de 20')).toBeVisible();
  await page.getByRole('radio', { name: /Integridade/ }).click();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByText('Resposta correta')).toBeVisible();
  await expect(page.getByText(/integridade é a propriedade relacionada/i)).toBeVisible();

  await page.getByRole('button', { name: 'Próxima questão' }).click();
  await expect(page.getByText('Questão 2 de 20')).toBeVisible();
  await page.getByRole('radio', { name: /O atacante que poderia explorar/ }).click();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByText(/Resposta incorreta/)).toBeVisible();

  await page.getByRole('button', { name: 'Sair e continuar depois' }).click();
  await expect(page).toHaveURL('/trilhas?trilha=security');
});

test('rota direta abre o questionário em português', async ({ page }) => {
  await page.goto('/licoes/ciberseguranca');
  await createDemoProfile(page);
  await expect(page.getByRole('heading', { name: 'Desafios de cibersegurança' })).toBeVisible();
  await expect(page.getByText(/20 situações fictícias/i)).toBeVisible();
});
