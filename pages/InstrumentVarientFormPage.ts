import { Page, expect } from '@playwright/test';

export class InstrumentVariantFormPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToCreate() {
        await this.page.click('text=Instrument Variants');
        await this.page.click('text=Create');
        // 'Add Instrument' matches both the header and the submit button, causing strict mode error.
        // Verifying the form input is a more robust check that the page loaded.
        await expect(this.page.getByPlaceholder('Generated or custom full name')).toBeVisible();
    }

    async fillInstrumentVariantDetails(data: any) {
        // Use exact match to avoid strict mode violation with "Select Instrument Variant"
        await this.page.getByRole('combobox', { name: 'Select Instrument', exact: true }).click();
        await this.page.click(`text=${data.InstrumentName}`);

        await this.page.getByRole('combobox', { name: 'Instrument Variant Name', exact: true }).click();
        await this.page.click(`text=${data.InstrumentVariantName}`);

        await this.page.getByRole('combobox', { name: 'Lab Type', exact: true }).click();
        await this.page.click(`text=${data.LabType}`);

        if (data.parameters && data.parameters.length > 0) {
            for (const [index, param] of data.parameters.entries()) {
                await this.page.locator(`#parameter_${index}_value`).fill(param.ParameterValue);

                await this.page.locator(`#parameterRow${index} .ant-select-selector`).click();
                await this.page.locator('.ant-select-dropdown:visible .ant-select-item-option-content').getByText(param.uom_id, { exact: true }).first().click();
            }
        }

        if (data.InstrumentVariantType) {
            await this.page.getByRole('combobox', { name: /Select Instrument Variant Types/i }).click();
            await this.page.click(`text=${data.InstrumentVariantType}`);
        }

        await this.page.getByRole('button', { name: /Generate Name/i, exact: true }).click();
    }
}
