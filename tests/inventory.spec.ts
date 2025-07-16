import { expect } from '@playwright/test';
import { test } from '../fixtures/cartFixture';

test.describe('🟢 Каталог товаров', () => {

  test('INV-01 - Количество товаров = 6', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryList.locator('.inventory_item')).toHaveCount(6);
  });

  test('INV-02 - Проверка изображений', async ({ inventoryPage }) => {
    const images = inventoryPage.itemImages;
    await expect(images).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await expect(images.nth(i)).toBeVisible();
    }
  });

  test('INV-03 - Проверка названий', async ({ inventoryPage }) => {
    const names = await inventoryPage.itemNames.allTextContents();
    names.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
  });

  test('INV-04 - Проверка описаний', async ({ inventoryPage }) => {
    const descs = await inventoryPage.itemDescriptions.allTextContents();
    descs.forEach(desc => expect(desc.trim().length).toBeGreaterThan(0));
  });

  test('INV-05 - Проверка цен', async ({ inventoryPage }) => {
    const prices = await inventoryPage.getAllPrices();
    prices.forEach(price => expect(price).toBeGreaterThan(0));
  });

  test('INV-06 - Сортировка A-Z', async ({ inventoryPage }) => {
    await inventoryPage.expectLoaded();
    await inventoryPage.page.locator('[data-test="product-sort-container"]').selectOption('az');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('INV-07 - Сортировка Z-A', async ({ inventoryPage }) => {
    await inventoryPage.expectLoaded();
    await inventoryPage.page.locator('[data-test="product-sort-container"]').selectOption('za');
    const names = await inventoryPage.itemNames.allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('INV-08 - Сортировка по цене Low-High', async ({ inventoryPage }) => {
    await inventoryPage.page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = await inventoryPage.getAllPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('INV-09 - Сортировка по цене High-Low', async ({ inventoryPage }) => {
    await inventoryPage.page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    const prices = await inventoryPage.getAllPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

});