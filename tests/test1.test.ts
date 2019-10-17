import * as path from "path";
import * as url from "url";

import { expect } from "chai";
import { crawl } from "../src/crawler";

describe("Crawler Tests", () => {
    const relativePath = path.join("./", "tests", "data", "ser.html");
    const absolutePath = path.resolve(relativePath);
    const fileUrl = url.pathToFileURL(absolutePath).toString();

    it("Correctly parses Presente", async () => {
        const data = {     
            eu: 'sou',   
            tu: 'és',    
            ele: 'é',    
            nos: 'somos',
            vos: 'sois', 
            eles: 'são'  
        };

        const { presente: tempo } = await crawl(fileUrl);

        expect(tempo).to.deep.equal(data);
    });

    it("Correctly parses Pretérito Imperfeito", async () => {
        const data = {
            eu: 'era',
            tu: 'eras',
            ele: 'era',
            nos: 'éramos',
            vos: 'éreis',
            eles: 'eram'
        };

        const { preterito_imperfeito: tempo } = await crawl(fileUrl);

        expect(tempo).to.deep.equal(data);
    });

    it("Correctly parses Pretérito Perfeito", async () => {
        const data = {
            eu: 'fui',
            tu: 'foste',
            ele: 'foi',
            nos: 'fomos',
            vos: 'fostes',
            eles: 'foram'
        };

        const { preterito_perfeito: tempo } = await crawl(fileUrl);

        expect(tempo).to.deep.equal(data);
    });

    it("Correctly parses Pretérito Mais-que-perfeito", async () => {
        const data = {
            eu: 'fora',
            tu: 'foras',
            ele: 'fora',
            nos: 'fôramos',
            vos: 'fôreis',
            eles: 'foram'
        };

        const { preterito_mais_que_perfeito: tempo } = await crawl(fileUrl);

        expect(tempo).to.deep.equal(data);
    });

    it("Correctly parses Futuro do Presente", async () => {
        const data = {
            eu: 'serei',
            tu: 'serás',
            ele: 'será',
            nos: 'seremos',
            vos: 'sereis',
            eles: 'serão'
        };

        const { futuro_do_presente: tempo } = await crawl(fileUrl);

        expect(tempo).to.deep.equal(data);
    });

    it("Correctly parses Futuro do Pretérito", async () => {
        const data = {
            eu: 'seria',
            tu: 'serias',
            ele: 'seria',
            nos: 'seríamos',
            vos: 'seríeis',
            eles: 'seriam'
        };

        const { futuro_do_preterito: tempo } = await crawl(fileUrl);

        expect(tempo).to.deep.equal(data);
    });
});