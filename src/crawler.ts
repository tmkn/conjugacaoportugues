import * as puppeteer from "puppeteer";

const presente = "presente";
const preterito_imperfeito = "preterito_imperfeito";
const preterito_perfeito = "preterito_perfeito";
const preterito_mais_que_perfeito = "preterito_mais_que_perfeito";
const futuro_do_presente = "futuro_do_presente";
const futuro_do_preterito = "futuro_do_preterito";

export interface ITempos {
    [presente]: IConjugation;
    [preterito_imperfeito]: IConjugation;
    [preterito_perfeito]: IConjugation;
    [preterito_mais_que_perfeito]: IConjugation;
    [futuro_do_presente]: IConjugation;
    [futuro_do_preterito]: IConjugation;
}

interface ICrawlResult {
    correctEncoding: boolean;
    conjugations: ITempos;
}

export function normalize(text: string): string {
    return text.replace(/ô/g, "o").replace(/ç/g, "c");
}

export function getUrl(verb: string): string {
    return `https://www.conjugacao.com.br/verbo-${ normalize(verb) }/`;
}

interface IConjugation {
    eu: string;
    tu: string;
    ele: string;
    nos: string;
    vos: string;
    eles: string;
}

function parse(): ICrawlResult {
    function correctEncoding(): boolean {
        const text = document.querySelector<HTMLElement>("#conjugacao > div:nth-child(1) > div > div:nth-child(2) > p > span > span:nth-child(7) > span:nth-child(1)")!.innerText;
    
        return text === "nós";
    }

    function parseTempo(el: Element): string[] {
        return new Array(...el.querySelectorAll<HTMLElement>("p>span>span .f")).map(el => el.innerText);
    }

    function getConjugation(data: string[]): IConjugation {
        if(data.length < 6)
            console.log(`Couldn't find conjugations for all pronouns`);

        return {
            eu: data[0],
            tu: data[1],
            ele: data[2],
            nos: data[3],
            vos: data[4],
            eles: data[5]
        }
    }

    const [
        presente,
        preterito_imperfeito,
        preterito_perfeito,
        preterito_mais_que_perfeito,
        futuro_do_presente,
        futuro_do_preterito,
        ...rest
    ] = document.querySelectorAll(".tempo-conjugacao");

    const encodingOk = correctEncoding();

    return {
        correctEncoding: encodingOk,
        conjugations: {
            presente: getConjugation(parseTempo(presente)),
            preterito_imperfeito: getConjugation(parseTempo(preterito_imperfeito)),
            preterito_perfeito: getConjugation(parseTempo(preterito_perfeito)),
            preterito_mais_que_perfeito: getConjugation(parseTempo(preterito_mais_que_perfeito)),
            futuro_do_presente: getConjugation(parseTempo(futuro_do_presente)),
            futuro_do_preterito: getConjugation(parseTempo(futuro_do_preterito)),
        }
    };
}

export async function crawl(url: string): Promise<ITempos> {
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

    await page.goto(url);

    let { conjugations, correctEncoding } = await page.evaluate(parse);

    if(!correctEncoding) {
        for(let [tempo, conjugation] of Object.entries(conjugations)) {
            for(let [pronoun, verb] of Object.entries(conjugation as IConjugation)) {
                conjugation[pronoun as keyof IConjugation] = Buffer.from(verb, "latin1").toString("utf8");
            }
        }
    }
    
    await browser.close();

    return conjugations;
}