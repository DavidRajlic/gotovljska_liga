const teamModel = require("../models/teamModel.js");

/**
 * TeamController.js
 *
 * @description :: Server-side logic for managing Teams.
 */
module.exports = {
  /**
   * TeamController.list()
   */
  list: async function (req, res) {
    try {
      const teams = await teamModel.find();
      return res.json(teams);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting Teams.",
        error: err,
      });
    }
  },

  /**
   * TeamController.show()
   */
  show: async function (req, res) {
    const id = req.params.id;

    try {
      const team = await teamModel.findById({ _id: id });
      if (!team) {
        return res.status(404).json({
          message: "No such Team",
        });
      }
      return res.json(team);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting Team.",
        error: err,
      });
    }
  },

  /**
   * TeamController.create()
   */
  create: async function (req, res) {
    try {
      const newTeam = new teamModel({
        name: req.body.name,
        players: [],
        points: 0,
        goalsScored: 0,
        goalsConceded: 0,
        goalDiffrence: 0,
        matchesPlayed: 0,
        yellowCards: 0,
        redCards: 0,
        wins: 0,
        draws: 0,
        losses: 0,
      });

      await newTeam.save();
      return res.status(201).json({
        message: "Team created",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error when creating Team",
        error: err,
      });
    }
  },

  /**
   * TeamController.update()
   */
  update: async function (req, res) {
    const id = req.params.id;
    try {
      const team = await teamModel.findOne({ _id: id });
      if (!team) {
        return res.status(404).json({
          message: "No such Team",
        });
      }

      // Ensure the incoming values are numbers where necessary
      const points = parseInt(req.body.points, 10);
      const goalsScored = parseInt(req.body.goalsScored, 10);
      const goalsConceded = parseInt(req.body.goalsConceded, 10);
      const matchesPlayed = parseInt(req.body.matchesPlayed, 10);
      const yellowCards = parseInt(req.body.yellowCards, 10);
      const redCards = parseInt(req.body.redCards, 10);
      const wins = parseInt(req.body.wins, 10);
      const draws = parseInt(req.body.draws, 10);
      const losses = parseInt(req.body.losses, 10);

      if (
        isNaN(points) ||
        isNaN(goalsScored) ||
        isNaN(goalsConceded) ||
        isNaN(matchesPlayed) ||
        isNaN(yellowCards) ||
        isNaN(redCards) ||
        isNaN(wins) ||
        isNaN(draws) ||
        isNaN(losses)
      ) {
        return res.status(400).json({
          message:
            "Invalid input values. Expected numbers for points, goalsScored, goalsConceded, matchesPlayed, yellowCards, redCards, wins, draws, and losses.",
        });
      }

      team.name = req.body.name || team.name;
      team.players = req.body.players || team.players;
      team.points = points + team.points;
      team.goalsScored = goalsScored + team.goalsScored;
      team.goalsConceded = goalsConceded + team.goalsConceded;
      team.goalDiffrence = team.goalsScored - team.goalsConceded;
      team.matchesPlayed = matchesPlayed + team.matchesPlayed;
      team.yellowCards = yellowCards + team.yellowCards;
      team.redCards = redCards + team.redCards;
      team.wins = wins + team.wins;
      team.draws = draws + team.draws;
      team.losses = losses + team.losses;

      const updatedTeam = await team.save();
      return res.json(updatedTeam);
    } catch (err) {
      console.error("Error when updating Team:", err);

      // Check if the error is a validation error
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error when updating Team.",
          error: err.errors,
        });
      }

      // Check if the error is related to database connectivity
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(500).json({
          message: "Database error when updating Team.",
          error: err,
        });
      }

      return res.status(500).json({
        message: "Error when updating Team.",
        error: err,
      });
    }
  },

  updateTeam: async function (req, res) {
    const id = req.params.id;
    try {
      const team = await teamModel.findOne({ _id: id });
      if (!team) {
        return res.status(404).json({
          message: "No such Team",
        });
      }

      // Ensure the incoming values are numbers where necessary
      const points =
        req.body.points !== undefined ? parseInt(req.body.points, 10) : 0;
      const goalsScored =
        req.body.goalsScored !== undefined
          ? parseInt(req.body.goalsScored, 10)
          : 0;
      const goalsConceded =
        req.body.goalsConceded !== undefined
          ? parseInt(req.body.goalsConceded, 10)
          : 0;
      const matchesPlayed =
        req.body.matchesPlayed !== undefined
          ? parseInt(req.body.matchesPlayed, 10)
          : 0;
      const yellowCards =
        req.body.yellowCards !== undefined
          ? parseInt(req.body.yellowCards, 10)
          : 0;
      const redCards =
        req.body.redCards !== undefined ? parseInt(req.body.redCards, 10) : 0;
      const wins =
        req.body.wins !== undefined ? parseInt(req.body.wins, 10) : 0;
      const draws =
        req.body.draws !== undefined ? parseInt(req.body.draws, 10) : 0;
      const losses =
        req.body.losses !== undefined ? parseInt(req.body.losses, 10) : 0;

      // Update fields if provided in the request
      if (req.body.name !== undefined) team.name = req.body.name;
      if (req.body.players !== undefined) team.players = req.body.players;

      team.points += points;
      team.goalsScored += goalsScored;
      team.goalsConceded += goalsConceded;
      team.goalDifference = team.goalsScored - team.goalsConceded;
      team.matchesPlayed += matchesPlayed;
      team.yellowCards += yellowCards;
      team.redCards += redCards;
      team.wins += wins;
      team.draws += draws;
      team.losses += losses;

      const updatedTeam = await team.save();
      return res.json(updatedTeam);
    } catch (err) {
      console.error("Error when updating Team:", err);

      // Check if the error is a validation error
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error when updating Team.",
          error: err.errors,
        });
      }

      // Check if the error is related to database connectivity
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(500).json({
          message: "Database error when updating Team.",
          error: err,
        });
      }

      return res.status(500).json({
        message: "Error when updating Team.",
        error: err,
      });
    }
  },

  updateTeamPlayers: async function (req, res) {
    const id = req.params.id;
    try {
      const team = await teamModel.findOne({ _id: id });
      if (!team) {
        return res.status(404).json({
          message: "No such Team",
        });
      }

      team.players = req.body.players;
      const updatedTeam = await team.save();
      return res.json(updatedTeam);
    } catch (err) {
      console.error("Error when updating Team:", err);

      // Check if the error is a validation error
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error when updating Team.",
          error: err.errors,
        });
      }

      // Check if the error is related to database connectivity
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(500).json({
          message: "Database error when updating Team.",
          error: err,
        });
      }

      return res.status(500).json({
        message: "Error when updating Team.",
        error: err,
      });
    }
  },
  /**
   * TeamController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;

    try {
      const team = await teamModel.findByIdAndDelete(id);

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      return res.status(204).json();
    } catch (err) {
      return res.status(500).json({
        message: "Error when deleting the Team.",
        error: err,
      });
    }
  },
};
