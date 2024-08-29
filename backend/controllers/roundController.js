var RoundModel = require("../models/roundModel.js");

/**
 * roundController.js
 *
 * @description :: Server-side logic for managing rounds.
 */
module.exports = {
  /**
   * roundController.list()
   */
  list: async function (req, res) {
    try {
      const rounds = await RoundModel.find();
      return res.json(rounds);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting round.",
        error: err,
      });
    }
  },

  latest: async function (req, res) {
    try {
      const latestRound = await RoundModel.findOne()
        .sort({ createdAt: -1 })
        .populate("matches");
      res.json(latestRound);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Napaka pri pridobivanju zadnjega kola.", error });
    }
  },

  /**
   * roundController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    RoundModel.findOne({ _id: id }, function (err, round) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting round.",
          error: err,
        });
      }

      if (!round) {
        return res.status(404).json({
          message: "No such round",
        });
      }

      return res.json(round);
    });
  },

  /**
   * roundController.create()
   */
  create: async function (req, res) {
    try {
      const round = new RoundModel({
        round: req.body.round,
        date: req.body.date,
        matches: req.body.matches,
        pinned: req.body.pinned,
      });

      await round.save();
      return res.status(201).json({
        message: "Round created",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error when creating round",
        error: err,
      });
    }
  },

  /**
   * roundController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    RoundModel.findOne({ _id: id }, function (err, round) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting round",
          error: err,
        });
      }

      if (!round) {
        return res.status(404).json({
          message: "No such round",
        });
      }

      round.round = req.body.round ? req.body.round : round.round;
      round.date = req.body.date ? req.body.date : round.date;
      round.matches = req.body.matches ? req.body.matches : round.matches;
      round.pinned = req.body.pinned ? req.body.pinned : round.pinned;

      round.save(function (err, round) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating round.",
            error: err,
          });
        }

        return res.json(round);
      });
    });
  },

  update: async function (req, res) {
    const id = req.params.id;

    try {
      const round = await RoundModel.findOne({ _id: id });

      if (!round) {
        return res.status(404).json({
          message: "No such round",
        });
      }

      round.round = req.body.round !== undefined ? req.body.round : round.round;
      round.date = req.body.date !== undefined ? req.body.date : round.date;
      round.matches =
        req.body.matches !== undefined ? req.body.matches : round.matches;
      round.pinned =
        req.body.pinned !== undefined ? req.body.pinned : round.pinned;

      const updatedRound = await round.save();

      return res.json(updatedRound);
    } catch (err) {
      return res.status(500).json({
        message: "Error when updating round.",
        error: err,
      });
    }
  },

  /**
   * roundController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    RoundModel.findByIdAndRemove(id, function (err, round) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the round.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
