import { Page, expect } from '@playwright/test';
import { selectAntdOptionByText } from 'utils/testutils';


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

    async genfullname(data: any) {
        const parameterPart = (data.parameters || [])
            .map((p: any) => `${p.ParameterValue} ${p.uom_id}`)
            .join(' ');

        const fullname = `${data.InstrumentName} ${parameterPart}`.trim();
        const safeName = fullname.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
        return safeName;
    }


    async fillInstrumentBasicDetails(data: any) {
        // Instrument
        await selectAntdOptionByText(this.page, '#instrument_id', data.InstrumentName);

        // Instrument Variant Name
        await selectAntdOptionByText(
            this.page,
            this.page.getByRole('combobox', { name: 'Instrument Variant Name', exact: true }),
            data.InstrumentVariantName
        );

        // Lab Type
        await selectAntdOptionByText(this.page, '#lab_type', data.LabType);
    }

    async fillInstrumentParameters(data: any) {
        // Parameters
        if (data.parameters && data.parameters.length > 0) {
            for (const [index, param] of data.parameters.entries()) {

                // Value
                await this.page
                    .locator(`#parameter_${index}_value`)
                    .fill(param.ParameterValue);

                // UOM (AntD Select)
                // await this.selectAntdOptionByText(
                //     `#paramete_${index}_uom`,
                //     param.uom_id
                // );
            }
        }


    }

    async fillInstrumentFullName(data: any) {

        // Generate Name
        await this.page
            .getByRole('button', { name: /Generate Name/i, exact: true })
            .click();
    }


    async fillInstrumentVariantDetails(data: any) {

        // Instrument
        await selectAntdOptionByText(this.page, '#instrument_id', data.InstrumentName);

        // Instrument Variant Name
        await selectAntdOptionByText(
            this.page,
            this.page.getByRole('combobox', { name: 'Instrument Variant Name', exact: true }),
            data.InstrumentVariantName
        );

        // Lab Type
        await selectAntdOptionByText(this.page, '#lab_type', data.LabType);



        // Parameters
        if (data.parameters && data.parameters.length > 0) {
            for (const [index, param] of data.parameters.entries()) {

                // Value
                await this.page
                    .locator(`#parameter_${index}_value`)
                    .fill(param.ParameterValue);

                // UOM (AntD Select)
                // await this.selectAntdOptionByText(
                //     `#paramete_${index}_uom`,
                //     param.uom_id
                // );
            }
        }

        // Instrument Variant Types (multi-select)
        if (data.InstrumentVariantType) {
            await selectAntdOptionByText(this.page,
                this.page.getByRole('combobox', { name: /Select Instrument Variant Types/i }),
                data.InstrumentVariantType
            );
        }

        // Generate Name
        await this.page
            .getByRole('button', { name: /Generate Name/i, exact: true })
            .click();

        const fullname = await this.page
            .locator('#instrument_full_name')
            .inputValue();
        return fullname;
    }

    async saveAndVerify() {
        await this.page.getByRole('button', { name: /Add Instrument Variant/i, exact: true }).click();


        // Success Check (in Toast)
        await expect(this.page.getByText('The Instrument Type was created successfully.')).toBeVisible();

        // Verify the create dialog/form is closed
        await expect(this.page.getByRole('button', { name: /Add Instrument Variant/i, exact: true })).toBeHidden();
    }

    async takescreenshot(params: string) {
        await this.page.screenshot({
            path: `${params}.png`,
            fullPage: true
        });
    }
}
