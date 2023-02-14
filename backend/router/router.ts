import express from "express";
import { createFight } from "../handlers/fightHandlers";
import colors from "colors";
import { loginFighter, registerFighter } from "../handlers/fighterHandlers";
import { authChecker } from "../helpers/authChecker";
import { UserRequest } from "../types/types";

//Instance router
export const router = express.Router();

//Fight routes
//POST fight
router.post("/fight", async (req, res) => {
  const { complexity, maxPlayers } = req.body;
  if (!complexity) {
    return res.sendStatus(400);
  }
  const parameters = req.body;
  return res.send(await createFight(parameters));
});

//Fighter routes
//POST fighter
router.post("/fighter/register", async (req, res) => {
  console.log(colors.bgMagenta(`Register: ${req.body.name}`));
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.sendStatus(400);
  }
  try {
    return res.send(await registerFighter(req.body));
  } catch (error: any) {
    console.log(colors.bgRed(error));
  }
});

//Login fighter
router.post("/fighter/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(400);
  }
  try {
    const token = await loginFighter(req.body);
    if (token) {
      return res.cookie("_tfToken", token).send({ message: "ok" });
    }
    return res.sendStatus(500);
  } catch (error: any) {
    console.log(colors.bgRed(error));
  }
});

router.get("/auth", authChecker, (req, res) => {
  return res.send(req.cookies);
});
