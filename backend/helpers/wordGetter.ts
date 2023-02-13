import fs from "fs";
import { WordList } from "../types/types";

export async function wordGetter(complexity: number) {
    try {
        const file: any = await fs.readFileSync("./words/words.json");
        const parsed: WordList = JSON.parse(file);
        const words = parsed.words;
        const filteredWords = words.filter(word => word.length === complexity);
        const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];

        return word;
    } catch (error) {
        console.error(error)
    }
}