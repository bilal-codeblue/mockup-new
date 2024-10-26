const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const runPup = async () => {
    let browser = null;
    try {
        const isLocal = !process.env.AWS_REGION;

        const launchOptions = isLocal
            ? {
                  executablePath: require('puppeteer').executablePath(),
                  headless: true,
              }
            : {
                  args: chromium.args,
                  defaultViewport: chromium.defaultViewport,
                  executablePath: await chromium.executablePath,
                  headless: chromium.headless,
              };

        browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        await page.goto('https://google.com', { waitUntil: 'networkidle2' });

        const screenshotPath = 'screenshot.png';
        await page.screenshot({ path: screenshotPath });

        console.log(`Screenshot saved at ${screenshotPath}`);

        return screenshotPath;
    } catch (error) {
        console.error('Error taking screenshot:', error);
        throw error;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};

runPup().then(() => console.log('Screenshot process completed.'));
