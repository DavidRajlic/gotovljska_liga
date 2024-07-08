var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roundSchema = new Schema({
  round: Number,
  date: String,
  matches: Array,
});

module.exports = mongoose.model("round", roundSchema);
