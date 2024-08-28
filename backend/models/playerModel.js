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
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
});

module.exports = mongoose.model("player", playerSchema);
