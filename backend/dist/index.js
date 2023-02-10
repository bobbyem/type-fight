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
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const admin_ui_1 = require("@socket.io/admin-ui");
const express_openid_connect_1 = require("express-openid-connect");
const app = (0, express_1.default)(); //Instantiate app
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io"],
        credentials: true,
    },
});
const word = "Måndag";
const words = fs_1.default.readFileSync("words.json");
const parsed = JSON.parse(words);
dotenv_1.default.config(); // Initialize env
app.use((0, cors_1.default)({ origin: ["http://localhost:3000", "https://admin.socket.io"] }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_openid_connect_1.auth)({
    authRequired: false,
    auth0Logout: true,
    idpLogout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.AUTH_SECRET,
}));
app.use("/", (req, res) => {
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});
app.use("/profile", (0, express_openid_connect_1.requiresAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(colors_1.default.bgBlue(JSON.stringify(yield req.oidc.fetchUserInfo())));
    res.send(JSON.stringify(yield req.oidc.fetchUserInfo()));
}));
io.on("connection", function (socket) {
    setInterval(() => console.log(colors_1.default.bgYellow(`Connected to socket with ID: ${socket.id}`)), 60000);
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
    console.log(colors_1.default.bgGreen(`Server running on PORT: ${process.env.PORT} `));
});
(0, admin_ui_1.instrument)(io, { auth: false });
