import * as puppeteer from "puppeteer";
import * as path from "path";
import * as fs from "fs";

import { verbs } from "./crawler";

interface ICrawlResult {
    translations: string[];
}

function url(verb: string): string {
    return `https://www.linguee.pt/portugues-alemao/search?source=auto&query=${encodeURIComponent(verb)}`;
}

async function crawl(url: string): Promise<ICrawlResult> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
    await page.goto(url);

    let result: ICrawlResult = await page.evaluate(parse);
    
    await browser.close();

    return result;
} 

function parse(): ICrawlResult {
    return {
        translations: new Array(...document.querySelectorAll<HTMLElement>(".translation.featured .tag_trans>a")).map(el => el.innerText).filter(t => t !== "")
    }
}

function save(verb: string, translations: string[]): void {
    const fileName = getFilePath(verb);

    fs.writeFileSync(fileName, JSON.stringify(translations), "utf8");
}

const outDir = path.join("./", "conjugacao", "de");
function getFilePath(verb: string): string {
    return path.join(outDir, `${ verb }.json`);
}

function translationExists(verb: string): boolean {
    const filePath = getFilePath(verb);

    return fs.existsSync(filePath);
}

(async () => {
    let i = 1;
    let failedVerbs: string[] = [];

    for await(const verb of verbs()) {
        try {
            const exists = translationExists(verb);

            if(exists) {
                console.log(`[${i.toString().padStart(4)}]`, failedVerbs.length,`Skipping: ${verb}`);
            }
            else {
                let { translations } = await crawl(url(verb));

                if(translations.length === 0) {
                    failedVerbs.push(verb);
                    console.log(`[${i.toString().padStart(4)}]`, failedVerbs.length,`Failed: ${verb}`);
                }
                else {
                    save(verb, translations);
                    console.log(`[${i.toString().padStart(4)}]`, failedVerbs.length, `Fetched: ${verb}`);
                }

                //await new Promise(resolve => setTimeout(() => resolve(), 15000));
            }
    
            ++i;
    
            /*if(i > 2)
                break;*/
        }
        catch(e) {
            console.log(e);
        }
    }

    if(failedVerbs.length > 0)
        console.log(failedVerbs);
})();