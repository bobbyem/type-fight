import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express"
import env from "../env/env";
import { UserRequest } from "../types/types";

export async function authChecker(req: UserRequest, res: Response, next:NextFunction) {
    const {_tfToken: token} = req.cookies
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, env.jwt_secret as string, (err: any, user: any) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}