import { Request } from "express";

export interface WordList {
  words: Array<string>;
}
export interface CreateFightParameters {
  creator: string;
  complexity: number;
  maxPlayers: number;
}

export interface FighterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserRequest extends Request {
  user: String;
}

export type FightState = "preStart" | "countDown" | "running" | "ended";

export type AuthType = "login" | "register";

export interface Fight {
  _id: string;
  complexity: number;
  creator: string | null;
  startTime?: Date | string | null;
  fighters: [] | Array<Fighter>;
  finished: boolean;
  maxPlayers: number;
  state: "preStart" | "countDown" | "running" | "ended";
  word: string;
}
export interface Fighter {
  name: string;
  email: string;
  admin: boolean;
  password: string;
  gamesPlayed: [] | Array<string>;
}
