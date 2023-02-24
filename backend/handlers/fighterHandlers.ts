import { FighterData, LoginData } from "../types/types";
import colors from "colors";
import bcrypt from "bcryptjs";
import { Fighter } from "../models/fighterModel";
import jwt, { Secret } from "jsonwebtoken";
import env from "../env/env";

export async function registerFighter(fighterData: FighterData) {
  try {
    const newFighter = {
      name: fighterData.name,
      email: fighterData.email,
      password: await bcrypt.hash(fighterData.password, 10),
    };
    return await Fighter.collection.insertOne(newFighter);
  } catch (error: any) {
    console.log(colors.bgRed(error));
    return { message: "Something went wrong" };
  }
}

export async function loginFighter(loginData: LoginData) {
  try {
    console.log(colors.bgYellow(`loginFighter:`));
    const fighter = await Fighter.collection.findOne({
      email: loginData.email,
    });
    if (
      fighter &&
      (await bcrypt.compare(loginData.password, fighter.password))
    ) {
      const token = jwt.sign({ _id: fighter._id }, env.jwt_secret as Secret);
      const payload = {
        token: token,
        fighter: { ...fighter, password: "*****" },
      };
      return payload;
    }
  } catch (error: any) {
    console.log(colors.bgRed(error));
  }
}

export async function getFighterName(_id: string) {
  try {
    const fighter = await Fighter.findOne({ _id });
    return fighter?.name;
  } catch (error: any) {
    console.log(colors.bgRed(error));
    return;
  }
}
