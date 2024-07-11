var PlayerModel = require("../models/playerModel.js");

/**
 * playerController.js
 *
 * @description :: Server-side logic for managing players.
 */
module.exports = {
  /**
   * playerController.list()
   */
  list: async function (req, res) {
    try {
      const players = await PlayerModel.find();
      return res.json(players);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting player.",
        error: err,
      });
    }
  },

  /**
   * playerController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    PlayerModel.findOne({ _id: id }, function (err, player) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting player.",
          error: err,
        });
      }

      if (!player) {
        return res.status(404).json({
          message: "No such player",
        });
      }

      return res.json(player);
    });
  },

  /**
   * playerController.create()
   */
  create: async function (req, res) {
    try {
      const player = new PlayerModel({
        name: req.body.name,
        goalsScored: req.body.goalsScored,
        yellowCards: req.body.yellowCards,
        redCards: req.body.redCards,
      });

      await player.save();
      return res.status(201).json({
        message: "Player created",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error when creating player",
        error: err,
      });
    }
  },

  /**
   * playerController.update()
   */
  update: async function (req, res) {
    console.log("heree");
    try {
      const id = req.params.id;
      const player = await PlayerModel.findOne({ _id: id });

      if (!player) {
        return res.status(404).json({
          message: "No such player",
        });
      }

      player.name = req.body.name || player.name;
      player.goalsScored = req.body.goalsScored + player.goalsScored;
      player.yellowCards = req.body.yellowCards + player.yellowCards;
      player.redCards = req.body.redCards + player.redCards;

      const updatedPlayer = await player.save();
      return res.json(updatedPlayer);
    } catch (err) {
      return res.status(500).json({
        message: "Error when updating player.",
        error: err,
      });
    }
  },

  /**
   * playerController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    PlayerModel.findByIdAndRemove(id, function (err, player) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the player.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
