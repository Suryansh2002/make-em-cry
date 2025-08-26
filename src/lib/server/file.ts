import "server-only";

import path from "path";
import { readFile, unlink, writeFile } from "fs/promises";

export async function loadData(): Promise<Array<Character>> {
    const data = await readFile("./uploads/info.json", "utf-8");
    return JSON.parse(data);
}

export async function deleteCharacter(name: string): Promise<void> {
    const data = await loadData();
    const newData = data.filter(character => character.name !== name);
    await writeFile(path.join(process.cwd(), "uploads/info.json"), JSON.stringify(newData));
    try{
        await unlink(path.join(process.cwd(), "uploads", `${name}.png`));
    } catch (error) {
        console.error(`Error deleting ${name}.png:`, error);
    }
    try {
        await unlink(path.join(process.cwd(), "uploads", `${name}-crying.png`));
    } catch (error) {
        console.error(`Error deleting ${name}-crying.png:`, error);
    }
}

export async function findCharacterByName(name: string): Promise<Character | null> {
    const characters = await loadData();
    return characters.find(character => character.name === name) || null;
}