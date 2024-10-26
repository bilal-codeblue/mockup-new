const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const express = require('express')
const app = express()


const runPup = async () => {
    let browser = null;
    try {
        const isLocal = false;

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

        const screenshotPath = '/tmp/screenshot.png';
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


app.get('/' , (req ,res) => {
    res.send("App is running")
})

app.get('/new-req' , async(req ,res) => {
    await runPup()
})

app.listen(5012 , () => {
    console.log('app is running ')
})