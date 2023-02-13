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
exports.createFight = void 0;
const colors_1 = __importDefault(require("colors"));
const fightModel_1 = require("../models/fightModel");
const wordGetter_1 = require("../helpers/wordGetter");
function createFight(parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const { complexity, maxPlayers, creator } = parameters;
        const word = yield (0, wordGetter_1.wordGetter)(complexity);
        console.log(colors_1.default.bgYellow(`createFight:`));
        try {
            return yield fightModel_1.Fight.collection.insertOne({ complexity, word, maxPlayers, creator });
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.createFight = createFight;
