import * as path from "path";
import * as fs from "fs";

import { ITempos } from "./crawler";

const targetDir: string = path.join("./", "conjugacao");

export function save(verb: string, tempos: ITempos): void {
    const file = path.join(targetDir, `${ verb }.json`);

    fs.writeFileSync(file, JSON.stringify(tempos), "utf8");
}

export function exists(verb: string): boolean {
    const file = path.join(targetDir, `${ verb }.json`);

    return fs.existsSync(file);
}