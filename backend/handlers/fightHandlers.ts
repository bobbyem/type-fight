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

  if (fight) {
    return { room: _id };
  }

  return { message: "Game is full or unavailable" };
}

export async function addPlayer(token: string, room: string, clientId: string) {
  console.log(
    colors.bgCyan(
      `addPlayer: token: ${token} room: ${room} clientId: ${clientId}`
    )
  );
  const _id = jwt.verify(token, env.jwt_secret as string);

  const fighter = await Fighter.findOne({ _id });
  const fight = await Fight.findOne({ _id: room });

  //Check if we found what we need
  if (!fighter || !fight) {
    console.log(colors.red("Can't find either fight or fighter"));
    return;
  }

  //TODO Check if fighter already added to fight
  const match = fight.fighters.map((fighter) => fighter._id === _id);
  if (fight.fighters.length > 0 && match) {
    console.log(colors.bgRed("Fighter aldready added to fight"));
    return;
  }

  await Fight.findOneAndUpdate(
    { _id: room },
    {
      $push: {
        fighters: {
          name: fighter?.name,
          _id: fighter?._id,
          clientId: clientId,
        },
      },
    }
  ).then((value) => console.log(value));

  return;
}

export async function removeFighter(clientId: string, room: string) {
  console.log(colors.bgCyan(`removeFighter: `));
  if (clientId === room) return;
  const fight = await Fight.findOne({ _id: room });

  if (!fight) {
    console.log(
      colors.bgRed(`removeFighter: could not find fight to remove player from`)
    );
  }

  if (fight && fight.fighters.length > 0) {
    console.log(colors.bgCyan(`removeFighter: finding match`));
    const match = fight.fighters.map(
      (fighter) => fighter.clientId === clientId
    );
    if (match) {
      console.log(colors.bgCyan(`removeFighter: findOneAndUpdate`));
      await Fight.findOneAndUpdate(
        { _id: room },
        { $pull: { fighters: { clientId: clientId } } }
      );
      return;
    }
  }
}
