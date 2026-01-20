import { Page, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToInstrumentMaster() {
        // Assuming sidebar navigation
        await this.page.click('text=Instrument Master');
        // Wait for list to load
        await expect(this.page).toHaveURL(/instrument/);
    }
}
