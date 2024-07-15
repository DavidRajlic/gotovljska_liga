var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = new Schema({
  name: String,
  players: Array,
  points: Number,
  goalsScored: Number,
  goalsConceded: Number,
  goalDiffrence: Number,
  matchesPlayed: Number,
  yellowCards: Number,
  redCards: Number,
  wins: Number,
  draws: Number,
  losses: Number,
});

module.exports = mongoose.model("team", teamSchema);
