var PlayerModel = require('../models/playerModel.js');

/**
 * playerController.js
 *
 * @description :: Server-side logic for managing players.
 */
module.exports = {

    /**
     * playerController.list()
     */
    list: function (req, res) {
        PlayerModel.find(function (err, players) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting player.',
                    error: err
                });
            }

            return res.json(players);
        });
    },

    /**
     * playerController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PlayerModel.findOne({_id: id}, function (err, player) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting player.',
                    error: err
                });
            }

            if (!player) {
                return res.status(404).json({
                    message: 'No such player'
                });
            }

            return res.json(player);
        });
    },

    /**
     * playerController.create()
     */
    create: function (req, res) {
        var player = new PlayerModel({
			name : req.body.name,
			goalsScored : req.body.goalsScored,
			yellowCards : req.body.yellowCards,
			redCards : req.body.redCards
        });

        player.save(function (err, player) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating player',
                    error: err
                });
            }

            return res.status(201).json(player);
        });
    },

    /**
     * playerController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PlayerModel.findOne({_id: id}, function (err, player) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting player',
                    error: err
                });
            }

            if (!player) {
                return res.status(404).json({
                    message: 'No such player'
                });
            }

            player.name = req.body.name ? req.body.name : player.name;
			player.goalsScored = req.body.goalsScored ? req.body.goalsScored : player.goalsScored;
			player.yellowCards = req.body.yellowCards ? req.body.yellowCards : player.yellowCards;
			player.redCards = req.body.redCards ? req.body.redCards : player.redCards;
			
            player.save(function (err, player) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating player.',
                        error: err
                    });
                }

                return res.json(player);
            });
        });
    },

    /**
     * playerController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PlayerModel.findByIdAndRemove(id, function (err, player) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the player.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
