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
exports.fighterGetter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../env/env"));
const fighterModel_1 = require("../models/fighterModel");
function fighterGetter(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _tfToken: token } = req.cookies;
        if (token == null)
            return;
        const _id = jsonwebtoken_1.default.verify(token, env_1.default.jwt_secret);
        if (_id)
            return yield fighterModel_1.Fighter.findOne({ _id });
    });
}
exports.fighterGetter = fighterGetter;
