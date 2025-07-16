import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import CartPage from '../pages/CartPage'; // default import для CartPage

export const test = base.extend<{
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  cleanCart: boolean;
}>({
  cleanCart: [true, { option: true }], // По умолчанию чистим корзину после теста

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await use(loginPage);
  },

  inventoryPage: async ({ page, loginPage }, use) =>  {
    const inventoryPage = new InventoryPage(page);
    // Выполняем логин, если это необходимо 
    if (!(page.url().includes('inventory.html') || page.url().includes('cart.html'))) { 
        await loginPage.login('standard_user', 'secret_sauce');}
    
    await use(inventoryPage);
    // Логаут после каждого теста
    if (!(page.url().includes('inventory.html') || page.url().includes('cart.html'))) {
      await inventoryPage.logout();}
    
  },

  cartPage: async ({ page, loginPage, cleanCart }, use) =>  {
    const cartPage = new CartPage(page);
    // Выполняем логин, если это необходимо
    if (!(page.url().includes('inventory.html') || page.url().includes('cart.html'))) {
       await loginPage.login('standard_user', 'secret_sauce');}  

    await use(cartPage);

     // Очистка корзины, если включена опция cleanCart
    if (cleanCart) {
      await cartPage.open();
      await cartPage.removeAllItemsIfExist();
    }
    // Логаут после каждого теста
    if (!(page.url().includes('inventory.html') || page.url().includes('cart.html'))) {
        await cartPage.logout();}
  }

  
});