"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDown = void 0;
const colors_1 = __importDefault(require("colors"));
function countDown(length, callback) {
    let value = length;
    const interval = setInterval(() => {
        length = length - 1;
    }, 1000);
    if (value <= 0) {
        console.log(colors_1.default.bgCyan(`countDown: Triggering callback function`));
    }
}
exports.countDown = countDown;
