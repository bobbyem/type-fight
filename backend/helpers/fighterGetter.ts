import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../env/env";
import { UserRequest } from "../types/types";
import { Fighter } from "../models/fighterModel";

export async function fighterGetter(req: Request) {
  const { _tfToken: token } = req.cookies;
  if (token == null) return;

  const _id = jwt.verify(token, env.jwt_secret as string);

  if (_id) return await Fighter.findOne({ _id });
}
