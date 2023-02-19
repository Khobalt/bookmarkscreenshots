const puppeteer = require('puppeteer');
const fs = require('fs');
const { promisify } = require('util');

(async () => {
  // Load bookmarks HTML file
  const bookmarksHTML = fs.readFileSync('bookmarks.html', 'utf-8');

  // Create an array of bookmark links
  const links = await (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 414, height: 896, isMobile: true, hasTouch: true });
    await page.setContent(bookmarksHTML);
    const links = await page.$$eval('a', links => links.map(link => link.href));
    await browser.close();
    return links;
  })();

  // Create a subdirectory to store the screenshots
  const screenshotDir = './screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  // Take screenshots of links in batches of 10
  const batchSize = 10;
  for (let i = 0; i < links.length; i += batchSize) {
    const linkBatch = links.slice(i, i + batchSize);
    const screenshotPromises = linkBatch.map(async (link, j) => {
      if (link.startsWith('https')) {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
          await page.setViewport({ width: 414, height: 896, isMobile: true, hasTouch: true });
          await page.goto(link);
          const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle0' });
          const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
          await Promise.race([navigationPromise, timeoutPromise]);
          const screenshotPath = `${screenshotDir}/bookmark-${i + j}.png`;
          await page.screenshot({ path: screenshotPath });
          await browser.close();
          console.log(`Took screenshot of ${link} and saved to ${screenshotPath}...`);
        } catch (error) {
          console.log(`Error occurred while taking screenshot of ${link}: ${error.message}`);
        }
      } else {
        console.log(`Skipped ${link} because it doesn't start with "https"...`);
      }
    });
    await Promise.all(screenshotPromises);
  }

})();
