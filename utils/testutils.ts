import { expect, Locator } from "@playwright/test";
import { getScreenshotPath } from "./fileUtils";

type ScreenshotOptions = {
    folderName: string;
    fileName: string;
};

export async function selectAntdOptionByText(
    page: any,
    trigger: string | Locator,
    optionText: string
) {
    const triggerLocator =
        typeof trigger === 'string' ? page.locator(trigger) : trigger;

    await triggerLocator.click();

    const dropdown = page.locator('.ant-select-dropdown:visible');
    await expect(dropdown).toBeVisible();

    const option = dropdown.locator('.ant-select-item-option-content').getByText(optionText, { exact: true });

    await option.click({ force: true });
}

export async function screenshotCard(
    card: Locator,
    options: ScreenshotOptions
): Promise<void> {
    const screenshotPath = getScreenshotPath(
        options.folderName,
        options.fileName
    );

    await card.waitFor({ state: 'visible' });

    await card.screenshot({
        path: screenshotPath,
    });
}