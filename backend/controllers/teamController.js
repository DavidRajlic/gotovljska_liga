const teamModel = require("../models/TeamModel.js");
const PlayerModel = require("../models/playerModel.js");

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

  showTeamWithPlayers: async function (req, res) {
    const teamId = req.params.id;

    try {
      // Pridobi ekipo
      const team = await teamModel.findById(teamId);

      if (!team) {
        return res.status(404).json({ message: "Ekipa ni bila najdena" });
      }

      // Pridobi igralce te ekipe
      const players = await PlayerModel.find({ teamId: teamId });

      return res.json({
        team: team,
        players: players,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Napaka pri pridobivanju ekipe in igralcev.",
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

      // Ensure the incoming values are numbers where necessary, default to 0 if not provided

      const goalsScored = parseInt(req.body.goalsScored, 10) || 0;
      const goalsConceded = parseInt(req.body.goalsConceded, 10) || 0;
      const matchesPlayed = parseInt(req.body.matchesPlayed, 10) || 0;
      const yellowCards = parseInt(req.body.yellowCards, 10) || 0;
      const redCards = parseInt(req.body.redCards, 10) || 0;
      const wins = parseInt(req.body.wins, 10) || 0;
      const draws = parseInt(req.body.draws, 10) || 0;
      const losses = parseInt(req.body.losses, 10) || 0;

      // Only check for NaN values if the property is provided in the request body
      if (
        (req.body.goalsScored && isNaN(goalsScored)) ||
        (req.body.goalsConceded && isNaN(goalsConceded)) ||
        (req.body.matchesPlayed && isNaN(matchesPlayed)) ||
        (req.body.yellowCards && isNaN(yellowCards)) ||
        (req.body.redCards && isNaN(redCards)) ||
        (req.body.wins && isNaN(wins)) ||
        (req.body.draws && isNaN(draws)) ||
        (req.body.losses && isNaN(losses))
      ) {
        return res.status(400).json({
          message:
            "Invalid input values. Expected numbers for points, goalsScored, goalsConceded, matchesPlayed, yellowCards, redCards, wins, draws, and losses.",
        });
      }

      // Only update the fields that are provided in the request body
      if (req.body.name) team.name = req.body.name;
      if (req.body.players) team.players = req.body.players;
      if (req.body.points) team.points += req.body.points;
      if (req.body.goalsScored) team.goalsScored += goalsScored;
      if (req.body.goalsConceded) team.goalsConceded += goalsConceded;
      if (req.body.matchesPlayed) team.matchesPlayed += matchesPlayed;
      if (req.body.yellowCards) team.yellowCards += yellowCards;
      if (req.body.redCards) team.redCards += redCards;
      if (req.body.wins) team.wins += wins;
      if (req.body.draws) team.draws += draws;
      if (req.body.losses) team.losses += losses;

      // Update goal difference
      team.goalDiffrence = team.goalsScored - team.goalsConceded;

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

      team.points = team.points - points;
      team.goalsScored = Math.max(team.goalsScored - goalsScored, 0);
      team.goalsConceded = Math.max(team.goalsConceded - goalsConceded, 0);
      team.goalDifference = team.goalsScored - team.goalsConceded;
      team.matchesPlayed = Math.max(team.matchesPlayed - matchesPlayed, 0);
      team.yellowCards = Math.max(team.yellowCards - yellowCards, 0);
      team.redCards = Math.max(team.redCards - redCards, 0);
      team.wins = Math.max(team.wins - wins, 0);
      team.draws = Math.max(team.draws - draws, 0);
      team.losses = Math.max(team.losses - losses, 0);

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
