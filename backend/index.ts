import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
const app = express(); //Instantiate app
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
interface WordList {
  words: Array<string>;
}
const word = "Måndag";
const words: any = fs.readFileSync("words.json");
const parsed: WordList = JSON.parse(words);

dotenv.config(); // Initialize env
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", function (socket) {
  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("ping", () => {
    console.log(colors.bgMagenta("Ping"));
    io.emit("pong", () => {
      data: "Pong";
    });
  });

  socket.on("userInput", (userInput) => {
    console.log(userInput);

    if (handleUserInput(userInput)) {
      console.log(colors.rainbow(`User: ${socket.id} was correct`));
      return io.emit("correct");
    }
  });
});

console.log(parsed.words[5]);

function handleUserInput(input: string): boolean {
  if (input === word) {
    return true;
  }
  return false;
}

server.listen(process.env.PORT, () => {
  console.log(colors.bgGreen(`Server running on PORT: ${process.env.PORT}`));
});
