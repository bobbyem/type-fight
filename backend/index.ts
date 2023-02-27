import { Fight, UserRequest } from "./types/types";
import express from "express";
import colors from "colors";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { instrument } from "@socket.io/admin-ui";
import { router } from "./router/router";
import env from "./env/env";
import { connectDB } from "./db/db";
import {
  addPlayer,
  getFight,
  getFights,
  removeFighter,
} from "./handlers/fightHandlers";
import {
  addPlacement,
  addStartTime,
  updateFightState,
} from "./helpers/fightFunctions";

const app = express(); //Instantiate app
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "https://admin.socket.io",
  "https://type-fight.vercel.app/",
  "https://type-fight-git-develop-bobbyem.vercel.app",
];
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

connectDB(); //Connect to the mongodb database

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", router);

io.on("connection", function (socket) {
  //Log connection id
  console.log(colors.bgYellow(`Connected to socket with ID: ${socket.id}`));

  //Disconnecting
  socket.on("disconnecting", async (reason) => {
    console.log(`socket ${socket.id} will disconnect due to ${reason}`);
    const rooms = Array.from(socket.rooms);
    await Promise.all(
      rooms.map(async (room) => await removeFighter(socket.id, room))
    );
  });

  //Disconnect
  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("ping", () => {
    console.log(colors.bgMagenta("Ping"));
    io.emit("pong", () => {
      data: "Pong";
    });
  });

  socket.on("join_room", async (room, token) => {
    if (!room || !token)
      return console.log(
        colors.bgRed(
          `join_room: missing parameters: room:${room} token:${token}`
        )
      );
    console.log(colors.bgBlue(`${socket.id} joined room ${room}`));

    const fight = await getFight(room);

    if (fight && fight.state !== "preStart") {
      console.log(colors.bgBlue("redirect"));
      socket.to(socket.id).emit("redirect", "/fights");
      return;
    }
    await addPlayer(token, room, socket.id);
    socket.join(room);
  });

  socket.on("start_game", async (room) => {
    console.log(`Starting game: ${room}`);
    await updateFightState(room, "countDown");
    const fight = await getFight(room);
    let value = 10;
    const interval = setInterval(() => {
      value = value - 1;
      io.in(room).emit("countdown", value);
      stop(value);
      console.log(value);
    }, 1000);

    function stop(value: number) {
      if (value <= 0) {
        clearInterval(interval);
        io.in(room).emit("word", fight.word);
        addStartTime(room);
        updateFightState(room, "running");
      }
    }
  });

  socket.on("user_input", async (input, room, token) => {
    if (!input || !room || !token)
      return console.log(
        colors.bgRed(`user_input: missing parameters input or room`)
      );
    const fight: Fight = await getFight(room);
    if (fight.word && fight.word === input) {
      const time = new Date();
      const completionTime = await addPlacement(token, room, time);
      io.in(socket.id).emit("correct", completionTime);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(colors.bgGreen(`Server running on PORT: ${env.port} `));
});

instrument(io, { auth: false });
