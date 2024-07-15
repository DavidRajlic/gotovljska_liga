var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  team1Id: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
  team2Id: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
  team1: String,
  team2: String,
  time: String,
  team1Goals: Number,
  team2Goals: Number,
  team1Scorers: Array,
  team2Scorers: Array,
  team1YellowCards: Array,
  team2YellowCards: Array,
  team1RedCards: Array,
  team2RedCards: Array,
  date: String,
  matchday: Number,
  matchPlayed: Boolean,
  winner: {
    type: Schema.Types.ObjectId || String,
    ref: "team",
  },
});

module.exports = mongoose.model("match", matchSchema);
