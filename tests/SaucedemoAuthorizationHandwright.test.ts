import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
   await page.goto('https://www.saucedemo.com/');
});


async function fillCredinals(page, login, password){
  //ввод кредов
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill(login);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(password);
  //проверка видимости введенных строк
  await expect(page.locator('[data-test="username"]')).toHaveValue(login);
  await expect(page.locator('[data-test="password"]')).toHaveValue(password);
}

async function checkLogin(page){
  //проверим, что попали на страницу с товарами (ищем хэдер Products) 
  await expect(page.locator('[data-test="secondary-header"]')).toBeVisible();
  //проверим, что в меню доступна кнопка логаута 
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
}

test('Standard_user authorization', async ({ page }) => {
  const login = 'standard_user';
  const password = 'secret_sauce'; 
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await fillCredinals(page, login, password);
  //нажатие кнопки логин
  await page.locator('[data-test="login-button"]').click();
  await checkLogin(page);
});

test('Error user authorization', async ({ page }) => {
  const login = 'error_user';
  const password = 'secret_sauce'; 
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await fillCredinals(page, login, password);
  //нажатие кнопки логин
  await page.locator('[data-test="login-button"]').click();
  await checkLogin(page);
});

test('Locked out user authorization', async ({ page }) => {
  const login = 'locked_out_user';
  const password = 'secret_sauce'; 
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await fillCredinals(page, login, password);
  //нажатие кнопки логин
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');
});

test('Wrong password', async ({ page }) => {
    const login = 'standard_user';
  const password = 'not_a_password'; 
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await fillCredinals(page, login, password);
  //нажатие кнопки логин
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
});
