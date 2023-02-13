"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fighter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FighterSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false,
    },
    gamesPlayed: {
        type: Array,
        default: []
    }
}, { timestamps: true });
exports.Fighter = mongoose_1.default.model("Fighter", FighterSchema);
