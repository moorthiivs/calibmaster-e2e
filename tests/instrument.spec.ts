import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InstrumentFormPage } from '../pages/InstrumentFormPage';
import { InstrumentPage } from '../pages/InstrumentPage';
import testData from '../testdata/TC_INST_01.json';
import config from '../Login_config.json';

test.describe('TC_INST_01: Create Instrument Master', () => {

    // Cleanup or Setup hooks can go here

    for (const data of testData) {
        test(`Create Instrument: ${data.InstrumentName}`, async ({ page, request }) => {
            const loginPage = new LoginPage(page);
            const formPage = new InstrumentFormPage(page);
            const listPage = new InstrumentPage(page);

            // 1. Login
            await loginPage.goto();
            await loginPage.login(config.user.username, config.user.password);

            // 2. Navigate
            await formPage.navigateToCreate();

            // 3. Fill Details
            await formPage.fillInstrumentDetails(data);

            // 4. Fill Range (Lab Types Array)
            if (data.LabTypes) {
                await formPage.fillRangeDetails(data.LabTypes);
            }

            // 5. Add Parameters (Validation Array)
            if (data.Parameters) {
                await formPage.addParameters(data.Parameters);
            }

            // 6. Save & Verify UI
            await formPage.saveAndVerify();

            // 7. Verify List
            await listPage.searchInstrument(data.InstrumentName);

            // 8. HYBRID CHECK (Backend Validation)
            // Extract Bearer Token from localStorage
            const storedData = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('calibmaster_userData') || '{}');
            });
            const token = storedData.token;
            const labId = storedData.labId;

            // Fetch All Instruments and filter or use Search API directly
            const response = await request.get(`http://localhost:5000/api/instrument/searchByName/${data.InstrumentName}&${labId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Verify record exists via API
            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.data).toBeDefined();
            expect(body.data.length).toBeGreaterThan(0);
            expect(body.data[0].instrument_name).toBe(data.InstrumentName);

            console.log(`Verified creation of ${data.InstrumentName}`);
        });
    }
});
