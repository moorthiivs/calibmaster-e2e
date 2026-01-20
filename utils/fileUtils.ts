import fs from 'fs';
import path from 'path';

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getScreenshotPath(
  folderName: string,
  fileName: string
): string {
  const screenshotsDir = path.resolve(process.cwd(), folderName);
  ensureDirectoryExists(screenshotsDir);

  return path.join(screenshotsDir, `${fileName}.png`);
}