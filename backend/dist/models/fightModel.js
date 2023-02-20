"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fight = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FightSchema = new mongoose_1.default.Schema({
    room: {
        type: String,
        required: true,
    },
    finished: {
        type: Boolean,
        default: false,
    },
    state: {
        type: String,
        default: "preStart", // "preStart", "waiting", "countDown", "started", "ended", "error"
    },
    startTime: {
        type: Date,
    },
    creator: {
        type: String,
        required: true,
    },
    fighters: {
        type: Array,
        default: [], //Objects {userId, name, ready}
    },
    complexity: {
        type: Number,
        required: true,
    },
    word: {
        type: String,
        required: true,
    },
    maxPlayers: {
        type: Number,
        required: true,
        default: 0, // 0 Will be infinite amount of players
    },
    placement: {
        type: Array,
        default: [], //I guesse these will be objects with userId and the finish time
    },
}, { timestamps: true });
exports.Fight = mongoose_1.default.model("Fight", FightSchema);
