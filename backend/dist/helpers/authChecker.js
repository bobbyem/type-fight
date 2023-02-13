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
exports.authChecker = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../env/env"));
function authChecker(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _tfToken: token } = req.cookies;
        if (token == null)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(token, env_1.default.jwt_secret, (err, user) => {
            console.log(err);
            if (err)
                return res.sendStatus(403);
            req.user = user;
            next();
        });
    });
}
exports.authChecker = authChecker;
