
const fs = require('fs');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

module.exports.scrap =  (link) => new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    // Skip images/styles/fonts loading for performance
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });
    await page.goto(link);



    let result = await page.evaluate(() => {
        var scrap = [];
        try {
            var tags = document.querySelector("#__ZONE__main > div > div > div.gig-page > div.main > div.gig-tags-container").children[1].children;

            Object.keys(tags).forEach((element) => {
                scrap.push(tags[element].children[0].innerText)
            })
            return scrap;
        } catch (err) {
            return false;
        }
        
    });
    if(!result){await browser.close();return  reject("Error to get tags, please try again :(");}
    var randName = "./scrap/mazanlabeeb-"+ new Date().getTime() + ".txt";
    fs.writeFile(randName, result.join('\n'), 'utf8', function(err) {
        if (err) reject(err);
        else resolve(randName);
    });
    await browser.close();
    
})




     