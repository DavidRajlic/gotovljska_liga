var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: String,
  goalsScored: Number,
  yellowCards: Number,
  redCards: Number,
  mustPayYellowCard: Boolean,
  mustPayRedCard: Boolean,
  leader: Boolean,
});

module.exports = mongoose.model("player", playerSchema);
