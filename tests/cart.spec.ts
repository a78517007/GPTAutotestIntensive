import { expect } from '@playwright/test';
import { test } from '../fixtures/cartFixture';
import { ProductPage } from '../pages/ProductPage';

test.describe('🛒 Корзина', () => {

  test('INV-10 - Добавление 1 товара в корзину', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.itemNames.first().click();
    await inventoryPage.page.locator('button:has-text("Add to cart")').click();
    await cartPage.open();
    const items = await cartPage.getCartItemsNames();
    expect(items.length).toBe(1);
  });

  test('INV-10.1 - Добавление всех 6 товаров в корзину', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addAllToCart();
    await cartPage.open();
    const items = await cartPage.getCartItemsNames();
    expect(items.length).toBe(6);
  });

  test('INV-11 - Удаление одного товара', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addAllToCart();
    await inventoryPage.itemNames.first().click();
    await inventoryPage.page.locator('button:has-text("Remove")').click();
    await cartPage.open();
    const items = await cartPage.getCartItemsNames();
    expect(items.length).toBe(5);
  });

  test('INV-11.1 - Удаление всех товаров', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addAllToCart();
    await inventoryPage.removeAllFromCart();
    await cartPage.open();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('INV-11.2 - Удаление части товаров', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addAllToCart();
    await inventoryPage.itemNames.nth(0).click();
    await inventoryPage.page.locator('button:has-text("Remove")').click();
    await inventoryPage.page.goBack();
    await inventoryPage.itemNames.nth(1).click();
    await inventoryPage.page.locator('button:has-text("Remove")').click();
    await cartPage.open();
    const items = await cartPage.getCartItemsNames();
    expect(items.length).toBe(4);
  });

  test('INV-12 - Переход в корзину', async ({ cartPage }) => {
    await cartPage.open();
    await expect(cartPage.page).toHaveURL(/cart\.html/);
  });

  test('INV-12.1 - Переход на страницу товара из корзины', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addAllToCart();
    await cartPage.open();
    await cartPage.clickOnItem(0);
    const productPage = new ProductPage(cartPage.page);
    await productPage.expectProductPage();
  });

  test('INV-24 - Проверка при медленном интернете (ручная проверка)', async () => {
    test.info().annotations.push({ type: 'manual', description: 'Проверить вручную в DevTools -> Network Throttling' });
  });

  test('INV-25 - Проверка невозможности изменения количества товаров', async ({ cartPage }) => {
    await cartPage.open();
    await cartPage.expectNoQuantityChanger();
  });

});