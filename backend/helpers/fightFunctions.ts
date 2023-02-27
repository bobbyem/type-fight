import colors from "colors";
import env from "../env/env";
import { Fight } from "../models/fightModel";
import { FightState } from "../types/types";
import jwt from "jsonwebtoken";
import { Fighter } from "../models/fighterModel";

export async function updateFightState(id: string, newState: FightState) {
  console.log(colors.bgCyan(`startFight: ${id}`));
  await Fight.findOne({ _id: id })
    .then((doc) => {
      if (!doc) return;

      doc.state = newState;
      doc.save();
    })
    .catch((error) => console.error(error));
}

export async function addPlacement(token: string, gameId: string, time: Date) {
  const _id = jwt.verify(token, env.jwt_secret as string);
  const fighter = await Fighter.findOne({ _id });
  const fight = await Fight.findOne({ _id: gameId });

  if (!fight) return console.error(`addPlacement: no matching fight found`);
  const placementItem = {
    name: fighter?.name,
    fId: fighter?._id,
    timeStamp: time,
  };

  if (
    fight?.placement.find(
      (placementItem) => placementItem.fId.toString() === _id._id.toString()
    )
  ) {
    return;
  }

  fight.placement.push(placementItem);
  fight.save();
  if (fight.startTime) {
    return time.getTime() - fight.startTime.getTime();
  }
}

export async function addStartTime(gameId: string) {
  await Fight.findOne({ _id: gameId }).then((doc) => {
    if (!doc) return;
    if (doc && !doc.startTime) {
      doc.startTime = new Date();
      doc.save();
    }
  });
}
