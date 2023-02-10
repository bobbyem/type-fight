import fs from "fs";
import { WordList } from "../types/types";

export async function wordGetter(){
    const words: any = fs.readFileSync("words.json");
    const parsed: WordList = JSON.parse(words);
}