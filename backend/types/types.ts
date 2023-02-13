import { Request } from "express";

export interface WordList {
    words: Array<string>;
}
export interface CreateFightParameters {
  creator: string,
  complexity: number,
  maxPlayers: number
}
  
export interface FighterData{
  name: string,
  email: string,
  password: string
}

export interface LoginData{
  email: string,
  password: string
}

export interface UserRequest extends Request{
  user: String
}