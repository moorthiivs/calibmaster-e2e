import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InstrumentVariantFormPage } from '../pages/InstrumentVarientFormPage';
import testData from '../testdata/TC_INST_02.json';
import config from '../Login_config.json';
import { ensureDirectoryExists, getScreenshotPath } from 'utils/fileUtils';
import { screenshotCard } from 'utils/testutils';

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
            const fullname = await variantPage.genfullname(data)
            await ensureDirectoryExists(fullname)

            await variantPage.fillInstrumentBasicDetails(data)
            const card = page.locator('#Instrument_Basic_Details').first();
            await screenshotCard(card, { folderName: fullname, fileName: 'basic_instrument_details' })

            // 5. Verify Success
            await variantPage.saveAndVerify();
        });
    }
});
