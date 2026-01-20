import { Page, expect } from '@playwright/test';

export class InstrumentFormPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToCreate() {
        await this.page.click('text=Instrument');
        await this.page.click('text=Create');
        // 'Add Instrument' matches both the header and the submit button, causing strict mode error.
        // Verifying the form input is a more robust check that the page loaded.
        await expect(this.page.getByPlaceholder('Enter instrument name')).toBeVisible();
    }

    async fillInstrumentDetails(data: any) {
        // Instrument Name
        await this.page.getByPlaceholder('Enter instrument name').fill(data.InstrumentName);

        // UOM (Select)
        // Click the combobox directly (avoiding text interception by the input)
        await this.page.getByRole('combobox', { name: /Select UOM/i }).click();
        await this.page.click(`text=${data.UOM}`); // Using UOM name "Volts" instead of "V"

        // Discipline & Group
        // Opens Discipline Dropdown
        await this.page.getByRole('combobox', { name: /Select Discipline/i }).click();
        await this.page.click(`text=${data.Discipline}`);

        // Wait for Group dropdown to be enabled (populated)
        const groupDropdown = this.page.getByRole('combobox', { name: /Select Group/i });
        await expect(groupDropdown).toBeEnabled();

        // Opens Group Dropdown
        await groupDropdown.click({ force: true });
        await this.page.click(`text=${data.Group}`);

        // Lab Types (Array)
        if (data.LabTypes && data.LabTypes.length > 0) {
            // Multi-select handling: Open dropdown once
            // Note: If label is "Lab Type" but placeholder is "Select Lab Types", targeting by Role+Name is better if label exists.
            // If No label, placeholder might be the accessible name.
            // Based on user snippet, it has placeholder="Select Lab Types".
            // We use getByRole with the placeholder verification or direct accessible name.
            // Assuming the Select component exposes the placeholder as accessible name or we select by role.
            // Based on page snapshot, the accessible name is derived from the label ("Lab Type"), not the placeholder ("Select Lab Types").
            await this.page.getByRole('combobox', { name: /Lab Type/i }).click({ force: true });

            for (const lab of data.LabTypes) {
                // Select each lab type from the array
                // User specific request to target .ant-select-item-option-content
                // Using exact: true to distinguish NABL from NON-NABL
                await this.page.locator('.ant-select-item-option-content').getByText(lab.Type, { exact: true }).click();
            }

            // Click outside to close dropdown
            await this.page.locator('body').click();
        }
    }

    async fillRangeDetails(labTypes: any[]) {
        if (!labTypes || labTypes.length === 0) return;

        for (const lab of labTypes) {
            await this.page.locator(`#accept_ranges_${lab.Type}_min`).fill(String(lab.RangeMin));
            await this.page.locator(`#accept_ranges_${lab.Type}_max`).fill(String(lab.RangeMax));

            // Unit Select
            await this.page.locator(`#accept_ranges_${lab.Type}_unit`).click();
            await this.page.locator('.ant-select-dropdown:visible .ant-select-item-option-content').getByText(lab.RangeUnit, { exact: true }).first().click();

            // Decimal Place
            await this.page.locator(`#accept_ranges_${lab.Type}_decimalPlace`).click();
            await this.page.locator('.ant-select-dropdown:visible .ant-select-item-option-content').getByText(lab.DecimalPlace, { exact: true }).first().click();

        }
    }

    async addParameters(parameters: any[]) {
        if (!parameters || parameters.length === 0) return;

        await this.page.click('button:has-text("Add Instrument Parameters")');
        // Verify Modal Title is visible
        await expect(this.page.getByRole('heading', { name: 'Add Instrument Parameters' })).toBeVisible();

        for (const [index, param] of parameters.entries()) {
            if (index > 0) {
                await this.page.click('button:has-text("Add New")');
            }

            await this.page.getByPlaceholder('Enter parameter name').nth(index).fill(param.ParamName);
            // Select UOM using the ID provided by the user
            await this.page.selectOption(`#parameter${index} [id^="select"]`, { label: param.UOM });
        }

        // Pause for visual verification
        await this.page.click('button:has-text("Save Parameters")');
        await expect(this.page.getByRole('heading', { name: 'Add Instrument Parameters' })).toBeHidden();
    }

    async saveAndVerify() {
        await this.page.getByRole('button', { name: "Add Instrument", exact: true }).click();

        // Success Check (in Toast)
        await expect(this.page.getByText('The Instrument was created successfully')).toBeVisible();

        // Verify the create dialog/form is closed
        await expect(this.page.getByRole('button', { name: "Add Instrument", exact: true })).toBeHidden();
    }
}
