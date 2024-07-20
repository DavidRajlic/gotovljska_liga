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
  show: async function (req, res) {
    const id = req.params.id;

    try {
      const player = await PlayerModel.findById({ _id: id });
      if (!player) {
        return res.status(404).json({
          message: "No such player",
        });
      }
      return res.json(player);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting player.",
        error: err,
      });
    }
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
    try {
      const id = req.params.id;
      const player = await PlayerModel.findOne({ _id: id });

      if (!player) {
        return res.status(404).json({
          message: "No such player",
        });
      }

      // Ensure the incoming values are numbers
      const goalsScored = parseInt(req.body.goalsScored, 10);
      const yellowCards = parseInt(req.body.yellowCards, 10);
      const redCards = parseInt(req.body.redCards, 10);

      if (isNaN(goalsScored) || isNaN(yellowCards) || isNaN(redCards)) {
        return res.status(400).json({
          message:
            "Invalid input values. Expected numbers for goalsScored, yellowCards, and redCards.",
        });
      }

      player.name = req.body.name || player.name;
      player.goalsScored = goalsScored + player.goalsScored;
      player.yellowCards = yellowCards + player.yellowCards;
      player.redCards = redCards + player.redCards;

      // Attempt to save the player and catch any errors
      const updatedPlayer = await player.save();
      return res.json(updatedPlayer);
    } catch (err) {
      console.error("Error when updating player:", err);

      // Check if the error is a validation error
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error when updating player.",
          error: err.errors,
        });
      }

      // Check if the error is related to database connectivity
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(500).json({
          message: "Database error when updating player.",
          error: err,
        });
      }

      return res.status(500).json({
        message: "Error when updating player.",
        error: err,
      });
    }
  },

  updatePlayer: async function (req, res) {
    try {
      const id = req.params.id;
      const player = await PlayerModel.findOne({ _id: id });

      if (!player) {
        return res.status(404).json({
          message: "No such player",
        });
      }

      // Posodobi igralčeve statistike
      const goalsScored =
        req.body.goalsScored !== undefined
          ? parseInt(req.body.goalsScored, 10)
          : 0;
      const yellowCards =
        req.body.yellowCards !== undefined
          ? parseInt(req.body.yellowCards, 10)
          : 0;
      const redCards =
        req.body.redCards !== undefined ? parseInt(req.body.redCards, 10) : 0;

      // Odštejemo vrednosti od trenutnih statistik igralca
      player.goalsScored = player.goalsScored - goalsScored;
      player.yellowCards = player.yellowCards - yellowCards;
      player.redCards = player.redCards - redCards;

      // Poskrbimo, da vrednosti ne gredo pod 0
      player.goalsScored = Math.max(player.goalsScored, 0);
      player.yellowCards = Math.max(player.yellowCards, 0);
      player.redCards = Math.max(player.redCards, 0);
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
  remove: async function (req, res) {
    const id = req.params.id;

    try {
      const player = await PlayerModel.findByIdAndDelete(id);

      if (!player) {
        return res.status(404).json({ message: "player not found" });
      }

      return res.status(204).json();
    } catch (err) {
      return res.status(500).json({
        message: "Error when deleting the player.",
        error: err,
      });
    }
  },
};
