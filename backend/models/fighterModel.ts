import mongoose from "mongoose";

const FighterSchema = new mongoose.Schema({
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
}, { timestamps: true })

export const Fighter = mongoose.model("Fighter", FighterSchema)