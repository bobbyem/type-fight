import express from "express";
import { createFight, getFights, joinFight } from "../handlers/fightHandlers";
import colors from "colors";
import { loginFighter, registerFighter } from "../handlers/fighterHandlers";
import { fighterGetter } from "../helpers/fighterGetter";
import { UserRequest } from "../types/types";

//Instance router
export const router = express.Router();

//Fight routes
//POST fight
router.post("/fight", async (req, res) => {
  //Auth check
  // const fighter = await fighterGetter(req);
  // if (!fighter) return res.sendStatus(500);

  //Check required parameters
  const { complexity, maxPlayers } = req.body;
  if (!complexity) {
    return res.sendStatus(400);
  }
  const parameters = req.body;
  return res.send(await createFight(parameters));
});

//GET fights
router.get("/fights", async (req, res) => {
  // const fighter = await fighterGetter(req);
  // if (!fighter) return res.sendStatus(500);

  return res.json(await getFights());
});

//POST fight
//Join fight
router.post("/fight/join", async (req, res) => {
  const { _id } = req.body;
  if (!_id) return res.sendStatus(500);
  return res.send(await joinFight(_id));
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
  console.log(colors.bgCyan("/fighter/login"));
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(400);
  }
  try {
    const token = await loginFighter(req.body);
    if (token) {
      return res.cookie("_tfToken", token).json({ token });
    }
    return res.sendStatus(500);
  } catch (error: any) {
    console.log(colors.bgRed(error));
  }
});

router.get("/fighter", async (req, res) => {
  const fighter = await fighterGetter(req);
  if (!fighter) return res.sendStatus(500);
  fighter.password = "*****";
  return res.json(fighter);
});
