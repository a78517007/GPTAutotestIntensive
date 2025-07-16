import { Page, Locator, expect } from '@playwright/test';

export default class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly cartButton: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly itemLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.removeButtons = page.locator('button:has-text("Remove")');
    this.cartButton = page.locator('.shopping_cart_link');
    this.checkoutButton = page.locator('button:has-text("Checkout")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.itemLinks = page.locator('.inventory_item_name');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }

  async clickOnItem(index: number) {
    await this.cartItems.locator('.inventory_item_name').nth(index).click();
  }

  async expectNoQuantityChanger() {
    const quantityFields = this.page.locator('input[type="number"]');
    await expect(quantityFields).toHaveCount(0);
  }
    async logout() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#logout_sidebar_link').click();
  }

  async open() {
    await this.cartButton.click();
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }

  async getCartItemsNames(): Promise<string[]> {
    return await this.itemLinks.allTextContents();
  }

  async removeAllItemsIfExist() {
    // Безопасный способ очистить корзину
    while (await this.removeButtons.count() > 0) {
      await this.removeButtons.first().click();
    }
  }

  async removeItemByName(itemName: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    const removeButton = item.locator('button:has-text("Remove")');
    await removeButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }

  async clickOnItemByName(itemName: string) {
    const itemLink = this.itemLinks.filter({ hasText: itemName }).first();
    await itemLink.click();
  }
}
