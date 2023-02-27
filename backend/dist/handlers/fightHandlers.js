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
exports.removeFighter = exports.addPlayer = exports.joinFight = exports.getFights = exports.createFight = void 0;
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
function getFights(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (_id) {
            try {
                const fight = yield fightModel_1.Fight.findOne({ _id });
                return fight;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        }
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
        if (fight && fight.state === "preStart") {
            return { room: _id };
        }
        return { message: "Game is full or unavailable" };
    });
}
exports.joinFight = joinFight;
function addPlayer(token, room, clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(colors_1.default.bgCyan(`addPlayer: token: ${token} room: ${room} clientId: ${clientId}`));
        const _id = jsonwebtoken_1.default.verify(token, env_1.default.jwt_secret);
        const fighter = yield fighterModel_1.Fighter.findOne({ _id });
        const fight = yield fightModel_1.Fight.findOne({ _id: room });
        //Check if we found what we need
        if (!fighter || !fight) {
            console.log(colors_1.default.red("Can't find either fight or fighter"));
            return;
        }
        console.log();
        //TODO Check if fighter already added to fight
        const match = fight.fighters.find((f) => f._id.toString() === _id._id.toString());
        console.log(match);
        if (fight.fighters.length > 0 && match) {
            console.log(colors_1.default.bgRed("Fighter aldready added to fight"));
            console.log(colors_1.default.bgRed("Updating fight id"));
            yield fightModel_1.Fight.findOne({ _id: room })
                .then((doc) => {
                if (!doc || !clientId)
                    return;
                doc.fighters.map((fighter) => {
                    if (fighter._id === _id)
                        fighter.clientId = clientId;
                });
                doc === null || doc === void 0 ? void 0 : doc.save();
            })
                .catch((error) => console.error(error));
            return;
        }
        yield fightModel_1.Fight.findOneAndUpdate({ _id: room }, {
            $push: {
                fighters: {
                    name: fighter === null || fighter === void 0 ? void 0 : fighter.name,
                    _id: fighter === null || fighter === void 0 ? void 0 : fighter._id,
                    clientId: clientId,
                },
            },
        });
        return;
    });
}
exports.addPlayer = addPlayer;
function removeFighter(clientId, room) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(colors_1.default.bgCyan(`removeFighter: `));
        if (clientId === room)
            return;
        const fight = yield fightModel_1.Fight.findOne({ _id: room });
        if (!fight) {
            console.log(colors_1.default.bgRed(`removeFighter: could not find fight to remove player from`));
        }
        if (fight && fight.fighters.length > 0) {
            console.log(colors_1.default.bgCyan(`removeFighter: finding match`));
            const match = fight.fighters.map((fighter) => fighter.clientId === clientId);
            if (match) {
                console.log(colors_1.default.bgCyan(`removeFighter: findOneAndUpdate`));
                yield fightModel_1.Fight.findOneAndUpdate({ _id: room }, { $pull: { fighters: { clientId: clientId } } });
                return;
            }
        }
    });
}
exports.removeFighter = removeFighter;
