import { expect, type Page } from '@playwright/test';
export async function navigate(page: Page, label: string) {
  await expect(page.locator('.lesson-dialog')).toBeHidden();
  const menu = page.getByRole('button', { name: 'Abrir menu', exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('button', { name: label, exact: label !== 'Minhas trilhas' }).click();
}
export async function begin(page: Page) {
  await page.getByRole('button', { name: /Continuar aprendendo|Continuar de onde parei|Revisar lição/ }).click();
  await page.getByRole('button', { name: /Vamos praticar|Começar revisão/ }).click();
}
export async function finishQuestions(page: Page) {
  const dialog = page.locator('.lesson-dialog');
  await dialog.getByRole('radio', { name: /let/ }).check();
  await dialog.getByRole('button', { name: 'Verificar resposta', exact: true }).click();
  await dialog.getByRole('button', { name: 'Próximo exercício', exact: true }).click();
  await dialog.getByRole('radio', { name: /15/ }).check();
  await dialog.getByRole('button', { name: 'Verificar resposta', exact: true }).click();
  await dialog.getByRole('button', { name: 'Próximo exercício', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Sua resposta escrita' }).fill('BOOLEANO.');
  await dialog.getByRole('button', { name: 'Verificar resposta', exact: true }).click();
  await dialog.getByRole('button', { name: 'Próximo exercício', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Seu código JavaScript' }).fill('let pontos = 10; pontos += 5;');
  await dialog.getByRole('button', { name: 'Analisar código', exact: true }).click();
  await dialog.getByRole('button', { name: 'Próximo exercício', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Seu código JavaScript' }).fill('const nome="Kodeo"; const ativo=true;');
  await dialog.getByRole('button', { name: 'Analisar código', exact: true }).click();
  await dialog.getByRole('button', { name: 'Concluir lição', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: /Lição concluída|Conhecimento reforçado/ })).toBeVisible();
}
export async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const paper = page.locator('.lesson-dialog .MuiDialog-paper');
  if (await paper.isVisible()) expect(await paper.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
}
