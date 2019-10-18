import { getUrl, crawl, verbs } from "./crawler";
import { save, exists } from "./save";

(async () => {
    let i = 1;
    let errors = 0;
    let failedSites: string[] = [];

    for await(const verb of verbs()) {
        const url =  getUrl(verb);
        
        try {
            const alreadyCrawled = exists(verb);

            if(alreadyCrawled) {
                console.log(i.toString().padStart(4), `Skipping ${verb}`.padEnd(32), `[${ errors } Errors]`);
            }
            else {
                console.log(i.toString().padStart(4), verb.padEnd(32), `[${ errors } Errors]`);

                const data = await crawl(url);
                save(verb, data);
            }
    
            ++i;
    
            /*if(i > 2)
                break;*/
        }
        catch(e) {
            errors++;
            failedSites.push(url);

            console.log(i.toString().padStart(4), `Failed ${verb}`.padEnd(32), `[${ errors } Errors]`);
        }
    }

    if(failedSites.length > 0) {
        for(const site of failedSites) {
            console.log(`Failed: ${ site }`);
        }
    }
    else {
        console.log(`No errors`);
    }
})();