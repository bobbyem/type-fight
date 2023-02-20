import mongoose from "mongoose";

const FightSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

export const Fight = mongoose.model("Fight", FightSchema);
