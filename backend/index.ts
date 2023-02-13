import express from "express";
import colors from "colors";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser"
import { instrument } from "@socket.io/admin-ui";
import { router } from "./router/router";
import env from "./env/env"
import { connectDB} from "./db/db";

const app = express(); //Instantiate app
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:3000", "https://admin.socket.io", "https://type-fight.vercel.app/"]
const io = new Server(server, {
  cors: {origin: allowedOrigins
    ,
    credentials: true,
  },
});

connectDB(); //Connect to the mongodb database 

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/", router);

io.on("connection", function (socket) {
  setInterval(
    () =>
      console.log(colors.bgYellow(`Connected to socket with ID: ${socket.id}`)),
    60000
  );

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("ping", () => {
    console.log(colors.bgMagenta("Ping"));
    io.emit("pong", () => {
      data: "Pong";
    });
  });
});


server.listen(process.env.PORT, () => {
  console.log(colors.bgGreen(`Server running on PORT: ${env.port} `));
});

instrument(io, { auth: false });
