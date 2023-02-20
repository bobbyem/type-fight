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
