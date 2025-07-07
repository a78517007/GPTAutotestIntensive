// 📁 pages/InventoryPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly itemImages: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.itemImages = page.locator('.inventory_item_img img');
    this.itemNames = page.locator('.inventory_item_name');
  }

  async expectLoaded() {
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
}
