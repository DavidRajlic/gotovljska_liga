var teamModel = require('../models/TeamModel.js')

/**
 * TeamController.js
 *
 * @description :: Server-side logic for managing Teams.
 */
module.exports = {

    /**
     * TeamController.list()
     */
    list: function (req, res) {
        teamModel.find(function (err, Teams) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Team.',
                    error: err
                });
            }

            return res.json(Teams);
        });
    },

    /**
     * TeamController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        teamModel.findOne({_id: id}, function (err, Team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Team.',
                    error: err
                });
            }

            if (!Team) {
                return res.status(404).json({
                    message: 'No such Team'
                });
            }

            return res.json(Team);
        });
    },

    /**
     * TeamController.create()
     */
    create: function (req, res) {
        var Team = new teamModel({
			name : req.body.name,
			players : req.body.players,
			points : req.body.points,
			goalsScored : req.body.goalsScored,
			goalsConceded : req.body.goalsConceded,
			goalDiffrence : req.body.goalDiffrence,
			matchesPlayed : req.body.matchesPlayed,
			wins : req.body.wins,
			draws : req.body.draws,
			losses : req.body.losses
        });

        Team.save(function (err, Team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Team',
                    error: err
                });
            }

            return res.status(201).json(Team);
        });
    },

    /**
     * TeamController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        teamModel.findOne({_id: id}, function (err, Team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Team',
                    error: err
                });
            }

            if (!Team) {
                return res.status(404).json({
                    message: 'No such Team'
                });
            }

            Team.name = req.body.name ? req.body.name : Team.name;
			Team.players = req.body.players ? req.body.players : Team.players;
			Team.points = req.body.points ? req.body.points : Team.points;
			Team.goalsScored = req.body.goalsScored ? req.body.goalsScored : Team.goalsScored;
			Team.goalsConceded = req.body.goalsConceded ? req.body.goalsConceded : Team.goalsConceded;
			Team.goalDiffrence = req.body.goalDiffrence ? req.body.goalDiffrence : Team.goalDiffrence;
			Team.matchesPlayed = req.body.matchesPlayed ? req.body.matchesPlayed : Team.matchesPlayed;
			Team.wins = req.body.wins ? req.body.wins : Team.wins;
			Team.draws = req.body.draws ? req.body.draws : Team.draws;
			Team.losses = req.body.losses ? req.body.losses : Team.losses;
			
            Team.save(function (err, Team) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Team.',
                        error: err
                    });
                }

                return res.json(Team);
            });
        });
    },

    /**
     * TeamController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        teamModel.findByIdAndRemove(id, function (err, Team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Team.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
