var MatchModel = require("../models/matchModel.js");

/**
 * matchController.js
 *
 * @description :: Server-side logic for managing matchs.
 */
module.exports = {
  /**
   * matchController.list()
   */
  list: async function (req, res) {
    try {
      const matches = await MatchModel.find()
        .populate("team1")
        .populate("team2");
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({
        message: "Error when getting matches",
        error: error,
      });
    }
  },

  latest: async function (req, res) {
    console.log("kjut");
    try {
      const latestMatch = await MatchModel.findOne()
        .sort({ createdAt: -1 })
        .populate("team1 team2");
      res.json(latestMatch);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Napaka pri pridobivanju zadnje tekme.", error });
    }
  },

  /**
   * matchController.show()
   */
  show: async function (req, res) {
    try {
      const id = req.params.id;
      const match = await MatchModel.findOne({ _id: id });

      if (!match) {
        return res.status(404).json({
          message: "No such match",
        });
      }

      return res.json(match);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting match.",
        error: err,
      });
    }
  },

  /**
   * matchController.create()
   */
  create: async function (req, res) {
    try {
      const match = new MatchModel({
        team1Id: req.body.team1Id,
        team2Id: req.body.team2Id,
        team1: req.body.team1,
        team2: req.body.team2,
        time: req.body.time,
        team1Goals: 0,
        team2Goals: 0,
        team1Scorers: [],
        team2Scorers: [],
        matchPlayed: false,
        date: req.body.date,
        matchday: req.body.matchday,
        winner: null,
      });
      await match.save();
      return res.status(201).json({
        message: "Match created",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error when creating Team",
        error: err,
      });
    }
  },

  /**
   * matchController.update()
   */
  update: async function (req, res) {
    var id = req.params.id;

    try {
      let match = await MatchModel.findOne({ _id: id }).exec();

      if (!match) {
        return res.status(404).json({
          message: "No such match",
        });
      }
      match.team1Id = req.body.team1Id || match.team1Id;
      match.team2Id = req.body.team2Id || match.team2Id;
      match.team1 = req.body.team1 || match.team1;
      match.team2 = req.body.team2 || match.team2;
      match.time = req.body.time || match.time;
      match.team1Goals = req.body.team1Goals || match.team1Goals;
      match.team2Goals = req.body.team2Goals || match.team2Goals;
      match.team1Scorers = req.body.team1Scorers || match.team1Scorers;
      match.team2Scorers = req.body.team2Scorers || match.team2Scorers;
      match.matchPlayed = req.body.matchPlayed || match.matchPlayed;
      match.date = req.body.date || match.date;
      match.matchday = req.body.matchday || match.matchday;
      match.winner = req.body.winner || match.winner;

      match = await match.save();

      return res.json(match);
    } catch (err) {
      return res.status(500).json({
        message: "Error when updating match.",
        error: err,
      });
    }
  },

  /**
   * matchController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    MatchModel.findByIdAndRemove(id, function (err, match) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the match.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
