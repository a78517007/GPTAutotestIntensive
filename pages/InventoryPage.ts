// 📁 pages/InventoryPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly itemImages: Locator;
  readonly itemNames: Locator;
  readonly itemDescriptions: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

   constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.itemImages = page.locator('.inventory_item_img img');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemDescriptions = page.locator('.inventory_item_desc');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortSelect = page.locator('[data-test="product_sort_container"]');
  }

  async expectLoaded() {
    if (!(await this.page.url()).includes('inventory.html')) {
      await this.page.goto('https://www.saucedemo.com/inventory.html');
    }

    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  async getImageSrcs(): Promise<string[]> {
    const elements = await this.itemImages.all();
    const srcs = await Promise.all(elements.map(el => el.getAttribute('src')));
    return srcs.filter((src): src is string => src !== null); // отфильтровываем null
  }

  async getItemNames(): Promise<string[]> {
    const elements = await this.itemNames.all();
    return Promise.all(elements.map(el => el.innerText()));
  }

  async getFirstItemNameBox() {
    return this.itemNames.first().boundingBox();
  }
    async getAllPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(text => parseFloat(text.replace('$', '')));
  }

  async sortBy(option: string) {
    // tried to use selecting element here? but it dont work here
    await this.page.locator('[data-test="product-sort-container"]').selectOption('az');
    await this.sortSelect.selectOption(option);
  }

  async addAllToCart() {
    const addToCartButtons = this.page.locator('button:has-text("Add to cart")');
  
    while (await addToCartButtons.count() > 0) {
      await addToCartButtons.first().click();
   }
  }

  async removeAllFromCart() {
    const removeFromCartButtons = this.page.locator('button:has-text("Remove")');
  
    while (await removeFromCartButtons.count() > 0) {
      await removeFromCartButtons.first().click();
    }
  }
    async logout() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#logout_sidebar_link').click();
  }
}
