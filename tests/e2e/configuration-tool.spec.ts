import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the app shell and summary values', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'CC1101 Configuration Tool' })).toBeVisible();

  // Spot-check key summary values render non-empty.
  await expect(page.locator('[data-scroll-to="0x0D"] strong').first()).not.toHaveText('');
  await expect(page.locator('[data-scroll-to="0x10"] strong').first()).not.toHaveText('');
  await expect(page.locator('[data-scroll-to="0x09"] strong').first()).not.toHaveText('');
});

test('filters registers with the search box', async ({ page }) => {
  const search = page.getByLabel('Search registers');

  await search.fill('zzzzzz');
  await expect(page.locator('.register-card')).toHaveCount(0);

  await search.fill('');
  await expect(page.locator('.register-card').first()).toBeVisible();
});

test('editing channel number updates the summary', async ({ page }) => {
  const channelSummary = page.locator('[data-scroll-to="0x09"] strong');
  const channelInput = page.locator('input[data-type="register-hex"][data-addr="10"]');

  await channelInput.fill('0x05');
  await expect(channelSummary).toHaveText('5');
});

test('export refresh lists defaults when not limited to changes', async ({ page }) => {
  const exportText = page.locator('#exportText');
  // Export should start with URL comment even when "only changed" shows no registers
  await expect(exportText).toHaveValue(/^\/\/ https:\/\//);

  const onlyChanged = page.locator('#exportOnlyChanged');
  await onlyChanged.uncheck();

  // Change a register so export clearly reflects current state.
  const gdo2Input = page.locator('input[data-type="register-hex"][data-addr="0"]');
  await gdo2Input.fill('0x2A');

  await page.getByRole('button', { name: 'Refresh' }).click();

  await expect(exportText).not.toHaveValue('');
  await expect(exportText).toHaveValue(/0x00,\s*0x2a/i);
});

test('import applies new register values', async ({ page }) => {
  const importArea = page.locator('#importText');
  await importArea.fill('(0x3E, 0xC0)');
  await page.getByRole('button', { name: 'Import' }).click();

  const patableInput = page.locator('input[data-type="register-hex"][data-addr="62"]');
  await expect(patableInput).toHaveValue('0xC0');

  const txPower = page.locator('[data-scroll-to="0x3E"] strong');
  await expect(txPower).not.toHaveText('—');
});

test('changing crystal frequency updates derived values', async ({ page }) => {
  const baseFreq = page.locator('[data-scroll-to="0x0D"] strong');
  const initial = (await baseFreq.textContent())?.trim() ?? '';
  expect(initial).not.toBe('');

  await page.getByLabel('Crystal Frequency (MHz)').selectOption('27');
  await expect(baseFreq).not.toHaveText(initial);
});

test('loads register state from URL hash on initial navigation', async ({ page }) => {
  // Navigate to URL with hash containing register values
  // Format: #addr:value;addr:value (hex, no 0x prefix)
  // 0x3E = PATABLE0, 0x0A = CHANNR
  await page.goto('/#3e:c0;0a:05');

  // Verify PATABLE0 (0x3E) is loaded with value 0xC0
  const patableInput = page.locator('input[data-type="register-hex"][data-addr="62"]');
  await expect(patableInput).toHaveValue('0xC0');

  // Verify CHANNR (0x0A) is loaded with value 0x05
  const channrInput = page.locator('input[data-type="register-hex"][data-addr="10"]');
  await expect(channrInput).toHaveValue('0x05');

  // Verify that the summary reflects the loaded state
  const channelSummary = page.locator('[data-scroll-to="0x09"] strong');
  await expect(channelSummary).toHaveText('5');
});
