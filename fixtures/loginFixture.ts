// 📁 fixtures/loginFixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const VALID_PASSWORD = 'secret_sauce';

export const users = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  problem: 'problem_user',
  performance: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
};

export const test = base.extend<{
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
});
