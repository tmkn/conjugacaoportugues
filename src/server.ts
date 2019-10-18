import * as express from "express";
import * as cors from "cors";
import * as fs from "fs";
import * as path from "path";

import { ITempos, normalize } from "./crawler";
import { verbs } from "./crawler";

const app = express();
const port = 3001;

app.use(cors());

app.get("/verb/:verb", async (req, res) => {
    const verb = req.params.verb;
    const data = await getVerb(verb);

    if(data)
        res.json(data);
    else
        res.status(404).send("Not found");
});

app.listen(port, () => console.log(`Server started on port ${port}!`));

async function getVerb(verb: string): Promise<ITempos | undefined> {
    for await (const v of verbs()) {
        const normalized = normalize(v);

        if(verb === normalized) {
            try {
                const jsonPath = path.join("conjugacao", `${v}.json`);
                const data = fs.readFileSync(jsonPath, "utf8");
    
                return JSON.parse(data);
            }
            catch {
                return;
            }
        }
    }
}