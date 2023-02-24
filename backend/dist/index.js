"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colors_1 = __importDefault(require("colors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const admin_ui_1 = require("@socket.io/admin-ui");
const router_1 = require("./router/router");
const env_1 = __importDefault(require("./env/env"));
const db_1 = require("./db/db");
const fightHandlers_1 = require("./handlers/fightHandlers");
const app = (0, express_1.default)(); //Instantiate app
const server = http_1.default.createServer(app);
const allowedOrigins = [
    "http://localhost:3000",
    "https://admin.socket.io",
    "https://type-fight.vercel.app/",
    "https://type-fight-git-develop-bobbyem.vercel.app",
];
const io = new socket_io_1.Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
});
(0, db_1.connectDB)(); //Connect to the mongodb database
app.use((0, cors_1.default)({ origin: allowedOrigins }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/", router_1.router);
io.on("connection", function (socket) {
    //Log connection id
    console.log(colors_1.default.bgYellow(`Connected to socket with ID: ${socket.id}`));
    //Disconnecting
    socket.on("disconnecting", (reason) => __awaiter(this, void 0, void 0, function* () {
        console.log(`socket ${socket.id} will disconnect due to ${reason}`);
        const rooms = Array.from(socket.rooms);
        yield Promise.all(rooms.map((room) => __awaiter(this, void 0, void 0, function* () { return yield (0, fightHandlers_1.removeFighter)(socket.id, room); })));
    }));
    //Disconnect
    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
    socket.on("ping", () => {
        console.log(colors_1.default.bgMagenta("Ping"));
        io.emit("pong", () => {
            data: "Pong";
        });
    });
    socket.on("join_room", (room, token) => __awaiter(this, void 0, void 0, function* () {
        console.log(colors_1.default.bgBlue(`${socket.id} joined room ${room}`));
        yield (0, fightHandlers_1.addPlayer)(token, room, socket.id);
        socket.join(room);
    }));
});
server.listen(process.env.PORT, () => {
    console.log(colors_1.default.bgGreen(`Server running on PORT: ${env_1.default.port} `));
});
(0, admin_ui_1.instrument)(io, { auth: false });
