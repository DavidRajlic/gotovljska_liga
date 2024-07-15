var express = require("express");
var router = express.Router();
var roundController = require("../controllers/roundController.js");

/*
 * GET
 */
router.get("/", roundController.list);
router.get("/latest", roundController.list);

/*
 * GET
 */
router.get("/:id", roundController.show);

/*
 * POST
 */
router.post("/", roundController.create);

/*
 * PUT
 */
router.put("/:id", roundController.update);

/*
 * DELETE
 */
router.delete("/:id", roundController.remove);

module.exports = router;
