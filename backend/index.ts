import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { instrument } from "@socket.io/admin-ui";
import { auth, requiresAuth } from "express-openid-connect";

const app = express(); //Instantiate app
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

const word = "Måndag";
const words: any = fs.readFileSync("words.json");
const parsed: WordList = JSON.parse(words);

dotenv.config(); // Initialize env
app.use(cors({ origin: ["http://localhost:3000", "https://admin.socket.io"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    idpLogout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.AUTH_SECRET,
  })
);

app.use("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.use("/profile", requiresAuth(), async (req, res) => {
  console.log(colors.bgBlue(JSON.stringify(await req.oidc.fetchUserInfo())));
  res.send(JSON.stringify(await req.oidc.fetchUserInfo()));
});

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
  console.log(colors.bgGreen(`Server running on PORT: ${process.env.PORT} `));
});

instrument(io, { auth: false });
