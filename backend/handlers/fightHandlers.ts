import jwt from "jsonwebtoken";
import { CreateFightParameters } from "../types/types";
import colors from "colors";
import { Fight } from "../models/fightModel";
import { wordGetter } from "../helpers/wordGetter";
import env from "../env/env";
import { Fighter } from "../models/fighterModel";

export async function createFight(parameters: CreateFightParameters) {
  const { complexity, maxPlayers, creator } = parameters;
  const word = await wordGetter(complexity);
  console.log(colors.bgYellow(`createFight:`));
  try {
    return await Fight.collection.insertOne({
      complexity,
      word,
      maxPlayers,
      creator,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function getFights() {
  try {
    const fights = await Fight.find();
    return fights.map((fight) => {
      if (fight.finished) {
        return fight; //If game is finished return word - else censor it
      }
      fight.word = "******";
      return fight;
    });
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function joinFight(_id: string) {
  console.log(colors.bgYellow(`joinFight:`));
  const fight = await Fight.findOne({ _id });

  console.log(fight);

  if (fight) {
    return { room: _id };
  }

  return { message: "Game is full or unavailable" };
}

export async function addPlayer(token: string, room: string) {
  const _id = jwt.verify(token, env.jwt_secret as string);

  const fighter = await Fighter.findOne({ _id });

  await Fight.updateOne({ _id }, { $push: { fighters: fighter } });
}
