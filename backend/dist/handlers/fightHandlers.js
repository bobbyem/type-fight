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
exports.addPlayer = exports.joinFight = exports.getFights = exports.createFight = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const colors_1 = __importDefault(require("colors"));
const fightModel_1 = require("../models/fightModel");
const wordGetter_1 = require("../helpers/wordGetter");
const env_1 = __importDefault(require("../env/env"));
const fighterModel_1 = require("../models/fighterModel");
function createFight(parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const { complexity, maxPlayers, creator } = parameters;
        const word = yield (0, wordGetter_1.wordGetter)(complexity);
        console.log(colors_1.default.bgYellow(`createFight:`));
        try {
            return yield fightModel_1.Fight.collection.insertOne({
                complexity,
                word,
                maxPlayers,
                creator,
            });
        }
        catch (error) {
            console.error(error);
            return error;
        }
    });
}
exports.createFight = createFight;
function getFights() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fights = yield fightModel_1.Fight.find();
            return fights.map((fight) => {
                if (fight.finished) {
                    return fight; //If game is finished return word - else censor it
                }
                fight.word = "******";
                return fight;
            });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });
}
exports.getFights = getFights;
function joinFight(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(colors_1.default.bgYellow(`joinFight:`));
        const fight = yield fightModel_1.Fight.findOne({ _id });
        console.log(fight);
        if (fight) {
            return { room: _id };
        }
        return { message: "Game is full or unavailable" };
    });
}
exports.joinFight = joinFight;
function addPlayer(token, room) {
    return __awaiter(this, void 0, void 0, function* () {
        const _id = jsonwebtoken_1.default.verify(token, env_1.default.jwt_secret);
        const fighter = yield fighterModel_1.Fighter.findOne({ _id });
        yield fightModel_1.Fight.updateOne({ _id }, { $push: { fighters: fighter } });
    });
}
exports.addPlayer = addPlayer;
