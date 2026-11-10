import { expect, test } from '@playwright/test';
import { noOverflow } from './helpers';

test('celular e tablet têm navegação inferior e módulos visíveis', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Validação da interface compacta.');
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Atalhos do Kodeo' });
    await expect(nav.getByRole('button', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    await noOverflow(page);
    await nav.getByRole('button', { name: 'Trilhas' }).click();
    await expect(page.getByRole('heading', { name: 'Primeiros passos', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dados e decisões', exact: true })).toBeVisible();
    await noOverflow(page);
    await nav.getByRole('button', { name: 'Medalhas' }).click();
    await expect(page.getByRole('heading', { name: 'Suas conquistas' })).toBeVisible();
  }
});

test('manifesto do PWA aponta para o app e os ícones existem', async ({ page, request, baseURL }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBeTruthy();
  const manifestUrl = new URL(href!, baseURL);
  const response = await request.get(manifestUrl.href);
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.display).toBe('standalone');
  expect(new URL(manifest.start_url, manifestUrl).href).toBe(new URL(manifest.scope, manifestUrl).href);
  for (const size of ['192x192', '512x512']) {
    const icon = manifest.icons.find((entry: { sizes: string }) => entry.sizes === size);
    expect(icon).toBeTruthy();
    expect((await request.get(new URL(icon.src, manifestUrl).href)).ok()).toBe(true);
  }
  await expect(page.getByRole('button', { name: 'Instalar Kodeo' })).toBeVisible();
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.active?.state)).toBe('activated');
});
