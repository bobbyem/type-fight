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
exports.addStartTime = exports.addPlacement = exports.updateFightState = void 0;
const colors_1 = __importDefault(require("colors"));
const env_1 = __importDefault(require("../env/env"));
const fightModel_1 = require("../models/fightModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fighterModel_1 = require("../models/fighterModel");
function updateFightState(id, newState) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(colors_1.default.bgCyan(`startFight: ${id}`));
        yield fightModel_1.Fight.findOne({ _id: id })
            .then((doc) => {
            if (!doc)
                return;
            doc.state = newState;
            doc.save();
        })
            .catch((error) => console.error(error));
    });
}
exports.updateFightState = updateFightState;
function addPlacement(token, gameId, time) {
    return __awaiter(this, void 0, void 0, function* () {
        const _id = jsonwebtoken_1.default.verify(token, env_1.default.jwt_secret);
        const fighter = yield fighterModel_1.Fighter.findOne({ _id });
        const fight = yield fightModel_1.Fight.findOne({ _id: gameId });
        if (!fight)
            return console.error(`addPlacement: no matching fight found`);
        const placementItem = {
            name: fighter === null || fighter === void 0 ? void 0 : fighter.name,
            fId: fighter === null || fighter === void 0 ? void 0 : fighter._id,
            timeStamp: time,
        };
        if (fight === null || fight === void 0 ? void 0 : fight.placement.find((placementItem) => placementItem.fId.toString() === _id._id.toString()))
            return console.error(`addPlacement: user already registered`);
        fight.placement.push(placementItem);
        fight.save();
        if (fight.startTime) {
            return time.getTime() - fight.startTime.getTime();
        }
    });
}
exports.addPlacement = addPlacement;
function addStartTime(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fightModel_1.Fight.findOne({ _id: gameId }).then(doc => {
            if (!doc)
                return;
            if (doc && !doc.startTime) {
                doc.startTime = new Date();
                doc.save();
            }
            ;
        });
    });
}
exports.addStartTime = addStartTime;
