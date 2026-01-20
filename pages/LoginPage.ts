import { Page, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/');
    }

    async login(username: string = 'admin@sansera.in', password: string = 'Admin@1234') {
        // These selectors should be updated based on actual Login UI
        // Assuming standard inputs for now
        await this.page.getByPlaceholder('Email').fill(username);
        await this.page.getByPlaceholder('**********').fill(password);
        await this.page.click('button:has-text("Login")');

        // Verification
        await expect(this.page).toHaveURL(/dashboard/);
    }
}
