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
      const team = await teamModel.findOne({ _id: id });
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
        players: [""],
        points: 0,
        goalsScored: 0,
        goalsConceded: 0,
        goalDiffrence: 0,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
      });

      await newTeam.save();
      console.log("kulll");
      return res.status(201).json({
        message: "Team created",
      });
    } catch (err) {
      console.log(err);
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

      team.name = req.body.name || team.name;
      team.players = req.body.players || team.players;
      team.points = req.body.points || team.points;
      team.goalsScored = req.body.goalsScored || team.goalsScored;
      team.goalsConceded = req.body.goalsConceded || team.goalsConceded;
      team.goalDiffrence = req.body.goalDiffrence || team.goalDiffrence;
      team.matchesPlayed = req.body.matchesPlayed || team.matchesPlayed;
      team.wins = req.body.wins || team.wins;
      team.draws = req.body.draws || team.draws;
      team.losses = req.body.losses || team.losses;

      const updatedTeam = await team.save();
      return res.json(updatedTeam);
    } catch (err) {
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
