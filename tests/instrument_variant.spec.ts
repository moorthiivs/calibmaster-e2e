import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InstrumentVariantFormPage } from '../pages/InstrumentVarientFormPage';
import testData from '../testdata/TC_INST_02.json';
import config from '../Login_config.json';

test.describe('TC_INST_02: Create Instrument Variant', () => {

    for (const data of testData) {
        test(`Create Variant: ${data.InstrumentName} - ${data.InstrumentVariantName}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const variantPage = new InstrumentVariantFormPage(page);

            // 1. Login
            await loginPage.goto();
            await loginPage.login(config.user.username, config.user.password);

            // 2. Navigate to Create Variant
            await variantPage.navigateToCreate();

            // 3. Fill Variant Details
            await variantPage.fillInstrumentVariantDetails(data);

            // 4. Save (Implementation of save method might be needed in POM)
            await page.getByRole('button', { name: /Add Instrument Variant/i, exact: true }).click();

            // 5. Verify Success
            await expect(page.getByText(/The Instrument Variant was created successfully/i)).toBeVisible();
        });
    }
});
