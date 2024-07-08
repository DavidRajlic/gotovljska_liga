var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  team1: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
  time: String,
  team1Goals: Number,
  team2Goals: Number,
  team1Scorers: Array,
  team2Scorers: Array,
  winner: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
});

module.exports = mongoose.model("match", matchSchema);
