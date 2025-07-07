import { test, expect } from '@playwright/test';

// Базовые данные
const BASE_URL = 'https://www.saucedemo.com/';
const VALID_PASSWORD = 'secret_sauce';

const users = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  problem: 'problem_user',
  performance: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
};

// Универсальная функция логина
async function login(page, username: string, password: string) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// Ожидаемый успешный переход
async function expectSuccessfulLogin(page) {
  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
}

// 💚 Позитивные тесты
test.describe('🟢 Позитивные тесты авторизации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC01 - Успешный вход стандартного пользователя', async ({ page }) => {
    await login(page, users.standard, VALID_PASSWORD);
    await expectSuccessfulLogin(page);
  });

  test('TC03 - Успешный вход проблемного пользователя (возможны баги отображения)', async ({ page }) => {
    await login(page, users.problem, VALID_PASSWORD);
    await expectSuccessfulLogin(page);

    // Проверка одного из известных багов: все изображения одинаковые
    const images = await page.locator('.inventory_item_img img').all();
    const srcs = await Promise.all(images.map(img => img.getAttribute('src')));
    const unique = new Set(srcs);

    // BUG: problem_user — known issue: all images are identical
    //expect(unique.size).toBeGreaterThan(1); // Если все изображения одинаковые — баг
  
    // Проверяем, что баг действительно есть — все картинки одинаковые
    expect(unique.size).toBe(1); // known issue for problem_user
  });

  test('TC04 - Успешный вход с задержкой (performance_glitch_user)', async ({ page }) => {
    const start = Date.now();
    await login(page, users.performance, VALID_PASSWORD);
    await expectSuccessfulLogin(page);
    const duration = Date.now() - start;
    console.log(`⏱ Login took: ${duration}ms`);
  });

  test('TC05 - Успешный вход error_user (проверка на JavaScript ошибки/неполадки)', async ({ page }) => {
    await login(page, users.error, VALID_PASSWORD);
    await expectSuccessfulLogin(page);

    const itemNames = page.locator('.inventory_item_name');
    const count = await itemNames.count();

    for (let i = 0; i < count; i++) {
      const text = await itemNames.nth(i).innerText();
      expect(text.trim()).not.toBe(''); // Имена товаров должны быть непустыми
    }

    // Дополнительно можно проверять консоль (через browser context)
  });

  test('TC06 - Вход visual_user (проверка UI на визуальные баги)', async ({ page }) => {
    await login(page, users.visual, VALID_PASSWORD);
    await expectSuccessfulLogin(page);

    // Проверка: заголовок первого товара должен быть видим и без смещений
    const firstTitle = page.locator('.inventory_item_name').first();
    await expect(firstTitle).toBeVisible();
    const box = await firstTitle.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });
});

// ❤️ Негативные тесты
test.describe('🔴 Негативные тесты авторизации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC02 - Заблокированный пользователь получает ошибку', async ({ page }) => {
    await login(page, users.locked, VALID_PASSWORD);
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Sorry, this user has been locked out.');
  });

  test('TC07 - Вход с неверным паролем', async ({ page }) => {
    await login(page, users.standard, 'wrong_password');
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Username and password do not match');
  });

  test('TC08.1 - Пустой логин', async ({ page }) => {
    await login(page, '', VALID_PASSWORD);
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Username is required');
  });

  test('TC08.2 - Пустой пароль', async ({ page }) => {
    await login(page, users.standard, '');
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Password is required');
  });

  test('TC08.3 - Пустые логин и пароль', async ({ page }) => {
    await login(page, '', '');
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Username is required');
  });
});