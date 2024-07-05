var express = require('express');
var router = express.Router();
var playerController = require('../controllers/playerController.js');

/*
 * GET
 */
router.get('/', playerController.list);

/*
 * GET
 */
router.get('/:id', playerController.show);

/*
 * POST
 */
router.post('/', playerController.create);

/*
 * PUT
 */
router.put('/:id', playerController.update);

/*
 * DELETE
 */
router.delete('/:id', playerController.remove);

module.exports = router;
