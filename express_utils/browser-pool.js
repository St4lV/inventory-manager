const { chromium } = require('playwright');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserInstance;
}

async function closeBrowser() {
  await browserInstance?.close();
  browserInstance = null;
}

module.exports = { getBrowser, closeBrowser };