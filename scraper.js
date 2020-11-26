const puppeteer = require('puppeteer');

puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'] }).then(async browser => {

	const page = await browser.newPage();
	await page.goto("https://www.amazon.com/Notebooks-Laptop-Computers/b?ie=UTF8&node=565108");
	await page.waitForSelector('body');

    const scrappedData = await page.evaluate(() => {
        const result = [];
        const laptopElems = document.body.querySelectorAll('.s-result-item.celwidget');
        for (let element of laptopElems) {
            const titleEl = element.querySelector('.a-size-base.s-inline.s-access-title.a-text-normal');
            const title = titleEl ? titleEl.innerText : '';
            const salePriceEl = element.querySelector('.a-offscreen');
            const salePrice = salePriceEl ? salePriceEl.innerText : ''; 
            let price = salePrice;
            if (!price) {
                const priceEl = element.querySelector('.a-size-base.a-color-base');
                price = priceEl ? priceEl.innerText : ''; 
            }

            result.push({title, price});
        }

        return result;
    });

    console.log(scrappedData)
    await browser.close();

}).catch(function(error) {
    console.error(error);
});