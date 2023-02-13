import { CreateFightParameters } from "../types/types";
import colors from "colors";
import { Fight } from "../models/fightModel";
import { wordGetter } from "../helpers/wordGetter";


export async function createFight(parameters: CreateFightParameters) {
    const { complexity, maxPlayers, creator } = parameters;
    const word = await wordGetter(complexity);
    console.log(colors.bgYellow(`createFight:`));
    try {
       return await Fight.collection.insertOne({complexity, word, maxPlayers, creator})
    } catch (error) {
        console.error(error)
    }

}

