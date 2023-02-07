"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)(); //Instantiate app
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
const word = "Måndag";
const words = fs_1.default.readFileSync("words.json");
const parsed = JSON.parse(words);
dotenv_1.default.config(); // Initialize env
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
io.on("connection", function (socket) {
    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
    socket.on("ping", () => {
        console.log(colors_1.default.bgMagenta("Ping"));
        io.emit("pong", () => {
            data: "Pong";
        });
    });
    socket.on("userInput", (userInput) => {
        console.log(userInput);
        if (handleUserInput(userInput)) {
            console.log(colors_1.default.rainbow(`User: ${socket.id} was correct`));
            return io.emit("correct");
        }
    });
});
console.log(parsed.words[5]);
function handleUserInput(input) {
    if (input === word) {
        return true;
    }
    return false;
}
server.listen(process.env.PORT, () => {
    console.log(colors_1.default.bgGreen(`Server running on PORT: ${process.env.PORT}`));
});
