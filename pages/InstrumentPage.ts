import { Page, expect } from '@playwright/test';

export class InstrumentPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async searchInstrument(name: string) {
        await this.page.getByPlaceholder('Search').fill(name);
        await this.page.keyboard.press('Enter');

        // Wait for grid to update
        await this.page.waitForTimeout(1000); // Ideally wait for specific API response or spinner to hide

        // Verify row exists
        await expect(this.page.getByRole('cell', { name: name, exact: true })).toBeVisible();
    }
}
