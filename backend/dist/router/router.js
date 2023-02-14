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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const fightHandlers_1 = require("../handlers/fightHandlers");
const colors_1 = __importDefault(require("colors"));
const fighterHandlers_1 = require("../handlers/fighterHandlers");
const authChecker_1 = require("../helpers/authChecker");
//Instance router
exports.router = express_1.default.Router();
//Fight routes
//POST fight
exports.router.post("/fight", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { complexity, maxPlayers } = req.body;
    if (!complexity) {
        return res.sendStatus(400);
    }
    const parameters = req.body;
    return res.send(yield (0, fightHandlers_1.createFight)(parameters));
}));
//Fighter routes
//POST fighter
exports.router.post("/fighter/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(colors_1.default.bgMagenta(`Register: ${req.body.name}`));
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.sendStatus(400);
    }
    try {
        return res.send(yield (0, fighterHandlers_1.registerFighter)(req.body));
    }
    catch (error) {
        console.log(colors_1.default.bgRed(error));
    }
}));
//Login fighter
exports.router.post("/fighter/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    }
    try {
        const token = yield (0, fighterHandlers_1.loginFighter)(req.body);
        if (token) {
            return res.cookie("_tfToken", token).send({ message: "ok" });
        }
        return res.sendStatus(500);
    }
    catch (error) {
        console.log(colors_1.default.bgRed(error));
    }
}));
exports.router.get("/auth", authChecker_1.authChecker, (req, res) => {
    return res.send(req.cookies);
});
