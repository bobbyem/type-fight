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
exports.loginFighter = exports.registerFighter = void 0;
const colors_1 = __importDefault(require("colors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fighterModel_1 = require("../models/fighterModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../env/env"));
function registerFighter(fighterData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newFighter = {
                name: fighterData.name,
                email: fighterData.email,
                password: yield bcryptjs_1.default.hash(fighterData.password, 10),
            };
            return yield fighterModel_1.Fighter.collection.insertOne(newFighter);
        }
        catch (error) {
            console.log(colors_1.default.bgRed(error));
            return { message: "Something went wrong" };
        }
    });
}
exports.registerFighter = registerFighter;
function loginFighter(loginData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(colors_1.default.bgYellow(`loginFighter:`));
            const fighter = yield fighterModel_1.Fighter.collection.findOne({
                email: loginData.email,
            });
            if (fighter &&
                (yield bcryptjs_1.default.compare(loginData.password, fighter.password))) {
                const token = jsonwebtoken_1.default.sign({ _id: fighter._id }, env_1.default.jwt_secret);
                const payload = {
                    token: token,
                    fighter: Object.assign(Object.assign({}, fighter), { password: "*****" }),
                };
                console.log(payload);
                return payload;
            }
        }
        catch (error) {
            console.log(colors_1.default.bgRed(error));
        }
    });
}
exports.loginFighter = loginFighter;
