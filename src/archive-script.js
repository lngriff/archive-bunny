import { chromium } from 'playwright';
import * as fs from 'fs';
import { config } from './config.js';
import * as bunny from './bunny.js'

export async function archiveScript(categories) {
    try {
        let startingPage = config.startingPage;

        const browser = await chromium.connectOverCDP(`http://localhost:${config.debugPort}`);
        const defaultContext = browser.contexts()[0];
        const page = defaultContext.pages()[0];

        await reset(page, startingPage);

        let next;
        let hasNext = await page.getByRole('link', { name: 'Next'}).first().isVisible();
        if (hasNext) {
            next = page.getByRole('link', { name: 'Next'}).first();
        }
        let titles = [];

        do {
            let prevPage = page.url();
            let subcategories = [];
            for (let category of categories) {
                const additionalTitles = await page.getByRole('link', { name: category }).all();
                subcategories.push(...additionalTitles);
            }
            for (let i = 0; i < subcategories.length; i++) {
                await subcategories[i].click();
                await timer(config.shortWait);

                const title = formatTitle(await page.getByRole('heading').first().textContent());

                if (titles.includes(title)) {
                    // skip dupes
                    await reset(page, prevPage);
                    continue;
                }

                if (config.bunnyOn) {
                    process.stdout.write(bunny.workingBunny);
                }

                const curCategory = categories.find(val => 
                    (title.toLowerCase()).includes(val.toLowerCase())
                );
                if (curCategory == undefined || curCategory == null) {
                    throw Error('Unable to determine category')
                }

                titles.push(title);
                makeFolders(config.mainFolder, curCategory, title);

                const initialPageCount = await page.getByText(/\d{1,3}pages/).textContent();
                const pageCount = initialPageCount.replace(/\D/g,'');
                if (pageCount == NaN || pageCount == 0) {
                    throw Error(`Unable to get page count`);
                }
                await page.getByRole('link', { name: 'Read on Browser'}).click();
                
                for(let i = 1; i <= pageCount; i++) {
                    await clickNext(page, config.shortWait, i, `${config.mainFolder}${curCategory}/${title}/raws`, config.viewWindow);
                }

                if (config.bunnyOn) {
                    process.stdout.write(bunny.gotOneBunny);
                }

                await reset(page, prevPage);
            }

            await reset(page, prevPage);
            hasNext = await page.getByRole('link', { name: 'Next'}).first().isVisible();
            if (hasNext) {
                next = page.getByRole('link', { name: 'Next'}).first();
                await next.click();
                await timer(config.longWait);
            }
        } while (hasNext);

        if (titles.length == 0) {
            process.stdout.write(bunny.noMatchBunny);
            process.exit();
        }
    } catch (e) {
        process.stdout.write(bunny.errorBunny);
        process.stderr.write(e.message);
        process.exit(1);
    }
    process.stdout.write('All done!')
}

const timer = ms => new Promise(res => setTimeout(res, ms));

async function clickNext(page, waitTime, pageNo, path, viewWindow) {
    if (pageNo == 1) {
        // special ultra long wait
        await timer(10000);
    }
    else {
        await timer(waitTime);
    }

    const formattedPageNo = formatPageNumber(pageNo);
    await page.screenshot({ path: `${path}/${formattedPageNo}.png`, clip: viewWindow });
    await page.keyboard.press(`Arrow${config.scrollDir}`);
}

function makeFolders(mainFolder, category, subcategory) {
    try {
        if (!fs.existsSync(`${mainFolder}`)) {
            fs.mkdirSync(`${mainFolder}`);
        }
        if (!fs.existsSync(`${mainFolder}${category}`)) {
            fs.mkdirSync(`${mainFolder}${category}`);
        }
        if (subcategory !== undefined && !fs.existsSync(`${mainFolder}${category}/${subcategory}`)) {
            fs.mkdirSync(`${mainFolder}${category}/${subcategory}`);
        }
    } catch (err) {
        throw(err);
    }

}

// maybe update this in the future to be configurable
function formatPageNumber(pageNo) {
    return pageNo.toString().padStart(3, '0');
}

function formatTitle(title) {
    const split = title.split(' - ');
    return split[0].trim();
}

// back to the starting page to do the next set of actions, built in wait
async function reset(page, startingPage) {
    await page.goto(startingPage);
    await timer(config.shortWait);
}