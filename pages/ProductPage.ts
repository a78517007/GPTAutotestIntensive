import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory-item.html/');
  }
  async expectProductPage() {
    await expect(this.page).toHaveURL(/.*inventory-item\.html/);
    await expect(this.page.locator('.inventory_details_name')).toBeVisible();
  }
}