import { test, users } from '../fixtures/loginFixture';
import { expect } from '@playwright/test';

const VALID_PASSWORD = 'secret_sauce';

test.describe('🟢 Позитивные тесты', () => {

  test('TC01 - standard_user: успешный вход', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, VALID_PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('TC03 - problem_user: изображения одинаковые (известный баг)', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.problem, VALID_PASSWORD);
    await inventoryPage.expectLoaded();
    const srcs = await inventoryPage.getImageSrcs();
    const unique = new Set(srcs);
    expect(unique.size).toBe(1); // BUG: known issue
  });

  test('TC04 - performance_glitch_user: вход с задержкой', async ({ loginPage, inventoryPage }) => {
    const start = Date.now();
    await loginPage.login(users.performance, VALID_PASSWORD);
    await inventoryPage.expectLoaded();
    const duration = Date.now() - start;
    console.log(`Login duration: ${duration}ms`);
  });

  test('TC05 - error_user: товары должны отображаться корректно', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.error, VALID_PASSWORD);
    await inventoryPage.expectLoaded();
    const names = await inventoryPage.getItemNames();
    names.forEach(name => expect(name.trim()).not.toBe(''));
  });

  test('TC06 - visual_user: UI без визуальных багов', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.visual, VALID_PASSWORD);
    await inventoryPage.expectLoaded();
    const box = await inventoryPage.getFirstItemNameBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });
});

test.describe('🔴 Негативные тесты', () => {

  test('TC02 - locked_out_user: пользователь заблокирован', async ({ loginPage }) => {
    await loginPage.login(users.locked, VALID_PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('TC07 - Неверный пароль', async ({ loginPage }) => {
    await loginPage.login(users.standard, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('TC08.1 - Пустой логин', async ({ loginPage }) => {
    await loginPage.login('', VALID_PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('TC08.2 - Пустой пароль', async ({ loginPage }) => {
    await loginPage.login(users.standard, '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('TC08.3 - Пустые логин и пароль', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});